import { appendRows } from "../src/utils/googleSheet";
import { reservationToRow } from "../src/utils/reservationToRow";
import { orderToRow } from "../src/utils/orderToRow";

export default {
  cancelPendingReservations: {
    task: async ({ strapi }) => {
      try {
        const now = new Date();
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
        const formattedDate = thirtyMinutesAgo.toISOString();
        const pendingReservations = await strapi.entityService.findMany(
          "api::reserva.reserva",
          {
            filters: {
              state: "Pendiente",
              createdAt: {
                $lt: formattedDate,
              },
            },
          }
        );

        strapi.log.info(
          `[RESERVATION_CANCELLED] Found ${pendingReservations.length} pending reservations older than 30 minutes`
        );

        for (const reservation of pendingReservations) {
          await strapi.entityService.update(
            "api::reserva.reserva",
            reservation.id,
            {
              data: {
                state: "Cancelada",
              },
            }
          );
          strapi.log.info(
            `[RESERVATION_CANCELLED] Reservation ID: ${reservation.id}, Document: ${reservation.documentId}, Date: ${reservation.reservationDate}`
          );
        }
      } catch (error) {
        strapi.log.error(
          "[RESERVATION_CANCELLED] Error in cancelPendingReservations cron task:",
          error
        );
      }
    },
    options: {
      rule: "0 * * * * *",
    },
  },
  cancelPendingOrders: {
    task: async ({ strapi }) => {
      try {
        const now = new Date();
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
        const formattedDate = thirtyMinutesAgo.toISOString();

        const pendingOrders = await strapi.entityService.findMany(
          "api::pedido.pedido",
          {
            filters: {
              state: { $in: ["Pendiente", "Procesando"] },
              createdAt: { $lt: formattedDate },
            },
          }
        );

        strapi.log.info(
          `[ORDER_CANCELLED] Found ${pendingOrders.length} pending orders older than 30 minutes`
        );

        for (const order of pendingOrders) {
          await strapi.entityService.update("api::pedido.pedido", order.id, {
            data: { state: "Cancelado", payment_status: "Fallido" },
          });
          strapi.log.info(
            `[ORDER_CANCELLED] Order ID: ${order.id}, Number: ${order.numberOrder}, Date: ${order.createdAt}`
          );
        }
      } catch (error) {
        strapi.log.error(
          "[ORDER_CANCELLED] Error in cancelPendingOrders cron task:",
          error
        );
      }
    },
    options: { rule: "30 * * * * *" }, 
  },

  exportReservationToGoogleSheet: {
    task: async ({ strapi }) => {
      try {
        const limit = 500;
        const reservations = (await strapi.entityService.findMany(
          "api::reserva.reserva",
          {
            filters: { sheetSynced: false, state: { $ne: "Pendiente" } },
            populate: {
              plan: { fields: ["name"] },
              pedidos: { fields: ["id"] },
            },
          }
        )) as any[];

        if (!reservations.length) {
          strapi.log.info('[EXPORT_RESERVATIONS] No reservations to export (pending excluded)');
          return;
        }

        const rows = reservations.map(reservationToRow);
        await appendRows(rows);
        await strapi.db.query("api::reserva.reserva").updateMany({
          where: { id: { $in: reservations.map((r) => r.id) } },
          data: { sheetSynced: true },
        });
        strapi.log.info(`[EXPORT_RESERVATIONS] Added ${rows.length} rows to Google Sheets`);
      } catch (error) {
        strapi.log.error('[EXPORT_RESERVATIONS] Error exporting reservations:', error);
      }
    },
    options: {
      rule: "0 0 23 * * 5",
    },
  },
  exportOrdersToGoogleSheet: {
    task: async ({ strapi }) => {
      try {
        const orders = (await strapi.entityService.findMany(
          "api::pedido.pedido",
          {
            filters: { sheetSyncedOrder: false, state: { $in: ["Pago", "Cancelado"] } },
            populate: { reservas: { fields: ["id"] } },
          }
        )) as any[];

        if (!orders.length) {
          strapi.log.info('[EXPORT_ORDERS] There are no orders to export');
          return;
        }

        const rows = orders.map(orderToRow);
        await appendRows(rows, "Pedidos");

        await strapi.db.query("api::pedido.pedido").updateMany({
          where: { id: { $in: orders.map((o) => o.id) } },
          data: { sheetSyncedOrder: true },
        });

        strapi.log.info(`[EXPORT_ORDERS] Added ${rows.length} rows to Google Sheets`);
      } catch (err) {
        strapi.log.error("[EXPORT_ORDERS] Error exporting orders:", err);
      }
    },
    options: { rule: "0 0 23 * * 5" },
  },
};
