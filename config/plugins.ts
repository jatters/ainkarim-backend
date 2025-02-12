export default ({ env }) => ({
    // ...
    email: {
      config: {
        provider: 'sendgrid', 
        providerOptions: {
          apiKey: env('SENDGRID_API_KEY'),
        },
        settings: {
          defaultFrom: 'no-reply@ainkarim.co',
          defaultReplyTo: 'no-reply@ainkarim.co',
          testAddress: 'soporte@einscube.com',
        },
      },
    },
    // ...
  });