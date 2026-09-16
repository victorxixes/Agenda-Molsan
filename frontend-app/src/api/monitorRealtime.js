import axios from "./axios";

/**
 * API Monitor Realtime — Versión SJ‑2026 Premium
 * Gestiona:
 * - Listado de tablas
 * - Descripción de tabla
 * - Contenido de tabla
 * - Construcción de URL WebSocket realtime
 */

/* ---------------------------------------------------------
   LISTAR TABLAS
--------------------------------------------------------- */
export const listarTablas = () =>
  axios.get("/debug/tablas");

/* ---------------------------------------------------------
   DESCRIBIR TABLA
--------------------------------------------------------- */
export const describirTabla = (tabla) =>
  axios.get(`/debug/describe/${tabla}`);

/* ---------------------------------------------------------
   OBTENER CONTENIDO DE TABLA
--------------------------------------------------------- */
export const obtenerContenidoTabla = (tabla) =>
  axios.get(`/debug/contenido/${tabla}`);

/* ---------------------------------------------------------
   URL WEBSOCKET REALTIME
--------------------------------------------------------- */
export const buildRealtimeWsUrl = (baseUrl, params) => {
  const query = new URLSearchParams(params).toString();
  return `${baseUrl.replace("http", "ws")}/ws/realtime/?${query}`;
};
