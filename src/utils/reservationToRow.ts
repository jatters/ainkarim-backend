import type { ApiReservaReserva } from 'types/generated/contentTypes';

type RawReserva = ApiReservaReserva['attributes'] & {
    id: number;                               // si vienes de .db.query()
    plan?: any;
    servicios_adicionale?: any;
    pedidos?: any;
  };

export const reservationToRow = (r: RawReserva) => {
  const reserva       = `R-${r.id}` || "Sin Reserva";
  const estado       = r.state || "Sin Estado";
  //const fechaPedido  = new Date(r.creationDate).toLocaleString('es-CO');
  const fechaReserva = r.reservationDate;
  const horaReserva  = r.reservationTime;
  const cliente      = `${r.customerName} ${r.customerMiddleName ?? ''} ${r.customerLastname} ${r.customerSecondLastname ?? ''}`.trim() || "Sin Nombre de Cliente";
  const cedula       = r.customerDocument || 0;
  const celular      = r.customerPhone || "Sin Celular";
  const personas     = r.guests || 0;
  const plan         = r.plan?.name || "Sin Plan";
  const pedido       = r?.pedidos?.[0]?.id ? `P-${r?.pedidos?.[0]?.id}` : "Sin Pedido";
  //const celebraciones= r.servicios_adicionale?.nombre || '';              // ajusta si tienes otro campo
  //const desde        = r.user_agent?.includes('Mobile') ? 'Móvil' : 'Web'; // ejemplo: origen
  const valor        = r.totalPriceReservation || 0;
  
  return [reserva, estado, fechaReserva, horaReserva, cliente, cedula, celular,
          personas, plan, pedido, valor];
};
