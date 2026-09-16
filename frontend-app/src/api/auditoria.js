import axios from "./axios";

/**
 * API Auditoría — Versión SJ‑2026 Premium
 * Gestiona:
 * - Auditoría general
 * - Métricas de auditoría
 * - Registro de eventos
 */

export const getAuditoria = () =>
  axios.get("/seguridad/auditoria/");

export const getAuditoriaMetricas = () =>
  axios.get("/seguridad/auditoria/metricas");

export const registrarAuditoria = (payload) =>
  axios.post("/seguridad/auditoria/", payload);
