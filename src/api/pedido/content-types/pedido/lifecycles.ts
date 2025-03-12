// lifecycles.ts

// Función para capitalizar la primera letra de una cadena
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Función para formatear la fecha: "Junio 05 de 2025"
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = capitalize(date.toLocaleString("es-ES", { month: "long" }));
  const year = date.getFullYear();
  return `${month} ${day} de ${year}`;
}

async function sendEmailBrevo(
  toEmail: string,
  toName: string,
  subject: string,
  htmlContent: string
) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY, // Asegúrate de tener configurada esta variable de entorno
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
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error enviando email: ${errorText}`);
  }
  return await response.json();
}

export default {
  async afterCreate(event: any) {
    const { result } = event;
    // Se arma el nombre completo del cliente
    const fullName =
      `${result.customerName} ${result.customerMiddleName || ""} ${result.customerLastname}`.trim();
    const orderNumber = result.numberOrder || "N/A";
    const creationDate = result.creationDate
      ? formatDate(result.creationDate)
      : formatDate(new Date().toISOString());

    // Asunto y plantilla para el correo de creación del pedido
    const subject = `Hemos recibido tu pedido en Viñedo Ain Karim 🍷`;
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
              <img src="https://ainkarim.co/uploads/pedidos_7d60bc71fd.jpg" alt="Pedido Recibido" style="width: 100%; max-width: 560px; height: auto; border-radius: 8px;">
            </div>

            <h2 style="color: #2d5339; text-align: center;">¡Tu pedido ha sido recibido!</h2>
            <p style="font-size: 16px;">Hola <strong>${fullName}</strong>,</p>
            <p style="font-size: 16px;">Hemos recibido tu pedido en <strong>Viñedo Ain Karim</strong> y estamos procesándolo.  
            En cuanto confirmemos el pago, te informaremos.</p>
            <div style="margin-top: 20px;">
              <p style="font-size: 16px; line-height: 1.6;">
                Si ya realizaste el pago y aún no has sido confirmado, ten en cuenta que puede tardar unos minutos en procesarse.  
                Recibirás un correo con la confirmación.  
              </p>
            </div>
            <!-- Contacto -->
            <div style="margin-top: 20px;">
              <p style="font-size: 16px; line-height: 1.6;">
                Si tienes alguna duda, contáctanos en  
                <a href="mailto:visitas@marquesvl.com" style="color: #2d5339; font-weight: bold; text-decoration: none;">visitas@marquesvl.com</a>.
              </p>
            </div>
            <!-- Despedida -->
            <p style="font-size: 16px; margin-top: 30px;">
              ¡Gracias por elegir Viñedo Ain Karim! 🍷✨  
            </p>
            <p style="font-size: 16px;">Saludos,<br/><strong>Viñedo Ain Karim</strong></p>
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
        fullName,
        subject,
        htmlTemplate
      );

      strapi.log.info(
        `Email enviado a ${result.customerEmail} para pedido creado.`
      );
    } catch (error) {
      strapi.log.error(
        `Error enviando email a ${result.customerEmail}: ${error}`
      );
    }
  },

  async afterUpdate(event: any) {
    const { result, params } = event;

    // Se ejecuta solo si se actualiza el campo "state"
    if (params.data && params.data.state) {
      const newState = params.data.state;
      const fullName =
        `${result.customerName} ${result.customerMiddleName || ""} ${result.customerLastname}`.trim();
      const orderNumber = result.numberOrder || "N/A";
      let subject = "";
      let htmlTemplate = "";      

      if (newState === "Pago") {
        // Correo de confirmación de pago
        subject = `¡Pago confirmado! Tu pedido en Viñedo Ain Karim está en proceso 🍷`;
        htmlTemplate = `
            <html>
              <head>
                <meta charset="UTF-8" />
              </head>
              <body
                style="
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                  color: #333;
                "
              >
                <div
                  style="
                    max-width: 600px;
                    width: 100%;
                    margin: auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                  "
                >
                  <!-- Header con Logo -->
                  <div
                    style="
                      text-align: center;
                      background-color: #1a1a1a;
                      padding: 20px;
                      border-radius: 10px 10px 0 0;
                    "
                  >
                    <img
                      src="https://ainkarim.co/uploads/logo_ain_karim_9987562b80.png"
                      alt="Logo Viñedo Ain Karim"
                      style="width: 250px; max-width: 100%; height: auto"
                    />
                  </div>

                  <!-- Imagen Principal -->
                  <div style="text-align: center; margin: 20px 0">
                    <img
                      src="https://ainkarim.co/uploads/pedidos_7d60bc71fd.jpg"
                      alt="Pedido Confirmado"
                      style="
                        width: 100%;
                        max-width: 560px;
                        height: auto;
                        border-radius: 8px;
                      "
                    />
                  </div>

                  <h2 style="color: #2d5339; text-align: center; font-size: 22px">
                    ¡${fullName}, tu pago ha sido confirmado! 🎉
                  </h2>
                  <p style="font-size: 16px; line-height: 1.6">
                    Nos alegra informarte que hemos recibido tu pago correctamente. Ahora
                    iniciaremos con la gestión correspondiente para procesar tu pedido.
                  </p>
                 
                  <!-- Información de Pedido -->
                  <div
                    style="
                      background-color: #f8f4e3;
                      padding: 15px 20px;
                      border-radius: 5px;
                      margin-top: 20px;
                    "
                  >
                    <p
                      style="
                        font-size: 16px;
                        font-weight: 700;
                        text-align: center;
                        color: #2d5339;
                      "
                    >
                      Información de tu pedido:
                    </p>
                    <p><strong>📝 Número de pedido:</strong> ${orderNumber}</p>
                    <br />
                    
                    <!-- Tabla de productos -->
                    <table
                      style="width: 100%; border-collapse: collapse; margin-top: 10px; background-color: #fff;"
                    >
                      <thead style="background-color: #062f1d; color: #fff">
                        <tr>
                          <th
                            style="border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px;"
                          >
                            Producto
                          </th>
                          <th
                            style="border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 12px;"
                          >
                            Cantidad
                          </th>
                          <th
                            style="border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 12px;"
                          >
                            Precio Unitario
                          </th>
                          <th
                            style="border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 12px;"
                          >
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        ${result.items
                          .map(
                            (item) => `
                          <tr>
                            <td style="border: 1px solid #ddd; padding: 8px; font-weight: 600">${item.title}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">$${item.price}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">$${
                              item.quantity * item.price
                            }</td>
                          </tr>
                        `
                          )
                          .join("")}
                      </tbody>
                    </table>
                    <br />
                    <p style="font-size: 16px; margin-top: 10px;">
                      <strong>💵 Total:</strong> $${result.totalPriceOrder}
                    </p>                    
                    <p style="font-size: 16px;">
                      <strong>💳 Método de pago:</strong> ${result.payment_method}
                    </p>
                  </div>

                  <!-- Contacto -->
                  <div style="margin-top: 20px">
                    <p style="font-size: 16px; line-height: 1.6">
                      Puedes escribirnos a
                      <a
                        href="mailto:visitas@marquesvl.com"
                        style="color: #2d5339; font-weight: bold; text-decoration: none"
                        >visitas@marquesvl.com</a
                      >.
                    </p>
                  </div>

                  <!-- Despedida -->
                  <p style="font-size: 16px; margin-top: 30px">
                    ¡Gracias por confiar en Viñedo Ain Karim! 🍷✨
                  </p>

                  <!-- Pie de Página -->
                  <p
                    style="
                      font-size: 12px;
                      color: #6c757d;
                      text-align: center;
                      margin-top: 20px;
                      border-top: 1px solid #ddd;
                      padding-top: 15px;
                    "
                  >
                    Este mensaje fue enviado automáticamente desde la web de
                    <a
                      href="https://ainkarim.co"
                      style="color: #2d5339; text-decoration: none; font-weight: bold"
                      >Ainkarim.co</a
                    >
                  </p>
                </div>
              </body>
            </html>
          `;
      } else if (newState === "Cancelado") {
        // Correo cuando la compra falla
        subject = `Hubo un problema con tu pago en Viñedo Ain Karim`;
        htmlTemplate = `
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
                  <img src="https://ainkarim.co/uploads/pedidos_7d60bc71fd.jpg" alt="Pago Fallido" style="width: 100%; max-width: 560px; height: auto; border-radius: 8px;">
                </div>
                
                <!-- Mensaje Principal -->
                <h2 style="color: #d9534f; text-align: center; font-size: 22px;">
                  ${fullName}, tuvimos un problema con tu pago 😞
                </h2>
                
                <p style="font-size: 16px; line-height: 1.6;">
                  No pudimos procesar el pago de tu pedido en <strong>Viñedo Ain Karim</strong>. Puede haber ocurrido un error con tu tarjeta o con la plataforma de pagos.
                </p>

                <p style="font-size: 16px; line-height: 1.6;">
                  Para completar tu compra, te invitamos a intentarlo nuevamente ingresando a nuestro sitio web.
                </p>                
                

                <!-- Botón para reintentar pago -->
                <div style="text-align: center; margin-top: 20px;">
                  <a href="https://ainkarim.co" style="background-color: #2d5339; color: #ffffff; padding: 12px 20px; font-size: 16px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Intentar nuevamente 🔄
                  </a>
                </div>

                <!-- Información Adicional -->
                <div style="margin-top: 20px;">
                  <p style="font-size: 16px; line-height: 1.6;">
                    Si crees que esto fue un error, por favor revisa los datos de tu tarjeta o comunícate con tu banco. También puedes contactarnos si necesitas ayuda.  
                  </p>
                </div>
                
                <!-- Contacto -->
                <div style="margin-top: 20px;">
                  <p style="font-size: 16px; line-height: 1.6;">
                    Escríbenos a  
                    <a href="mailto:visitas@marquesvl.com" style="color: #2d5339; font-weight: bold; text-decoration: none;">visitas@marquesvl.com</a>.
                  </p>
                </div>
                
                <!-- Despedida -->
                <p style="font-size: 16px; margin-top: 30px;">
                  Esperamos que puedas completar tu compra pronto. ¡Gracias por confiar en Viñedo Ain Karim! 🍷  
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
        // Si se actualiza a otro estado, no se envía correo.
        return;
      }

      try {
        await sendEmailBrevo(
          result.customerEmail,
          fullName,
          subject,
          htmlTemplate
        );

        strapi.log.info(
          `Email enviado a ${result.customerEmail} para pedido actualizado a estado ${newState}.`
        );
      } catch (error) {
        strapi.log.error(
          `Error enviando email a ${result.customerEmail}: ${error}`
        );
      }

      // Enviar correo adicional al administrador cuando el pedido está confirmado (estado "Pago")
      if (newState === "Pago") {
        try {
          // Reconsulta el single type "El Viñedo" para extraer el correo de ventas (ventasEmail)
          const elVinedo: any = await strapi.entityService.findOne(
            "api::el-vinedo.el-vinedo",
            3,
            { fields: ["ventasEmail"] }
          );

          strapi.log.info(`El Viñedo ventasEmail: ${elVinedo?.ventasEmail}`);
          strapi.log.info(`El Viñedo ventasEmail: ${elVinedo}`);
          strapi.log.info(`Orden: ${result.customerEmail}`);

          const adminEmail = elVinedo?.ventasEmail;
          if (adminEmail) {
            const adminSubject = `Nuevo pedido confirmado - ${orderNumber}`;
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
                    Se ha confirmado el pedido <strong>${orderNumber}</strong> para el cliente <strong>${fullName}</strong>.
                  </p>

                  <!--Información del cliente-->
                  <div style="background-color: #f1f1f1; padding: 15px 20px; border-radius: 5px; margin-top: 20px;">
                    <p style="font-size: 16px; font-weight: 700; text-align: center; color: #2d5339;">
                      Información del cliente:
                    </p>
                    <p><strong>Nombre:</strong> ${fullName}</p>
                    <p><strong>Documento:</strong> ${result.customerDocument}</p>
                    <p><strong>Email:</strong> ${result.customerEmail}</p>                    
                    <p><strong>Teléfono:</strong> ${result.customerPhone}</p>
                  </div>
                  
                  <!-- Detalle de Pedido -->
                  <div style="background-color: #f8f4e3; padding: 15px 20px; border-radius: 5px; margin-top: 20px;">
                    <p style="font-size: 16px; font-weight: 700; text-align: center; color: #2d5339;">
                      Detalle del pedido:
                    </p>
                    <p><strong>Fecha:</strong> ${formatDate(result.creationDate)}</p>
                    <p><strong>Número de pedido:</strong> ${orderNumber}</p>
                    <!-- Tabla de productos -->
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; background-color: #fff;">
                      <thead style="background-color: #062f1d; color: #fff;">
                        <tr>
                          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px;">Producto</th>
                          <th style="border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 12px;">Cantidad</th>
                          <th style="border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 12px;">Precio Unitario</th>
                          <th style="border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 12px;">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${result.items
                          .map(
                            (item) => `
                          <tr>
                            <td style="border: 1px solid #ddd; padding: 8px; font-weight: 600;">${item.title}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">$${item.price}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">$${item.quantity * item.price}</td>
                          </tr>
                        `
                          )
                          .join("")}
                      </tbody>
                    </table>
                    <p style="font-size: 16px; margin-top: 10px;"><strong>Total:</strong> $${result.totalPriceOrder}</p>
                    <p style="font-size: 16px;"><strong>Método de pago:</strong> ${result.payment_method}</p>
                  </div>
                  
                  <p style="font-size: 16px; margin-top: 30px;">
                    Este es un aviso automático para informarte de la confirmación del pedido.
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
              await sendEmailBrevo(adminEmail, "Administrador", adminSubject, adminHtmlTemplate);
              strapi.log.info(`Correo de aviso enviado al administrador (${adminEmail}) por pedido ${orderNumber}.`);
            } catch (error) {
              strapi.log.error(`Error enviando correo al administrador (${adminEmail}): ${error}`);
            }
          }
        } catch (error) {
          strapi.log.error(`Error enviando correo al administrador: ${error}`);
        }
      }
    }
  },
};
