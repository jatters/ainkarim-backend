export async function sendEmailBrevoWithLog(toEmail: string, toName: string, subject: string, htmlContent: string) {
    try {
      strapi.log.info(`[EMAIL] Enviando correo a ${toEmail}: "${subject}"`);
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Viñedo Ain Karim", email: "noreply@ainkarim.co" },
          to: [{ email: toEmail, name: toName }],
          subject,
          htmlContent,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error enviando email: ${errorText}`);
      }
  
      strapi.log.info(`[EMAIL] Correo enviado con éxito a ${toEmail}`);
      return await response.json();
    } catch (error) {
      strapi.log.error(`[EMAIL] Error enviando correo a ${toEmail}: ${error}`);
      throw error;
    }
  }
  