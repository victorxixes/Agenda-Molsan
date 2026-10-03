import axios from "./axios";

/**
 * ============================================================
 * API LOGS — MOLSAN ERP SAAS PREMIUM 2027
 * ============================================================
 *
 * Gestiona:
 *
 * - Listado de logs
 * - Listado con filtros
 * - Registro de logs
 *
 * Backend:
 *
 * GET  /api/seguridad/logs/
 * POST /api/seguridad/logs/
 *
 * ============================================================
 */


/* ============================================================
   LISTAR LOGS
============================================================ */

export const listarLogs = (filtros = {}) => {
  return axios.get(
    "/seguridad/logs/",
    {
      params: filtros,
    }
  );
};


/* ============================================================
   LISTAR LOGS SIN FILTROS
============================================================ */

export const getLogs = () => {
  return axios.get(
    "/seguridad/logs/"
  );
};


/* ============================================================
   REGISTRAR LOG
============================================================ */

export const registrarLog = (payload) => {
  return axios.post(
    "/seguridad/logs/",
    payload
  );
};
