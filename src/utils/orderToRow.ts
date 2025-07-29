// src/utils/orderToRow.ts
import type { ApiPedidoPedido } from 'types/generated/contentTypes';

type RawPedido = ApiPedidoPedido['attributes'] & {
  id: number;
  reservas?: any;
};

const toBogotaDate = (iso: unknown): string => {
    if (!iso) return 'Sin Fecha';
  
    // Strapi suele entregarlo como string ISO, pero el .d.ts es más genérico
    const utcMs = new Date(iso as string).getTime();   // fuerza a string
    const bogota = new Date(utcMs - 5 * 60 * 60 * 1000);
  
    const y = bogota.getFullYear();
    const m = String(bogota.getMonth() + 1).padStart(2, '0');
    const d = String(bogota.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;                           // AAAA-MM-DD
  };

export const orderToRow = (o: RawPedido) => {
  const cliente = `${o.customerName} ${o.customerMiddleName ?? ''} ${o.customerLastname} ${o.customerSecondLastname ?? ''}`.trim();
  const reservaId =
    o.reservas?.[0]?.id ??                      // formato entityService
    o.reservas?.data?.[0]?.id ?? '';            // formato REST

    const fechaCreacion = toBogotaDate(o.createdAt);

    const hasReservationItem =
    Array.isArray(o.items) && o.items.some((it: any) => it?.isReservation)
      ? 'Sí'
      : 'No';
  return [
    o.id ? `P-${o.id}` : "Sin Pedido",
    cliente || "Sin Cliente",
    o.state || "Sin Estado",
    o.customerDocumentType || "Sin Tipo de Documento",
    o.customerDocument || "Sin Documento",
    fechaCreacion || "Sin Fecha de Creación",
    o.totalPriceOrder || 0,
    reservaId ? `R-${reservaId}` : "Sin Reserva",
    hasReservationItem
  ];
};
