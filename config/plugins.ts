export default ({ env }) => ({
  // ...
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"),
      },
      settings: {
        defaultFrom: "no-reply@ainkarim.co",
        defaultReplyTo: "no-reply@ainkarim.co",
        testAddress: "soporte@einscube.com",
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
