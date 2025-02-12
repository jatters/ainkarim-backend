import { errors } from '@strapi/utils';
const { ApplicationError } = errors;

/**
 * Interfaz del Plan (ajusta si necesitas más campos).
 */
interface PlanEntity {
  id?: number;
  max_reservations?: number;
  reglas_planes?: Array<{
    isDayRestric?: boolean;
    day?: string;
    isRangeData?: boolean;
    rangeDateFrom?: string | Date;
    rangeDateUntil?: string | Date;
    isRangeHour?: boolean;
    rangeHourFrom?: string;
    rangeHourUntil?: string;
  }>;
  horarios?: Array<{
    id?: number;
    name?: string;
    startTime?: string; // p.ej. "13:00:00"
    endTime?: string;   // p.ej. "14:00:00"
  }>;
}

/**
 * Mapeo de días en español a número (0=Domingo, 1=Lunes, 2=Martes, etc.).
 */
const dayToNumber: Record<string, number> = {
  Domingo: 0,
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sabado: 6,
};


/**
 * Crea un Date local al mediodía, para evitar que "2025-01-28" 
 * se interprete como UTC y retroceda un día si tu timezone es -5, etc.
 */
function parseLocalDay(dateStr: string): Date {
  // dateStr: "YYYY-MM-DD"
  const [year, month, day] = dateStr.split('-').map(Number);
  // Por defecto: mes - 1, y a las 12:00
  return new Date(year, (month || 1) - 1, day || 1, 12, 0, 0);
}

/**
 * Extrae un identificador numérico (id) de 'plan' o conserva la lógica
 * por si sigues usando documentId en el Plan. Puedes simplificar si ya no usas docId.
 */
function getPlanIdentifier(planField: any): { numericId?: number } | null {
  console.log("🧐 planField recibido:", planField); 
  if (!planField) return null;

  // CASO 1: objeto con { id: number }
  if (typeof planField.id === 'number') {
    return { numericId: planField.id };
  }

  // CASO 2: plan={ set: [ { id: number } ] }
  if (
    typeof planField === 'object' &&
    Array.isArray(planField.set) &&
    planField.set[0]?.id
  ) {
    return { numericId: planField.set[0].id };
  }
  
  // CASO 3: Desde la UI de Strapi con { connect: [ { id: number } ] }
  if (
    typeof planField === "object" &&
    Array.isArray(planField.connect) &&
    planField.connect.length > 0 &&
    planField.connect[0]?.id
  ) {
    return { numericId: planField.connect[0].id };
  }

  // Si no usas "documentId" en el Plan, puedes omitir la lógica de docId
  // y devolver null en cualquier otro caso.
  return null;
}

/**
 * Función de validación principal para 'reserva'.
 */
