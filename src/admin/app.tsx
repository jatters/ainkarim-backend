import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ['es'],
  },
  bootstrap(app: StrapiAdmin) {
    console.log('Strapi Admin App Initialized:', app);

    // ✅ Forma correcta de agregar un menú en Strapi v5
    app.addMenuLink({
      to: '/dashboard',
      icon: 'ChartPie',
      intlLabel: {
        id: 'dashboard.label',
        defaultMessage: 'Dashboard',
      },
      Component: async () => {
        const Dashboard = await import('./extensions/dashboard/index');
        return Dashboard.default || Dashboard;
      },
    });
  },
};