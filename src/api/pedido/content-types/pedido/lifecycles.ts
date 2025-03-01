// lifecycles.ts

// Función para capitalizar la primera letra de una cadena
function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  // Función para formatear la fecha: "Junio 05 de 2025"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = capitalize(date.toLocaleString('es-ES', { month: 'long' }));
    const year = date.getFullYear();
    return `${month} ${day} de ${year}`;
  }
  
  export default {
    async afterCreate(event: any) {
      const { result } = event;
      // Se arma el nombre completo del cliente
      const fullName = `${result.customerName} ${result.customerMiddleName || ''} ${result.customerLastname}`.trim();
      const orderNumber = result.numberOrder || 'N/A';
      const creationDate = result.creationDate
        ? formatDate(result.creationDate)
        : formatDate(new Date().toISOString());
  
      // Asunto y plantilla para el correo de creación del pedido
      const subject = `Pedido Creado - ${orderNumber}`;
      const htmlTemplate = `
  <html>
    <head>
      <meta charset="UTF-8" />
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333;">
      <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; padding: 20px; background-color: #1a1a1a; border-radius: 10px 10px 0 0;">
          <img src="https://ainkarim.co/uploads/logo_ain_karim_9987562b80.png" alt="Logo" style="width: 250px; max-width: 100%;" />
        </div>
        <h2 style="color: #2d5339; text-align: center;">¡Su pedido ha sido recibido!</h2>
        <p style="font-size: 16px;">Hola <strong>${fullName}</strong>,</p>
        <p style="font-size: 16px;">Hemos recibido su pedido con el número <strong>${orderNumber}</strong> el <strong>${creationDate}</strong>. Pronto nos pondremos en contacto con usted para los siguientes pasos.</p>
        <p style="font-size: 16px;">Gracias por su preferencia.</p>
        <p style="font-size: 16px;">Saludos,<br/><strong>Viñedo Ain Karim</strong></p>
        <p style="font-size: 12px; color: #6c757d; text-align: center; border-top: 1px solid #ddd; padding-top: 15px;">
          Este mensaje fue enviado automáticamente desde nuestro sistema.
        </p>
      </div>
    </body>
  </html>
      `;
  
      try {
        await strapi
          .plugin('email')
          .service('email')
          .send({
            from: {
              email: 'noreply@ainkarim.co',
              name: 'Viñedo Ain Karim',
            },
            to: result.customerEmail,
            subject,
            html: htmlTemplate,
          });
        strapi.log.info(`Email enviado a ${result.customerEmail} para pedido creado.`);
      } catch (error) {
        strapi.log.error(`Error enviando email a ${result.customerEmail}: ${error}`);
      }
    },
  
    async afterUpdate(event: any) {
      const { result, params } = event;
  
      // Se ejecuta solo si se actualiza el campo "state"
      if (params.data && params.data.state) {
        const newState = params.data.state;
        const fullName = `${result.customerName} ${result.customerMiddleName || ''} ${result.customerLastname}`.trim();
        const orderNumber = result.numberOrder || 'N/A';
        let subject = '';
        let htmlTemplate = '';
  
        if (newState === 'Pago') {
          // Correo de confirmación de pago
          subject = `Confirmación de Pago - Pedido ${orderNumber}`;
          htmlTemplate = `
  <html>
    <head>
      <meta charset="UTF-8" />
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333;">
      <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; padding: 20px; background-color: #1a1a1a; border-radius: 10px 10px 0 0;">
          <img src="https://ainkarim.co/uploads/logo_ain_karim_9987562b80.png" alt="Logo" style="width: 250px; max-width: 100%;" />
        </div>
        <h2 style="color: #2d5339; text-align: center;">¡Pedido Confirmado y Pagado!</h2>
        <p style="font-size: 16px;">Hola <strong>${fullName}</strong>,</p>
        <p style="font-size: 16px;">Hemos recibido el pago de su pedido con el número <strong>${orderNumber}</strong>. Su pedido ha sido confirmado y está en proceso.</p>
        <p style="font-size: 16px;">Gracias por su compra.</p>
        <p style="font-size: 16px;">Saludos,<br/><strong>Viñedo Ain Karim</strong></p>
        <p style="font-size: 12px; color: #6c757d; text-align: center; border-top: 1px solid #ddd; padding-top: 15px;">
          Este mensaje fue enviado automáticamente desde nuestro sistema.
        </p>
      </div>
    </body>
  </html>
          `;
        } else if (newState === 'Fallido') {
          // Correo cuando la compra falla
          subject = `Error en Pedido - Pedido ${orderNumber}`;
          htmlTemplate = `
  <html>
    <head>
      <meta charset="UTF-8" />
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333;">
      <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; padding: 20px; background-color: #1a1a1a; border-radius: 10px 10px 0 0;">
          <img src="https://ainkarim.co/uploads/logo_ain_karim_9987562b80.png" alt="Logo" style="width: 250px; max-width: 100%;" />
        </div>
        <h2 style="color: #b22222; text-align: center;">¡Error en el Pedido!</h2>
        <p style="font-size: 16px;">Hola <strong>${fullName}</strong>,</p>
        <p style="font-size: 16px;">Lamentamos informarle que ha habido un problema con el pago de su pedido con el número <strong>${orderNumber}</strong>. Por favor, intente realizar la compra nuevamente o póngase en contacto con nuestro soporte.</p>
        <p style="font-size: 16px;">Gracias por su comprensión.</p>
        <p style="font-size: 16px;">Saludos,<br/><strong>Viñedo Ain Karim</strong></p>
        <p style="font-size: 12px; color: #6c757d; text-align: center; border-top: 1px solid #ddd; padding-top: 15px;">
          Este mensaje fue enviado automáticamente desde nuestro sistema.
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
            .plugin('email')
            .service('email')
            .send({
              from: {
                email: 'noreply@ainkarim.co',
                name: 'Viñedo Ain Karim',
              },
              to: result.customerEmail,
              subject,
              html: htmlTemplate,
            });
          strapi.log.info(`Email enviado a ${result.customerEmail} para pedido actualizado a estado ${newState}.`);
        } catch (error) {
          strapi.log.error(`Error enviando email a ${result.customerEmail}: ${error}`);
        }
      }
    },
  };
  