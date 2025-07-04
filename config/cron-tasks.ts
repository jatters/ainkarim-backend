export default {  
  cancelPendingReservations: {
    task: async ({ strapi }) => {
      try {
        const now = new Date();
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);        
        const formattedDate = thirtyMinutesAgo.toISOString();        
        const pendingReservations = await strapi.entityService.findMany('api::reserva.reserva', {
          filters: {
            state: 'Pendiente',
            createdAt: {
              $lt: formattedDate
            }
          },
        });
        
        console.log(`Found ${pendingReservations.length} pending reservations older than 30 minutes`);
                
        for (const reservation of pendingReservations) {
          await strapi.entityService.update('api::reserva.reserva', reservation.id, {
            data: {
              state: 'Cancelada'
            }
          });
          console.log(`Reservation ${reservation.id} (${reservation.documentId}) has been cancelled due to timeout`);
        }
      } catch (error) {
        console.error('Error in cancelPendingReservations cron task:', error);
      }
    },
    options: {
      rule: "0 * * * * *", 
    },
  },
};