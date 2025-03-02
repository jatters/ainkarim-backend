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
            <a href="mailto:ventas@marquesvl.com" style="color: #2d5339; font-weight: bold; text-decoration: none;">ventas@marquesvl.com</a>.
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
      await strapi
        .plugin("email")
        .service("email")
        .send({
          from: {
            email: "noreply@ainkarim.co",
            name: "Viñedo Ain Karim",
          },
          to: result.customerEmail,
          subject,
          html: htmlTemplate,
        });
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
                    Nos alegra informarte que hemos recibido tu pago correctamente. Se ha
                    generado el número de pedido <strong>${orderNumber}</strong>. Ahora
                    iniciaremos con la gestión correspondiente para procesar tu pedido.
                  </p>

                  <!-- Información Adicional -->
                  <div style="margin-top: 20px">
                    <p style="font-size: 16px; line-height: 1.6">
                      Te notificaremos cualquier novedad respecto a tu pedido. Mientras
                      tanto, si tienes alguna consulta, no dudes en contactarnos.
                    </p>
                  </div>

                  <!-- Contacto -->
                  <div style="margin-top: 20px">
                    <p style="font-size: 16px; line-height: 1.6">
                      Puedes escribirnos a
                      <a
                        href="mailto:ventas@marquesvl.com"
                        style="color: #2d5339; font-weight: bold; text-decoration: none"
                        >ventas@marquesvl.com</a
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
                    <a href="mailto:ventas@marquesvl.com" style="color: #2d5339; font-weight: bold; text-decoration: none;">ventas@marquesvl.com</a>.
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
        await strapi
          .plugin("email")
          .service("email")
          .send({
            from: {
              email: "noreply@ainkarim.co",
              name: "Viñedo Ain Karim",
            },
            to: result.customerEmail,
            subject,
            html: htmlTemplate,
          });
        strapi.log.info(
          `Email enviado a ${result.customerEmail} para pedido actualizado a estado ${newState}.`
        );
      } catch (error) {
        strapi.log.error(
          `Error enviando email a ${result.customerEmail}: ${error}`
        );
      }
    }
  },
};
