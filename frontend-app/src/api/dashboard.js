import axios from "./axios";

export const obtenerDashboard = () =>
  axios.get("/dashboard");

export const obtenerDashboardExtendido = () =>
  axios.get("/dashboard/extendido");
