export default ({ env }) => ({
  // ...
  email: {
    config: {
      provider: "strapi-provider-email-brevo",
      providerOptions: {
        apiKey: env("BREVO_API_KEY"),
      },
      settings: {
        defaultSenderEmail: "no-reply@ainkarim.co",
        defaultSenderName: "Viñedo Ain Karim",
        defaultReplyTo: "visitas@marquesvl.com",
      },
    },
  },
  "users-permissions": {
    config: {
      ratelimit: {
        interval: 60000,
        max: 100000,
      },
    },
  },
  "estado-de-reservas": {
    enabled: true,
    resolve: "./src/plugins/estado-de-reservas",
  },
  "reservas-libres": {
    enabled: true,
    resolve: "./src/plugins/reservas-libres",
  },
});
