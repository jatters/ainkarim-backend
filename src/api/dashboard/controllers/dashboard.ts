export default {
  async dashboardMetrics(ctx) {
    try {
      const [reservas, pedidos] = await Promise.all([
        strapi.entityService.findMany("api::reserva.reserva", { populate: "*" }),
        strapi.entityService.findMany("api::pedido.pedido", { populate: "*" }),
      ]);

      return ctx.send({
        totalPedidos: pedidos.length,
        totalReservas: reservas.length,
        ordenes: [...pedidos, ...reservas],
      });
    } catch (error) {
      ctx.throw(500, "Error al obtener las métricas del dashboard");
    }
  },
};
