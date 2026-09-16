import axios from "./axios";

/**
 * API Maestros — Versión SJ‑2026 Premium
 * Gestiona:
 * - Departamentos
 * - Secciones
 * - Cargos
 * - CRUD genérico por tipo
 */

/* ---------------------------------------------------------
   LISTAR
--------------------------------------------------------- */
export const getMaestros = async (tipo) => {
  const res = await axios.get(`/maestros/${tipo}`);
  return { data: Array.isArray(res.data) ? res.data : [] };
};

/* ---------------------------------------------------------
   OBTENER UNO
--------------------------------------------------------- */
export const obtenerMaestro = async (tipo, id) => {
  const res = await axios.get(`/maestros/${tipo}/${id}`);
  return { data: res.data || null };
};

/* ---------------------------------------------------------
   CREAR
--------------------------------------------------------- */
export const crearMaestro = async (tipo, nombre) => {
  const res = await axios.post(`/maestros/${tipo}`, { nombre });
  return { data: res.data || null };
};

/* ---------------------------------------------------------
   EDITAR
--------------------------------------------------------- */
export const editarMaestro = async (tipo, id, nombre) => {
  const res = await axios.put(`/maestros/${tipo}/${id}`, { nombre });
  return { data: res.data || null };
};

/* ---------------------------------------------------------
   ELIMINAR
--------------------------------------------------------- */
export const eliminarMaestro = async (tipo, id) => {
  const res = await axios.delete(`/maestros/${tipo}/${id}`);
  return { data: res.data || null };
};
