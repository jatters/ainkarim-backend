import { sendEmailBrevoWithLog } from "../../../../utils/email";

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = capitalize(date.toLocaleString("es-ES", { month: "long" }));
  const year = date.getFullYear();
  return `${month} ${day} de ${year}`;
}

export default {
  async afterUpdate(event: any) {
    const { result, params, previous } = event;

    if (params.data?.state === "Pago" && previous?.state !== "Pago") {
      const fullName =
        `${result.customerName} ${result.customerLastname}`.trim();
      const orderNumber = result.numberOrder || "N/A";
      const subject = `¡Pago confirmado! Tu pedido en Viñedo Ain Karim está en proceso 🍷`;
      const htmlTemplate = `
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
                        .map((item) => {
                          const unitPrice = Number(item.price) || Number(item.unitPrice) || 0;
                          const quantity = Number(item.quantity) || 1;
                          const subtotal = unitPrice * quantity;
                          return `
                            <tr>
                              <td style="border: 1px solid #ddd; padding: 8px; font-weight: 600;">
                                ${item.title || item.name || "Producto/Reserva"}
                              </td>
                              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                                ${quantity}
                              </td>
                              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                                $${unitPrice.toLocaleString("es-CO")}
                              </td>
                              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                                $${subtotal.toLocaleString("es-CO")}
                              </td>
                            </tr>
                          `;
                        })
                        .join("")}
                      </tbody>
                    </table>
                    <br />
                    <p style="font-size: 16px; margin-top: 10px;">
                      <strong>💵 Total:</strong> $${result.totalPriceOrder.toLocaleString("es-CO")}
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

      await sendEmailBrevoWithLog(
        result.customerEmail,
        fullName,
        subject,
        htmlTemplate
      );

      const elVinedo: any = await strapi.entityService.findOne(
        "api::el-vinedo.el-vinedo",
        3,
        {
          fields: ["ventasEmail"],
        }
      );

      if (elVinedo?.ventasEmail) {
        const adminSubject = `Nuevo pedido confirmado - ${orderNumber}`;
        const adminTemplate = `
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
        await sendEmailBrevoWithLog(
          elVinedo.ventasEmail,
          "Administrador",
          adminSubject,
          adminTemplate
        );
      }
    }
  },
};
