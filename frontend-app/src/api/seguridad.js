import axios from "./axios";

/**
 * API Seguridad — Versión SJ‑2026 Premium
 * Gestiona:
 * - Roles
 * - Permisos globales
 * - Módulos visibles
 * - Permisos por módulo
 *
 * Todas las funciones devuelven la promesa de Axios
 * para que el store decida cómo manejar errores.
 */

/* ---------------------------------------------------------
   ROLES
--------------------------------------------------------- */
export const listarRoles = () => axios.get("/seguridad/roles");

export const crearRol = (data) =>
  axios.post("/seguridad/roles", data);

export const actualizarRol = (id, data) =>
  axios.put(`/seguridad/roles/${id}`, data);

export const eliminarRol = (id) =>
  axios.delete(`/seguridad/roles/${id}`);

/* ---------------------------------------------------------
   PERMISOS (globales)
--------------------------------------------------------- */
export const listarPermisos = () =>
  axios.get("/seguridad/permisos");

export const actualizarPermisos = (data) =>
  axios.put("/seguridad/permisos", data);

/* ---------------------------------------------------------
   MÓDULOS VISIBLES
--------------------------------------------------------- */
export const listarModulos = () =>
  axios.get("/seguridad/modulos");

export const actualizarModulos = (data) =>
  axios.put("/seguridad/modulos", data);

/* ---------------------------------------------------------
   PERMISOS POR MÓDULO
--------------------------------------------------------- */
export const listarPermisosModulo = () =>
  axios.get("/seguridad/permisos-modulo");

export const actualizarPermisosModulo = (data) =>
  axios.put("/seguridad/permisos-modulo", data);
