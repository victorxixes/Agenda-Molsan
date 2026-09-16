import axios from "./axios";

/**
 * API Dashboard — Versión SJ‑2026 Premium
 * Obtiene datos agregados del sistema.
 */

export const obtenerDashboard = () =>
  axios.get("/dashboard");
