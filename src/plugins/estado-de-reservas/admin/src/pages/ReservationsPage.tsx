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

const formatReservationDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  const month = date.toLocaleString('es-ES', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);
  return `${monthCapitalized} ${day}, ${year}`;
};

const formatReservationTime = (timeString: string | null): string => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':').map(Number);
  const amPm = hours >= 12 ? 'PM' : 'AM';
  const hoursIn12HourFormat = hours % 12 || 12;
  return `${hoursIn12HourFormat}:${minutes.toString().padStart(2, '0')} ${amPm}`;
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const month = date.toLocaleString('es-CO', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);
  return `${monthCapitalized} ${day}, ${year}`;
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
};
const formatPhoneNumber = (phoneNumber: string | null): string => {
  if (!phoneNumber) return '';
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (cleaned.length !== 10) {
    return 'Número inválido';
  }
  const formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7, 10)}`;
  return formatted;
};

const renderState = (state: string) => {
  switch (state) {
    case 'Confirmada':
      return <span style={{ color: '#8BC34A' }}>Confirmada</span>;
    case 'Pendiente':
      return <span style={{ color: '#FFEB3B' }}>Pendiente</span>;
    case 'Cancelada':
      return <span style={{ color: '#F44336' }}>Cancelada</span>;    
    default:
      return <span>{state}</span>;
  }
};


const ReservationsPage = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState<Date | null>(new Date());
  const [showFuture, setShowFuture] = useState(true);
  const { formatMessage } = useIntl();
  const { get, put } = useFetchClient();
  const { toggleNotification } = useNotification();

  const token = process.env.STRAPI_ADMIN_TOKEN_PLUGINS || '';

  const fetchReservations = async () => {
    if (!filterDate) return;
    const formattedDate = filterDate.toISOString().split('T')[0];
    const query = showFuture
      ? `?filters[reservationDate][$gte]=${formattedDate}&filters[state][$ne]=Cancelada&sort=reservationDate&pagination[page]=1&pagination[pageSize]=1000`
      : `?filters[reservationDate][$eq]=${formattedDate}&filters[state][$ne]=Cancelada&sort=reservationDate&pagination[page]=1&pagination[pageSize]=1000`;

    const url = `/api/reservas${query}&populate=*`;

    try {
      const { data: json } = await get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (json.data) {
        setReservations(json.data);
      } else {
        setReservations([]);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  useEffect(() => {
    fetchReservations();
    const intervalId = setInterval(fetchReservations, 30000); // 30000ms = 30s
    return () => clearInterval(intervalId);
  }, [filterDate, showFuture]);

  const handleCheckIn = async (id: string) => {
    try {
      const response = await put(
        `/api/reservas/${id}`,
        { data: { check_in_status: true } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        toggleNotification({
          type: 'success',
          message: 'Check-in realizado con éxito',
        });
        fetchReservations();
      } else {
        console.error('Error in check-in:', response.data);
        toggleNotification({
          type: 'danger',
          message: 'Error al hacer check-in',
        });
      }
    } catch (error) {
      console.error('Error in check-in:', error);
      toggleNotification({
        type: 'danger',
        message: 'Error al hacer check-in',
      });
    }
  };

  return (
    <Main>
      {/* Encabezado */}
      <Box padding="6px 12px" background="neutral100">
        <Typography variant="alpha">
          <span style={{ paddingLeft: '20px' }}>
            {formatMessage({
              id: 'estado-de-reservas.plugin.name',
              defaultMessage: 'Estado de Reservas',
            })}
          </span>
        </Typography>
      </Box>

      {/* Contenido principal */}
      <Box padding="6px 12px">
        <Box
          padding="4px"
          marginBottom="4px"
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
            onChange={(date: Date | null) => {
              if (date) setFilterDate(date);
            }}
            value={filterDate}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Switch
              checked={showFuture}
              onLabel="Mostrar reservas futuras"
              offLabel="Ocultar reservas futuras"
              onCheckedChange={(value: boolean) => setShowFuture(value)}
            />
            <span style={{ fontSize: '14px' }}>Mostrar reservas futuras</span>
          </div>
          <Button onClick={fetchReservations}>Actualizar</Button>
        </Box>

        <Table>
          <Thead>
            <Tr>
              <Th>
                <span style={{ margin: 'auto', display: 'block', fontSize: '14px' }}>PEDIDO</span>
              </Th>
              <Th style={{ textAlign: 'center' }}>
                <span style={{ margin: 'auto', display: 'block', fontSize: '12px' }}>ESTADO</span>
              </Th>
              <Th style={{ textAlign: 'center' }}>
                <span style={{ margin: 'auto', display: 'block', fontSize: '12px' }}>
                  FECHA PEDIDO
                </span>
              </Th>
              <Th style={{ textAlign: 'center' }}>
                <span style={{ margin: 'auto', display: 'block', fontSize: '12px' }}>
                  FECHA RESERVA
                </span>
              </Th>
              <Th style={{ textAlign: 'center' }}>
                <span style={{ margin: 'auto', display: 'block', fontSize: '12px' }}>CLIENTE</span>
              </Th>
              <Th style={{ textAlign: 'center' }}>
                <span style={{ margin: 'auto', display: 'block', fontSize: '12px' }}>CEDULA</span>
              </Th>
              <Th style={{ textAlign: 'center' }}>
                <span style={{ margin: 'auto', display: 'block', fontSize: '12px' }}>CELULAR</span>
              </Th>
              <Th style={{ textAlign: 'center' }}>
                <span style={{ margin: 'auto', display: 'block', fontSize: '12px' }}>PERSONAS</span>
              </Th>
              <Th style={{ textAlign: 'center' }}>
                <span style={{ margin: 'auto', display: 'block', fontSize: '12px' }}>PLAN</span>
              </Th>
              <Th style={{ textAlign: 'center' }}>
                <span style={{ margin: 'auto', display: 'block', fontSize: '12px' }}>
                  CELEBRACIONES
                </span>
              </Th>
              <Th style={{ textAlign: 'center' }}>
                <span style={{ margin: 'auto', display: 'block', fontSize: '12px' }}>DESDE</span>
              </Th>
              <Th style={{ textAlign: 'center' }}>
                <span style={{ margin: 'auto', display: 'block', fontSize: '12px' }}>VALOR</span>
              </Th>
              <Th style={{ textAlign: 'center' }}>
                <span style={{ margin: 'auto', display: 'block', fontSize: '12px' }}>CHECK IN</span>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {reservations.map((reservation) => {
              const {
                id,
                documentId,
                reservationNumber,
                state,
                createdAt,
                creationDate,
                reservationDate,
                customerName,
                customerLastname,
                customerDocument,
                customerPhone,
                guests,
                plan,
                servicios_adicionale,
                reservationTime,
                totalPriceReservation,
                check_in_status,
              } = reservation;

              return (
                <Tr
                  key={id}
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
                  <Td style={{ textAlign: 'center', fontSize: '12px' }}>{reservationNumber}</Td>
                  <Td style={{ textAlign: 'center', fontSize: '12px' }}>{renderState(state)}</Td>
                  <Td style={{ textAlign: 'center', fontSize: '12px' }}>{formatDate(createdAt)}</Td>
                  <Td style={{ textAlign: 'center', fontSize: '12px' }}>
                    {formatReservationDate(reservationDate)}
                  </Td>
                  <Td
                    style={{ textTransform: 'uppercase', textAlign: 'center', fontSize: '12px' }}
                  >{`${customerName} ${customerLastname}`}</Td>
                  <Td style={{ textAlign: 'center', fontSize: '12px' }}>
                    {formatNumber(customerDocument)}
                  </Td>
                  <Td style={{ textAlign: 'center', fontSize: '12px' }}>
                    {formatPhoneNumber(customerPhone)}
                  </Td>
                  <Td style={{ textAlign: 'center', fontSize: '12px' }}>{guests}</Td>
                  <Td style={{ textAlign: 'center', fontSize: '12px' }}>{plan?.name || '-'}</Td>
                  <Td style={{ textAlign: 'center', fontSize: '12px' }}>
                    {servicios_adicionale
                      ? reservation.servicios_adicionale.name
                      : '-'}
                  </Td>
                  <Td style={{ textAlign: 'center', fontSize: '12px' }}>
                    {formatReservationTime(reservationTime)}
                  </Td>
                  <Td style={{ textAlign: 'center', fontSize: '12px' }}>
                    {formatCurrency(totalPriceReservation)}
                  </Td>
                  <Td style={{ textAlign: 'center', fontSize: '12px' }}>
                    {check_in_status ? (
                      <Typography style={{ color: '#8BC34A' }}>Checked</Typography>
                    ) : (
                      <Button onClick={() => handleCheckIn(documentId)} >Check In</Button>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Main>
  );
};

export { ReservationsPage };
