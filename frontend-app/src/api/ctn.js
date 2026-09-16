import axios from "./axios";

/**
 * API CTN — Versión SJ‑2026 Premium
 * Gestiona:
 * - Listado de notarias con filtros y paginación
 * - Detalle de notaria
 * - Firmas de notaria
 */

/* ---------------------------------------------------------
   LISTAR NOTARIAS
--------------------------------------------------------- */
export const listarNotarias = ({
  provincia,
  municipio,
  vc,
  apoderado,
  q,
  page = 1,
  page_size = 50,
} = {}) =>
  axios.get("/ctn/notarias", {
    params: { provincia, municipio, vc, apoderado, q, page, page_size },
  });

/* ---------------------------------------------------------
   OBTENER NOTARIA
--------------------------------------------------------- */
export const obtenerNotaria = (id) =>
  axios.get(`/ctn/notarias/${id}`);

/* ---------------------------------------------------------
   OBTENER FIRMAS DE NOTARIA
--------------------------------------------------------- */
export const obtenerFirmasNotaria = (id) =>
  axios.get(`/ctn/notarias/${id}/firmas`);
