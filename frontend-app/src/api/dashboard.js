import axios from "./axios";

export const obtenerDashboard = () =>
  axios.get("/dashboard");
