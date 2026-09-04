import axios from "./axios";

export const obtenerDashboardExtendido = () =>
  axios.get("/dashboard/extendido");

