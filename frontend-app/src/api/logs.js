import axios from "./axios";

/**
 * API Logs — Versión SJ‑2026 Premium
 * Gestiona:
 * - Listado con filtros
 * - Listado completo
 * - Registro de eventos
 */

/* ---------------------------------------------------------
   LISTAR LOGS (con filtros)
--------------------------------------------------------- */
export const listarLogs = (filtros = {}) =>
  axios.get("/seguridad/logs/", { params: filtros });

/* ---------------------------------------------------------
   LISTAR LOGS (sin filtros)
--------------------------------------------------------- */
export const getLogs = () =>
  axios.get("/seguridad/logs/");

/* ---------------------------------------------------------
   REGISTRAR LOG
--------------------------------------------------------- */
export const registrarLog = (payload) =>
  axios.post("/seguridad/logs/", payload);
