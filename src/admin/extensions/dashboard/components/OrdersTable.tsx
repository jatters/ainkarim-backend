import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton, Typography, Paper } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import axios from "axios";

// Definir la estructura de los datos
interface Order {
  id: number;
  documentId: string;
  createdAt: string;
  state: string;
  customerName: string;
  customerLastname?: string;
  customerEmail: string;
  totalPriceOrder?: number;
  totalPriceReservation?: number;
  reservationNumber?: string;
  reservationDate?: string;
  reservationTime?: string;
  plan?: { name: string; price: number };
}

// Componente de cada fila con la opción de colapsar
const OrderRow: React.FC<{ order: Order }> = ({ order }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton onClick={() => setOpen(!open)}>{open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}</IconButton>
        </TableCell>
        <TableCell>{order.id}</TableCell>
        <TableCell>{order.createdAt}</TableCell>
        <TableCell>{order.customerName} {order.customerLastname}</TableCell>
        <TableCell>{order.state}</TableCell>
        <TableCell>{order.totalPriceOrder || order.totalPriceReservation || "N/A"}</TableCell>
      </TableRow>
      
      <TableRow>
        <TableCell colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6">Detalles de la Orden</Typography>
              <Typography>Email: {order.customerEmail}</Typography>
              {order.plan && <Typography>Plan: {order.plan.name} - ${order.plan.price}</Typography>}
              {order.reservationNumber && <Typography>Reserva: {order.reservationNumber} - {order.reservationDate} {order.reservationTime}</Typography>}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Componente principal de la tabla
const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    axios.get("/api/dashboard-metrics")
      .then(response => {
        if (response.data.ordenes) {
          // Ordenar por fecha de creación
          const sortedOrders = response.data.ordenes.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(sortedOrders);
        }
      })
      .catch(error => console.error("Error cargando órdenes:", error));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell>Fecha de Creación</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map(order => <OrderRow key={order.id} order={order} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;
