function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const formatReservationDate = (dateString: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString + "T00:00:00");
  const month = date.toLocaleString("es-ES", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  const monthCapitalized = capitalize(month);
  return `${monthCapitalized} ${day}, ${year}`;
};

// Función para formatear la fecha: "Junio 05 de 2025"
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "2-digit",
    year: "numeric",
  };
  // Reconstruimos el formato deseado manualmente:
  const day = date.getDate().toString().padStart(2, "0");
  const month = capitalize(date.toLocaleString("es-ES", { month: "long" }));
  const year = date.getFullYear();
  return `${month} ${day} de ${year}`;
}

// Función para formatear la hora: "3:00pm"
function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":");
  let hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minutes}${ampm}`;
}

import { errors } from "@strapi/utils";
const { ApplicationError } = errors;

async function sendEmailBrevo(toEmail, toName, subject, htmlContent) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY, // Define tu API Key en las variables de entorno
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "Viñedo Ain Karim",
        email: "noreply@ainkarim.co",
      },
      to: [
        {
          email: toEmail,
          name: toName,
        },
      ],
      subject: subject,
      htmlContent: htmlContent,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error enviando email: ${errorText}`);
  }

  return response.json();
}

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
    endTime?: string; // p.ej. "14:00:00"
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
  const [year, month, day] = dateStr.split("-").map(Number);
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
  if (typeof planField.id === "number") {
    return { numericId: planField.id };
  }

  // CASO 2: plan={ set: [ { id: number } ] }
  if (
    typeof planField === "object" &&
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
    "api::plan.plan",
    planIdObj.numericId,
    {
      populate: {
        reglas_planes: true,
        horarios: true,
      },
    }
  )) as PlanEntity | null;

  if (!planRaw) {
    throw new ApplicationError("El plan no existe con el ID provisto.");
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
        if (
          reservaTime >= regla.rangeHourFrom &&
          reservaTime <= regla.rangeHourUntil
        ) {
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
    try {
      // Buscar reservas existentes en la misma fecha/hora/plan
      const existing = await strapi.db.query("api::reserva.reserva").findMany({
        select: ["guests", "state", "payment_status"],
        where: {
          $and: [
            { plan: { id: planIdObj.numericId } },
            { reservationDate: data.reservationDate },
            { reservationTime: data.reservationTime },
            { state: { $in: ["Confirmada", "Pendiente"] } },
          ],
          ...(event.params?.where?.id
            ? { id: { $ne: event.params.where.id } }
            : {}),
        },
      } as any);

      console.log(
        "Reservas existentes:",
        existing.map((r) => ({
          guests: r.guests,
          state: r.state,
          payment_status: r.payment_status,
        }))
      );
      console.log("Capacidad máxima del plan:", planMax);

      const currentGuests = existing.reduce(
        (acc, r) => acc + (r.guests || 0),
        0
      );
      console.log("Total de invitados actuales:", currentGuests);
      console.log("Nuevos invitados:", newGuests);

      if (currentGuests + newGuests > planMax) {
        throw new ApplicationError(
          `Capacidad excedida. El plan tiene un máximo de ${planMax} personas por horario. ` +
            `Actualmente hay ${currentGuests} personas reservadas y estás intentando agregar ${newGuests} más. ` +
            `Solo quedan ${Math.max(0, planMax - currentGuests)} cupos disponibles.`
        );
      }
    } catch (error) {
      console.error("Error al validar aforo:", error);
      throw error instanceof ApplicationError
        ? error
        : new ApplicationError(
            "Error al validar el aforo. Por favor, contacta al administrador."
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

    const { data } = event.params;
    console.log("[DEBUG] beforeCreate - Incoming data:", data);

    if (!data.reservationNumber) {
      console.log(
        "[DEBUG] reservationNumber no existe, se generará automáticamente..."
      );
      try {
        // Se consulta el último registro ordenando por id de forma descendente.
        const records = await strapi.db.query("api::reserva.reserva").findMany({
          orderBy: { id: "desc" },
          limit: 1,
          select: ["id"],
        } as any); // Asertamos a any para permitir la propiedad orderBy

        console.log(
          "[DEBUG] Resultado de la consulta del último registro:",
          records
        );
        const lastRecord = records[0];
        let nextId = 1;
        if (lastRecord && lastRecord.id) {
          nextId = lastRecord.id + 1;
          console.log(
            `[DEBUG] Último registro encontrado con id ${lastRecord.id}. Siguiente id: ${nextId}`
          );
        } else {
          console.log(
            "[DEBUG] No se encontró registro previo. Se usará nextId = 1"
          );
        }
        // Se asigna el reservationNumber en formato "RES-0001"
        data.reservationNumber = `R-${String(nextId).padStart(4, "0")}`;
        console.log(
          "[DEBUG] reservationNumber asignado:",
          data.reservationNumber
        );
      } catch (error) {
        console.error("[ERROR] Error al consultar la última reserva:", error);
        throw error;
      }
    } else {
      console.log(
        "[DEBUG] reservationNumber ya existe:",
        data.reservationNumber
      );
    }

    data.creationDate = new Date();
    console.log("[DEBUG] creationDate asignada:", data.creationDate);
  },

  async beforeUpdate(event: any) {
    await validateReserva(event);

    const { data } = event.params;
    console.log("[DEBUG] beforeUpdate - Incoming data:", data);
  },

  async afterCreate(event: any) {
    const { result } = event;
    // Solo enviamos el correo si la reserva se crea en estado "Pendiente"

    const fullReserva: any = await strapi.entityService.findOne(
      "api::reserva.reserva",
      result.id,
      {
        populate: ["plan", "servicios_adicionale"],
      }
    );
    let nombrePlan = "Plan";
    let unitPlan = "";
    if (fullReserva.plan) {
      if (fullReserva.plan.name) {
        nombrePlan = fullReserva.plan.name;
        unitPlan = fullReserva.plan.unitPlan || "";
      } else if (fullReserva.plan.id) {
        const planData = await strapi.entityService.findOne(
          "api::plan.plan",
          fullReserva.plan.id,
          {
            fields: ["name", "unitPlan"],
          }
        );
        nombrePlan = planData?.name || "Plan";
        unitPlan = planData?.unitPlan || "";
      }
    }
    if (fullReserva.state === "Pendiente") {
      // Datos de la reserva
      const nombreCompleto =
        `${fullReserva.customerName} ${fullReserva.customerMiddleName || ""} ${fullReserva.customerLastname}`.trim();
      // Se utiliza "name" según el schema del plan
      //const nombrePlan =         result.plan && result.plan.name ? result.plan.name : "Plan";
      //const fechaReserva = formatDate(result.reservationDate);
      const fechaReserva = formatReservationDate(fullReserva.reservationDate);
      const horaReserva = formatTime(fullReserva.reservationTime);
      //const serviciosAdicionales = result.servicios_adicionales ? result.servicios_adicionales.name : "-";
      /* 
      console.log(
        "[DEBUG] servicios_adicionales:",
        result.servicios_adicionales
      );
      console.log("[DEBUG] additional_services:", result.additional_services);
      console.log("[DEBUG] result:", result); */
      let serviciosAdicionales = "-";
      if (
        fullReserva.servicios_adicionale &&
        fullReserva.servicios_adicionale.name
      ) {
        serviciosAdicionales = fullReserva.servicios_adicionale.name;
      }
      console.log("[DEBUG] plan:", nombrePlan, unitPlan);
      const numeroPersonas = fullReserva.guests;
      const subject = `¡Tu reserva para ${nombrePlan} está en proceso!`;

      const htmlTemplate = `
        <html>
          <head>
            <meta charset="UTF-8" />
          </head>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333;">
            <div style="max-width: 600px; width: 100%; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
              
              <!-- Header con Logo -->
              <div style="text-align: center; background-color: #1a1a1a; padding: 20px; border-radius: 10px 10px 0 0;">
                <img src="https://ainkarim.co/uploads/logo_ain_karim_9987562b80.png" alt="Logo Viñedo Ain Karim" style="width: 250px; max-width: 100%; height: auto;" />
              </div>
              
              <!-- Imagen Principal -->
              <div style="text-align: center; margin: 20px 0;">
                <img src="https://ainkarim.co/uploads/vinedo_mail_5b56f67c98.jpg" alt="Viñedo Ain Karim" style="width: 100%; max-width: 560px; height: auto; border-radius: 8px;">
              </div>
              
              <!-- Mensaje Principal -->
              <h2 style="color: #2d5339; text-align: center; font-size: 22px;">
                ¡Tu reserva ha sido recibida!
              </h2>
              
              <p style="font-size: 16px; line-height: 1.6;">
                Hola <strong>${nombreCompleto}</strong>,
              </p>
              
              <p style="font-size: 16px; line-height: 1.6;">
                ¡Gracias por reservar tu experiencia en <strong>Viñedo Ain Karim</strong>! 🍷✨
              </p>
              
              <p style="font-size: 16px; line-height: 1.6;">
                Hemos recibido tu solicitud y estamos a la espera de la confirmación de tu pago. En cuanto se valide, recibirás un correo con la confirmación de tu reserva y las indicaciones necesarias.
              </p>
              
              <!-- Información de la Reserva -->
              <div style="background-color: #f8f4e3; padding: 15px 20px; border-radius: 5px; margin-top: 20px;">
                <p style="font-size: 16px; font-weight: 700; text-align: center; color: #2d5339;">Información de tu reserva:</p>
                <p><strong>📅 Fecha:</strong> ${fechaReserva}</p>
                <p><strong>⏰ Hora:</strong> ${horaReserva}</p>
                <p><strong>👥 Número de invitados:</strong> ${numeroPersonas} ${unitPlan}</p>
                <p><strong>🍷 Plan:</strong> ${nombrePlan}</p>
                ${serviciosAdicionales !== "-" ? `<p><strong>📝 Servicios adicionales:</strong> ${serviciosAdicionales}</p>` : ""}
              </div>
              
              <!-- Mensaje de Confirmación de Pago -->
              <div style="margin-top: 20px;">
                <p style="font-size: 16px; line-height: 1.6;">
                  Si ya realizaste el pago y aún no recibes la confirmación, no te preocupes, puede tomar unos minutos. Si necesitas ayuda, contáctanos en  
                  <a href="mailto:ventas@marquesvl.com" style="color: #2d5339; font-weight: bold; text-decoration: none;">ventas@marquesvl.com</a>.
                </p>
                <p style="font-size: 16px; line-height: 1.6;">  
                  ¡Nos emociona recibirte pronto en nuestro viñedo! 🌿  
                </p>
              </div>
              
              <!-- Despedida -->
              <p style="font-size: 16px; margin-top: 30px;">
                Saludos,<br><br>
                <strong>Viñedo Ain Karim.</strong>
              </p>
              
              <!-- Pie de Página -->
              <p style="font-size: 12px; color: #6c757d; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px;">
                Este mensaje fue enviado automáticamente desde la web de  
                <a href="https://ainkarim.co" style="color: #2d5339; text-decoration: none; font-weight: bold;">Ainkarim.co</a>
              </p>
            
            </div>
          </body>
        </html>
        `;

      try {
        await sendEmailBrevo(
          result.customerEmail,
          nombreCompleto,
          subject,
          htmlTemplate
        );
        strapi.log.info(
          `Email enviado a ${result.customerEmail} para reserva creada.`
        );
      } catch (error) {
        strapi.log.error(
          `Error enviando email a ${result.customerEmail}: ${error}`
        );
      }
    }
  },

  async afterUpdate(event: any) {
    const { result, params } = event;
    // Se dispara el envío de correo cuando se actualiza el estado
    if (params.data && params.data.state) {
      const newState = params.data.state;

      // Reconsultar la reserva con populate para obtener relaciones completas
      const fullReserva: any = await strapi.entityService.findOne(
        "api::reserva.reserva",
        result.id,
        {
          populate: ["plan", "servicios_adicionale"],
        }
      );

      let nombrePlan = "Plan";
      let unitPlan = "";
      if (fullReserva.plan) {
        if (fullReserva.plan.name) {
          nombrePlan = fullReserva.plan.name;
          unitPlan = fullReserva.plan.unitPlan || "";
        } else if (fullReserva.plan.id) {
          const planData = await strapi.entityService.findOne(
            "api::plan.plan",
            fullReserva.plan.id,
            {
              fields: ["name"],
            }
          );
          nombrePlan = planData?.name || "Plan";
          unitPlan = planData?.unitPlan || "";
        }
      }
      const nombreCompleto =
        `${fullReserva.customerName} ${fullReserva.customerMiddleName || ""} ${fullReserva.customerLastname}`.trim();
      const fechaReserva = formatReservationDate(fullReserva.reservationDate);
      const horaReserva = formatTime(fullReserva.reservationTime);
      const numeroPersonas = fullReserva.guests;

      // Usamos el campo correcto: en el schema se llama "servicios_adicionale" (manyToOne, objeto)
      let serviciosAdicionales = "-";
      if (
        fullReserva.servicios_adicionale &&
        fullReserva.servicios_adicionale.name
      ) {
        serviciosAdicionales = fullReserva.servicios_adicionale.name;
      }

      let subject = "";
      let htmlTemplate = "";

      if (newState === "Confirmada" || newState === "Pago") {
        try {
          // Obtiene el correo del administrador desde "El Viñedo" sin depender de un ID fijo
          const elVinedo: any = await strapi.entityService.findOne(
            "api::el-vinedo.el-vinedo",
            3,
            { fields: ["ventasEmail"] }
          );
          const adminEmail = elVinedo?.ventasEmail;
          if (adminEmail) {
            const adminSubject = `Nueva reserva confirmada - R-${result.id}`;
            const adminHtmlTemplate = `
              <html>
                <head>
                  <meta charset="UTF-8" />
                </head>
                <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333;">
                  <div style="max-width: 600px; width: 100%; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header con Logo -->
                    <div style="text-align: center; background-color: #1a1a1a; padding: 20px; border-radius: 10px 10px 0 0;">
                      <img src="https://ainkarim.co/uploads/logo_ain_karim_9987562b80.png" alt="Logo Viñedo Ain Karim" style="width: 250px; max-width: 100%; height: auto;" />
                    </div>
                    
                    <h2 style="color: #2d5339; text-align: center; font-size: 22px;">
                      Nuevo pedido confirmado
                    </h2>
                    <p style="font-size: 16px; line-height: 1.6;">
                      Se ha confirmado la reserva <strong>R-${result.id}</strong>.
                    </p>
  
                    <!-- Información del cliente -->
                    <div style="background-color: #f1f1f1; padding: 15px 20px; border-radius: 5px; margin-top: 20px;">
                      <p style="font-size: 16px; font-weight: 700; text-align: center; color: #2d5339;">
                        Información del cliente:
                      </p>
                      <p><strong>Nombre:</strong> ${nombreCompleto}</p>
                      <p><strong>Documento:</strong> ${fullReserva.customerDocument}</p>
                      <p><strong>Email:</strong> ${fullReserva.customerEmail}</p>                    
                      <p><strong>Teléfono:</strong> ${fullReserva.customerPhone}</p>
                    </div>
                    
                    <!-- Información de la reserva -->
                    <div style="background-color: #f8f4e3; padding: 15px 20px; border-radius: 5px; margin-top: 20px;">
                      <p style="font-size: 16px; font-weight: 700; text-align: center; color: #2d5339;">
                        Información de la reserva:
                      </p>
                      <p><strong>Número de Reserva:</strong> R-${result.id}</p>
                      <p><strong>Fecha:</strong> ${fechaReserva}</p>
                      <p><strong>Hora:</strong> ${horaReserva}</p>
                      <p><strong>Número de invitados:</strong> ${numeroPersonas} ${unitPlan}s</p>
                      <p><strong>Plan:</strong> ${nombrePlan}</p>
                      ${serviciosAdicionales !== "-" ? `<p><strong>Servicios adicionales:</strong> ${serviciosAdicionales}</p>` : ""}
                    </div>
                    
                    <!-- Pie de Página -->
                    <p style="font-size: 12px; color: #6c757d; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px;">
                      Este mensaje fue enviado automáticamente desde la web de 
                      <a href="https://ainkarim.co" style="color: #2d5339; text-decoration: none; font-weight: bold;">Ainkarim.co</a>
                    </p>
                  </div>
                </body>
              </html>
            `;
            try {
              await sendEmailBrevo(adminEmail, "Administrador", adminSubject, adminHtmlTemplate);
              strapi.log.info(`Correo de aviso enviado al administrador (${adminEmail}) por pedido ${result.id}.`);
            } catch (error) {
              strapi.log.error(`Error enviando correo al administrador (${adminEmail}): ${error}`);
            }
          }
        } catch (error) {
          strapi.log.error(`Error enviando correo al administrador: ${error}`);
        }
        subject = `Reserva Confirmada para ${nombrePlan}`;
        htmlTemplate = `
          <html>
            <head>
              <meta charset="UTF-8" />
            </head>
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333;">
              <div style="max-width: 600px; width: 100%; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                
                <!-- Encabezado con Logo -->
                <div style="text-align: center; background-color: #1a1a1a; padding: 20px; border-radius: 10px 10px 0 0;">
                  <img src="https://ainkarim.co/uploads/logo_ain_karim_9987562b80.png" alt="Logo Viñedo Ain Karim" style="width: 250px; max-width: 100%; height: auto;" />
                </div>
                
                <!-- Imagen Principal -->
                <div style="text-align: center; margin: 20px 0;">
                  <img src="https://ainkarim.co/uploads/vinedo_e0e861760e.webp" alt="Viñedo Ain Karim" style="width: 100%; max-width: 560px; height: auto; border-radius: 8px;">
                </div>
                
                <!-- Mensaje Principal -->
                <h2 style="color: #2d5339; text-align: center; font-size: 22px;">
                  ¡Tu reserva ha sido confirmada!
                </h2>
                
                <p style="font-size: 16px; line-height: 1.6;">
                Hola <strong>${nombreCompleto}</strong>,
              </p>
              
              <p style="font-size: 16px; line-height: 1.6;">
                ¡Tu reserva ha sido confirmada! 🎉 Nos emociona recibirte en <strong>Viñedo Ain Karim</strong> para una experiencia inolvidable entre viñedos y buen vino. 🍷✨
              </p>      

              <!-- Información de la Reserva -->
              <div style="background-color: #f8f4e3; padding: 15px 20px; border-radius: 5px; margin-top: 20px;">
                <p style="font-size: 16px; font-weight: 700; text-align: center; color: #2d5339;">Información de tu reserva:</p>
                <p><strong>📝 Número de Reserva:</strong> R-${result.id}</p>
                <p><strong>📅 Fecha:</strong> ${fechaReserva}</p>
                <p><strong>⏰ Hora:</strong> ${horaReserva}</p>
                <p><strong>👥 Número de invitados:</strong> ${numeroPersonas} ${unitPlan}s</p>
                <p><strong>🍷 Plan:</strong> ${nombrePlan}</p>   
                ${serviciosAdicionales !== "-" ? `<p><strong>📝 Servicios adicionales:</strong> ${serviciosAdicionales}</p>` : ""}             
              </div>
              
              <!-- Recomendaciones -->
              <div style="margin-top: 20px; padding: 15px; background-color: #eef5e1; border-radius: 5px;">
                <p style="font-size: 16px; font-weight: bold; color: #2d5339;">Para que disfrutes al máximo tu visita, ten en cuenta:</p>
                <ul style="font-size: 16px; line-height: 1.6; padding-left: 20px; color: #333;">
                  <li>📍 Llega al menos <strong>15 minutos antes</strong> de tu reserva programada.</li>
                  <li>⏳ <strong>No es posible reprogramar</strong> tu horario de reserva el mismo día.</li>
                  <li>📅 Si necesitas cambiar la fecha de tu reserva, contáctanos con anticipación.</li>
                </ul>
              </div>
                
                <!-- Contacto -->
                <div style="margin-top: 20px;">
                  <p style="font-size: 16px; line-height: 1.6;">
                    Si tienes alguna duda o necesitas hacer cambios en tu reserva, contáctanos a 
                    <a href="mailto:ventas@marquesvl.com" style="color: #2d5339; font-weight: bold; text-decoration: none;">ventas@marquesvl.com</a>.
                  </p>
                </div>
                
                <!-- Despedida -->
                <p style="font-size: 16px; margin-top: 30px;">
                  Saludos,<br>
                  <strong>Viñedo Ain Karim</strong>
                </p>
                
                <!-- Pie de Página -->
                <p style="font-size: 12px; color: #6c757d; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px;">
                  Este mensaje fue enviado automáticamente desde la web de 
                  <a href="https://ainkarim.co" style="color: #2d5339; text-decoration: none; font-weight: bold;">Ainkarim.co</a>
                </p>
              
              </div>
            </body>
          </html>
          `;
      } else if (newState === "Cancelada") {
        subject = `Reserva no agendada para ${nombrePlan}`;
        htmlTemplate = `
          <html>
            <head>
              <meta charset="UTF-8" />
            </head>
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333;">
              <div style="max-width: 600px; width: 100%; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                
                <!-- Encabezado con Logo -->
                <div style="text-align: center; background-color: #1a1a1a; padding: 20px; border-radius: 10px 10px 0 0;">
                  <img src="https://ainkarim.co/uploads/logo_ain_karim_9987562b80.png" alt="Logo Viñedo Ain Karim" style="width: 250px; max-width: 100%; height: auto;" />
                </div>
                
                <!-- Imagen Principal -->
                <div style="text-align: center; margin: 20px 0;">
                  <img src="https://ainkarim.co/uploads/vinedo_e0e861760e.webp" alt="Viñedo Ain Karim" style="width: 100%; max-width: 560px; height: auto; border-radius: 8px;">
                </div>
                
                <h2 style="color: #b22222; text-align: center; font-size: 22px;">❌ Tu reserva no pudo ser confirmada</h2>              
            
                <p style="font-size: 16px; line-height: 1.6;">
                  Hola <strong>${nombreCompleto}</strong>,
                </p>

                <p style="font-size: 16px; line-height: 1.6;">
                  Lamentamos informarte que tu reserva en <strong>Viñedo Ain Karim</strong> no pudo completarse debido a un problema con el pago.  
                </p>

                <p style="font-size: 16px; line-height: 1.6;">
                  Si el cargo fue realizado y aún no has recibido confirmación, por favor contáctanos lo antes posible para revisar tu caso. También puedes intentar hacer una nueva reserva en nuestra página web.
                </p>

                <!-- Información de la Reserva -->
                <div style="background-color: #ffe6e6; padding: 15px 20px; border-radius: 5px; margin-top: 20px;">
                  <p style="font-size: 16px; font-weight: 700; text-align: center; color: #b22222;">Detalles de tu reserva fallida:</p>
                  <p><strong>📅 Fecha:</strong> ${fechaReserva}</p>
                  <p><strong>⏰ Hora:</strong> ${horaReserva}</p>
                  <p><strong>👥 Número de invitados:</strong> ${numeroPersonas} ${unitPlan}s</p>
                  <p><strong>🍷 Plan:</strong> ${nombrePlan}</p>
                </div>
                
                <!-- Contacto y Reintento -->
                <div style="margin-top: 20px;">
                  <p style="font-size: 16px; line-height: 1.6;">
                    Si necesitas ayuda, escríbenos a  
                    <a href="mailto:ventas@marquesvl.com" style="color: #b22222; font-weight: bold; text-decoration: none;">ventas@marquesvl.com</a>.
                  </p>
                </div>

                <!-- Botón de nueva reserva -->
                <div style="text-align: center; margin-top: 20px;">
                  <a href="https://ainkarim.co/reservas" style="background-color: #b22222; color: #fff; padding: 12px 20px; border-radius: 5px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
                    Intentar nueva reserva
                  </a>
                </div>
                
                <!-- Firma -->
                <p style="font-size: 16px; text-align: center; margin-top: 30px;">
                  Esperamos verte pronto en nuestro viñedo.
                </p>
                <p style="font-size: 16px; text-align: center; color: #b22222; font-weight: bold;">
                  Equipo Viñedo Ain Karim
                </p>
                
                <!-- Pie de Página -->
                <p style="font-size: 12px; color: #6c757d; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px;">
                  Este mensaje fue enviado automáticamente desde la web de 
                  <a href="https://ainkarim.co" style="color: #2d5339; text-decoration: none; font-weight: bold;">Ainkarim.co</a>
                </p>
              
              </div>
            </body>
          </html>
          `;
      } else if (newState === "Fallida") {
        subject = `Reserva Fallida para ${nombrePlan}`;
        htmlTemplate = `
          <html>
            <head>
              <meta charset="UTF-8" />
            </head>
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333;">
              <div style="max-width: 600px; width: 100%; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                
                <!-- Encabezado con Logo -->
                <div style="text-align: center; background-color: #1a1a1a; padding: 20px; border-radius: 10px 10px 0 0;">
                  <img src="https://ainkarim.co/uploads/logo_ain_karim_9987562b80.png" alt="Logo Viñedo Ain Karim" style="width: 250px; max-width: 100%; height: auto;" />
                </div>
                
                <!-- Imagen Principal -->
                <div style="text-align: center; margin: 20px 0;">
                  <img src="https://ainkarim.co/uploads/vinedo_e0e861760e.webp" alt="Viñedo Ain Karim" style="width: 100%; max-width: 560px; height: auto; border-radius: 8px;">
                </div>
                
                <h2 style="color: #b22222; text-align: center; font-size: 22px;">❌ Tu reserva no pudo ser confirmada</h2>              
            
                <p style="font-size: 16px; line-height: 1.6;">
                  Hola <strong>${nombreCompleto}</strong>,
                </p>

                <p style="font-size: 16px; line-height: 1.6;">
                  Lamentamos informarte que tu reserva en <strong>Viñedo Ain Karim</strong> no pudo completarse debido a un problema con el pago.  
                </p>

                <p style="font-size: 16px; line-height: 1.6;">
                  Si el cargo fue realizado y aún no has recibido confirmación, por favor contáctanos lo antes posible para revisar tu caso. También puedes intentar hacer una nueva reserva en nuestra página web.
                </p>

                <!-- Información de la Reserva -->
                <div style="background-color: #ffe6e6; padding: 15px 20px; border-radius: 5px; margin-top: 20px;">
                  <p style="font-size: 16px; font-weight: 700; text-align: center; color: #b22222;">Detalles de tu reserva fallida:</p>
                  <p><strong>📅 Fecha:</strong> ${fechaReserva}</p>
                  <p><strong>⏰ Hora:</strong> ${horaReserva}</p>
                  <p><strong>👥 Número de invitados:</strong> ${numeroPersonas}</p>
                  <p><strong>🍷 Plan:</strong> ${nombrePlan}</p>
                </div>
                
                <!-- Contacto y Reintento -->
                <div style="margin-top: 20px;">
                  <p style="font-size: 16px; line-height: 1.6;">
                    Si necesitas ayuda, escríbenos a  
                    <a href="mailto:ventas@marquesvl.com" style="color: #b22222; font-weight: bold; text-decoration: none;">ventas@marquesvl.com</a>.
                  </p>
                </div>

                <!-- Botón de nueva reserva -->
                <div style="text-align: center; margin-top: 20px;">
                  <a href="https://ainkarim.co/reservas" style="background-color: #b22222; color: #fff; padding: 12px 20px; border-radius: 5px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
                    Intentar nueva reserva
                  </a>
                </div>
                
                <!-- Firma -->
                <p style="font-size: 16px; text-align: center; margin-top: 30px;">
                  Esperamos verte pronto en nuestro viñedo.
                </p>
                <p style="font-size: 16px; text-align: center; color: #b22222; font-weight: bold;">
                  Equipo Viñedo Ain Karim
                </p>
                
                <!-- Pie de Página -->
                <p style="font-size: 12px; color: #6c757d; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px;">
                  Este mensaje fue enviado automáticamente desde la web de 
                  <a href="https://ainkarim.co" style="color: #2d5339; text-decoration: none; font-weight: bold;">Ainkarim.co</a>
                </p>
              
              </div>
            </body>
          </html>
          `;
      } else {
        
        return;
      }

      try {
        await sendEmailBrevo(
          result.customerEmail,
          nombreCompleto,
          subject,
          htmlTemplate
        );
        strapi.log.info(
          `Email enviado a ${result.customerEmail} para reserva actualizada a estado ${newState}.`
        );
      } catch (error) {
        strapi.log.error(
          `Error enviando email a ${result.customerEmail}: ${error}`
        );
      }
    }
    
  },
};
