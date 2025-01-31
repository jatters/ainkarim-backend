import React from "react";
import OrdersTable from "./components/OrdersTable";
import { Box, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <Box padding={3}>
      <Typography variant="h4">Resumen de Ventas</Typography>
      <OrdersTable />
    </Box>
  );
};

export default Dashboard;
