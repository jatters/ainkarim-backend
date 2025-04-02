import React, { useState, useEffect } from 'react';
import {
  Main,
  Box,
  Typography,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  DatePicker,
  Button,
  Switch,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';

/* ----------------------------------------------------------
   1) Funciones de ayuda para formatear fechas, horas y números
   ---------------------------------------------------------- */

/**
 * Convierte una fecha (string en ISO o "YYYY-MM-DD") en
 * un formato "Febrero 28, 2025" en español.
 */
function getLocalDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const formatted = date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  // Suele quedar "28 de febrero de 2025"
  const parts = formatted.split(' ');
  // => ["28", "de", "febrero", "de", "2025"]
  if (parts.length >= 5) {
    const day = parts[0];
    const monthCapital = parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
    const year = parts[4];
    return `${monthCapital} ${day}, ${year}`;
  }
  return formatted;
}

/**
 * Convierte hora "HH:MM:SS.000" en "HH:MM AM/PM"
 */
function formatTime(timeString: string | null): string {
  if (!timeString) return '';
  const [hoursStr, minutes] = timeString.split(':');
  const hours = parseInt(hoursStr, 10);
  const amPm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes} ${amPm}`;
}

/**
 * Formatea un número sin decimales con separadores de miles
 */
function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

/* ----------------------------------------------------------
   2) Generar rango de fechas (un día o 3 meses)
   ---------------------------------------------------------- */
function getDateRange(start: Date, end: Date) {
  const dates = [];
  const current = new Date(start);
  while (current.getTime() <= end.getTime()) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/* ----------------------------------------------------------
   3) Construir filas (plan × día × horario)
   ---------------------------------------------------------- */
function buildRows(plans: any[], daysArray: Date[]) {
  const rows: any[] = [];

  for (const plan of plans) {
    // Ajusta si tu backend envía data/attributes.
    // Aquí asumo que plan es plano: { name, max_reservations, horarios, reservas... }
    const planName = plan.name || '-';
    const maxRes = plan.max_reservations || 0;
    const horarios = plan.horarios || [];
    const reservas = plan.reservas || [];

    // Para cada día del rango
    for (const day of daysArray) {
      const dayStr = day.toISOString().split('T')[0]; // "YYYY-MM-DD"

      // Para cada horario
      for (const horario of horarios) {
        const horarioTime: string = horario?.startTime || '00:00:00.000';

        // Filtramos reservas que coincidan con (date, time), excluyendo Canceladas
        const matching = reservas.filter((r: any) => {
          if (r.state === 'Cancelada') return false;
          const sameDay = r.reservationDate === dayStr;
          const sameTime = r.reservationTime.slice(0, 5) === horarioTime.slice(0, 5);
          return sameDay && sameTime;
        });

        // Sumar cuántas personas
        const personsReserved = matching.reduce((sum: number, r: any) => sum + (r.guests || 0), 0);
        const availableCapacity = maxRes - personsReserved;

        // Generar la fila. (Si prefieres ocultar filas con 0 cupos, haz un if)
        rows.push({
          planName,
          date: dayStr,
          horarioTime,
          personsReserved,
          availableCapacity,
          maxReservations: maxRes,
        });
      }
    }
  }

  return rows;
}

/* ----------------------------------------------------------
   4) Componente principal
   ---------------------------------------------------------- */
const FreeSpacesPage = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(getLocalDate());
  //const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showFuture, setShowFuture] = useState(false);

  const { formatMessage } = useIntl();
  const { get } = useFetchClient();
  const { toggleNotification } = useNotification();

  // Token de entorno (si lo necesitas para la petición)
  const token = process.env.STRAPI_ADMIN_TOKEN_PLUGINS || '';

  // Lógica para obtener planes desde el backend
  const fetchPlans = async () => {
    try {
      // Por simplicidad, traemos "todo" con un pageSize grande,
      // y luego filtramos en el front.
      const url = '/api/planes?populate[0]=horarios&populate[1]=reservas&pagination[pageSize]=1000';

      const { data: json } = await get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (json.data) {
        // Ajusta según la estructura real que recibas del backend.
        // Si recibes planItem.attributes, mapéalos aquí.
        setPlans(json.data);
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toggleNotification({
        type: 'danger',
        message: 'Error al obtener planes',
      });
    }
  };

  // Al montar o cambiar la fecha / switch => recargamos planes
  useEffect(() => {
    console.log('Fecha seleccionada en ISO:', selectedDate?.toISOString().split('T')[0]);
    fetchPlans();
    const intervalId = setInterval(fetchPlans, 30000); // 30000ms = 30s
    return () => clearInterval(intervalId);
  }, [selectedDate, showFuture]);

  // Generar rango de fechas
  const today = new Date();
  let startDate = selectedDate || today;
  if (startDate < today) {
    // Si la fecha elegida es anterior a hoy, forzamos a hoy.
    // Si la fecha elegida es anterior a hoy, forzamos a hoy.
    startDate = today;
  }

  let endDate = new Date(startDate);
  if (showFuture) {
    // sumamos 3 meses
    endDate.setMonth(endDate.getMonth() + 3);
  } else {
    // sólo 1 día
    endDate = new Date(startDate);
  }

  // Creamos el array de días
  const daysArray = getDateRange(startDate, endDate);

  // Construimos filas
  const rows = buildRows(plans, daysArray);

  return (
    <Main>
      {/* Encabezado */}
      <Box padding="6px 12px" background="neutral100">
        <Typography variant="alpha">
          <span style={{ paddingLeft: '20px' }}>
            {formatMessage({
              id: 'reservas-libres.plugin.name',
              defaultMessage: 'Reservas Libres',
            })}
          </span>
        </Typography>
      </Box>

      {/* Contenido principal */}
      <Box padding="6px 12px">
        <Box
          style={{
            display: 'flex',
            gap: '5rem',
            alignItems: 'center',
            marginLeft: '20px',
            marginBottom: '20px',
            marginTop: '20px',
          }}
        >
          <DatePicker
            onChange={(date: Date | null) => setSelectedDate(date)}
            value={selectedDate}
          />
          {console.log('fecha', selectedDate)}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Switch
              checked={showFuture}
              onLabel="Mostrar fechas futuras"
              offLabel="Ocultar fechas futuras"
              onCheckedChange={(value: boolean) => setShowFuture(value)}
            />
            <span style={{ fontSize: '14px' }}>Mostrar fechas futuras</span>
          </div>
          <Button onClick={fetchPlans}>Actualizar</Button>
        </Box>

        <Table>
          <Thead>
            <Tr>
              <Th>
                <span style={{ margin: 'auto', display: 'block', fontSize: '14px' }}>PLAN</span>
              </Th>
              <Th>
                <span style={{ margin: 'auto', display: 'block', fontSize: '14px' }}>
                  FECHA DISPONIBLE
                </span>
              </Th>
              <Th>
                <span style={{ margin: 'auto', display: 'block', fontSize: '14px' }}>
                  HORA DISPONIBLE
                </span>
              </Th>
              <Th>
                <span style={{ margin: 'auto', display: 'block', fontSize: '14px' }}>
                  CUPOS DISPONIBLES
                </span>
              </Th>
              <Th>
                <span style={{ margin: 'auto', display: 'block', fontSize: '14px' }}>
                  PERSONAS RESERVADAS
                </span>
              </Th>
              <Th>
                <span style={{ margin: 'auto', display: 'block', fontSize: '14px' }}>
                  LÍMITE DE PERSONAS
                </span>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row, index) => (
              <Tr
                key={index}
                style={{
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLTableRowElement>) =>
                  (e.currentTarget.style.backgroundColor = '#343447')
                }
                onMouseLeave={(e: React.MouseEvent<HTMLTableRowElement>) =>
                  (e.currentTarget.style.backgroundColor = '')
                }
              >
                <Td style={{ textAlign: 'center', fontSize: '12px' }}>{row.planName}</Td>
                <Td style={{ textAlign: 'center', fontSize: '12px' }}>{formatDate(row.date)}</Td>
                <Td style={{ textAlign: 'center', fontSize: '12px' }}>
                  {formatTime(row.horarioTime)}
                </Td>
                <Td style={{ textAlign: 'center', fontSize: '12px' }}>
                  {row.availableCapacity > 0 ? (
                    <span style={{ color: '#8BC34A' }}>{row.availableCapacity}</span>
                  ) : (
                    <span style={{ color: '#F44336' }}>0</span>
                  )}{' '}
                </Td>
                <Td style={{ textAlign: 'center', fontSize: '12px' }}>
                  {formatNumber(row.personsReserved)}
                </Td>
                <Td style={{ textAlign: 'center', fontSize: '12px' }}>
                  {formatNumber(row.maxReservations)}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Main>
  );
};

export { FreeSpacesPage };
