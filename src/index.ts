// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      async afterUpdate(event) {
        const { result, params } = event;
        
        // dont send email if user is confirmed or if there's no first name
        if (!result.confirmed && result.firstName) {
          const nombreCompleto = `${result.firstName}`;
          
          try {
            await strapi.plugins['email'].services.email.send({
              to: result.email,
              from: 'Viñedo Ain Karim <no-reply@ainkarim.co>',
              replyTo: 'no-reply@ainkarim.co',
              subject: `¡${nombreCompleto.charAt(0).toUpperCase()}${nombreCompleto.slice(1).toLowerCase()}, Viñedo Ain Karim te da la bienvenida!`,
              text: `¡Hola ${nombreCompleto.charAt(0).toUpperCase()}${nombreCompleto.slice(1).toLowerCase()}!\n\nTe damos la bienvenida al Viñedo Ain Karim. Nos alegra que te hayas unido a nuestra familia.\n\nEn nuestro viñedo, cada botella cuenta una historia y cada visita es una experiencia única. Esperamos que disfrutes de nuestros vinos y servicios exclusivos.\n\nSi tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.\n\nSaludos,\nEquipo Viñedo Ain Karim`,
              html: `
                <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333;">
                <div style="max-width: 600px; width: 100%; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header con Logo -->
                  <div style="text-align: center; background-color: #1a1a1a; padding: 20px; border-radius: 10px 10px 0 0;">
                    <img src="https://ainkarim.co/uploads/logo_ain_karim_9987562b80.png" alt="Logo Viñedo Ain Karim" style="width: 250px; max-width: 100%; height: auto;"/>
                  </div>
              
                  <!-- Imagen destacada -->
                  <div style="text-align: center; margin: 20px 0;">
                    <img src="https://ainkarim.co/uploads/correo_bienvenida_4c4cc92287.jpg" alt="Viñedo Ain Karim" style="width: 100%; max-width: 560px; height: auto; border-radius: 8px;">
                  </div>
              
                  <!-- Contenido del Mensaje -->
                  <h2 style="color: #2D5339; text-align: center; font-size: 22px;">¡${nombreCompleto.charAt(0).toUpperCase()}${nombreCompleto.slice(1).toLowerCase()}, aquí comienza tu experiencia vinícola!</h2>              
                  <p style="font-size: 16px; text-align: center; line-height: 1.5;">Nos alegra que te hayas unido a nuestra familia. Prepárate para descubrir nuevos aromas, sabores y momentos inolvidables.</p>
                  <p style="font-size: 16px; text-align: center; line-height: 1.5;">En Ain Karim, cada botella cuenta una historia y cada visita es una experiencia única.</p>
                  
                  <!-- Botón de acción (mejorado para móvil) -->
                  <div style="text-align: center; margin-top: 20px;">
                    <a href="https://ainkarim.co" style="background-color: #2D5339; color: #ffffff; padding: 14px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block; max-width: 250px; width: 100%;">Explora el viñedo</a>
                  </div>
              
                  <!-- Firma -->
                  <p style="font-size: 16px; text-align: center; margin-top: 30px;">¡Nos vemos pronto!</p>
                  <p style="font-size: 16px; text-align: center; color: #2D5339; font-weight: bold;">Equipo Viñedo Ain Karim</p>
              
                  <!-- Footer -->
                  <p style="font-size: 12px; color: #6c757d; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px;">
                    Este mensaje fue enviado automáticamente desde la web de <a href="https://ainkarim.co" style="color: #2D5339; text-decoration: none;">Ainkarim.co</a>
                  </p>
                </div>
              </div>
              `
            });

            // Set user confirmed to true
            await strapi.entityService.update('plugin::users-permissions.user', result.id, {
              data: {
                confirmed: true
              }
            });

          } catch (error) {
            console.error('Error sending welcome email:', error);
          }
        }
      }
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
