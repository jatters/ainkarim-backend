'use strict';

module.exports = () => ({
  getDashboardData: async () => {
    const pedidos = await strapi.entityService.findMany('api::pedido.pedido', {
      populate: ['productos'],
    });

    const reservas = await strapi.entityService.findMany('api::reserva.reserva', {
      populate: ['plan'],
    });

    return {
      totalPedidos: pedidos.length,
      totalReservas: reservas.length,
      totalVentas: pedidos.reduce((acc, pedido) => acc + pedido.totalPriceOrder, 0),
      totalIngresosReservas: reservas.reduce((acc, reserva) => acc + reserva.totalPriceReservation, 0),
      pedidos,
      reservas,
    };
  },
});