async function validateReserva(event: any) {
  const { data } = event.params;
  if (!data) return;

  if (!data.plan) {
    return; 
  }

  // 1) Extraer identificador numérico del plan
  const planIdObj = getPlanIdentifier(data.plan);
  if (!planIdObj || !planIdObj.numericId) {
    throw new ApplicationError('No se pudo extraer ningún ID de "plan".');
  }

  // 2) Buscar el plan con sus reglas y horarios
  const planRaw = (await strapi.entityService.findOne(
    'api::plan.plan',
    planIdObj.numericId,
    {
      populate: {
        reglas_planes: true,
        horarios: true,
      },
    }
  )) as PlanEntity | null;

  if (!planRaw) {
    throw new ApplicationError('El plan no existe con el ID provisto.');
  }

  // 3) Validar Reglas del Plan (día prohibido, rangos de fecha/hora prohibidos)
  const reservaDate = parseLocalDay(data.reservationDate); // "YYYY-MM-DD"
  const reservaTime = data.reservationTime as string; // "HH:mm:ss"
  const reservaDayNumber = reservaDate.getDay(); // 0=Domingo, 1=Lunes, etc.

  if (planRaw.reglas_planes && planRaw.reglas_planes.length > 0) {
    for (const regla of planRaw.reglas_planes) {
      // (a) Día prohibido
      if (regla.isDayRestric && regla.day) {
        const restrictedDayNum = dayToNumber[regla.day] ?? -1;
        if (restrictedDayNum === reservaDayNumber) {
          throw new ApplicationError(
            `Las reservas están prohibidas los ${regla.day}, sin importar la hora.`
          );
        }
      }

      // (b) Rango de fechas prohibido
      if (regla.isRangeData && regla.rangeDateFrom && regla.rangeDateUntil) {
        const from = new Date(regla.rangeDateFrom);
        const until = new Date(regla.rangeDateUntil);
        if (reservaDate >= from && reservaDate <= until) {
          throw new ApplicationError(
            `No se permiten reservas entre ${regla.rangeDateFrom} y ${regla.rangeDateUntil}.`
          );
        }
      }

      // (c) Rango de horas prohibido
      if (regla.isRangeHour && regla.rangeHourFrom && regla.rangeHourUntil) {
        if (reservaTime >= regla.rangeHourFrom && reservaTime <= regla.rangeHourUntil) {
          throw new ApplicationError(
            `No se permiten reservas entre las ${regla.rangeHourFrom} y las ${regla.rangeHourUntil}.`
          );
        }
      }
    }
  }

  // 4) Validar que la hora elegida coincida con alguno de los horarios
  if (planRaw.horarios && planRaw.horarios.length > 0) {
    const chosenTime = data.reservationTime;
    const matches = planRaw.horarios.some((hor) => {
      if (!hor.startTime || !hor.endTime) return false;
      return chosenTime >= hor.startTime && chosenTime < hor.endTime;
    });
    if (!matches) {
      throw new ApplicationError(
        `La hora ${chosenTime} no corresponde a ningún horario disponible en el Plan.`
      );
    }
  }

  // 5) Validar aforo (no exceder max_reservations)
  const newGuests = data.guests || 1;
  const planMax = planRaw.max_reservations || 0;

  if (planMax > 0) {
    // Buscar reservas existentes en la misma fecha/hora/plan
    const existing = await strapi.db.query('api::reserva.reserva').findMany({
      where: {
        plan: planIdObj.numericId,
        reservationDate: data.reservationDate,
        reservationTime: data.reservationTime,
      },
      select: ['guests'],
    });

    const currentSum = existing.reduce((acc, r) => acc + (r.guests || 0), 0);
    if (currentSum + newGuests > planMax) {
      throw new ApplicationError(
        `Aforo excedido. Solo quedan ${
          planMax - currentSum
        } cupos disponibles para ese horario.`
      );
    }
  }
}

/**
 * Exportación del lifecycle.
 */
export default {
  async beforeCreate(event: any) {
    await validateReserva(event);

    // (Opcional) Generar consecutivo "reservationNumber" si no existe
    const { data } = event.params;
    /* if (!data.reservationNumber) {
      // Ejemplo: "RES-0001"
      const [last] = await strapi.db.query('api::reserva.reserva').findMany({
        orderBy: { reservationNumber: 'desc' },
        limit: 1,
      });

      let nextNum = 1;
      if (last && last.reservationNumber) {
        // Extraer la parte numérica final. Supongamos "RES-0032" => 32
        const match = last.reservationNumber.match(/(\d+)$/);
        if (match) {
          const lastInt = parseInt(match[1], 10);
          nextNum = lastInt + 1;
        }
      }
      data.reservationNumber = `RES-${String(nextNum).padStart(4, '0')}`;
    } */
    data.creationDate = new Date();

  },

  async beforeUpdate(event: any) {
    await validateReserva(event);

    // (Opcional) si quieres recalcular "reservationNumber" al actualizar...
    // Normalmente no se cambia si ya existe, pero podrías re-generarlo si quieres.
  },
};
