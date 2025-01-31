export default {
  routes: [
    {
      method: 'GET',
      path: '/dashboard-metrics',
      handler: 'dashboard.dashboardMetrics',
      config: {
        auth: false, // Cambia a `true` si necesitas autenticación,
        polices: [],
      },
    },
  ],
};
