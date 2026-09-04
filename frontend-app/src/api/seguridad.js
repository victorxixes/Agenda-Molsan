import axios from "./axios";

// Roles
export const listarRoles = () => axios.get("/seguridad/roles");
export const crearRol = (data) => axios.post("/seguridad/roles", data);
export const actualizarRol = (id, data) => axios.put(`/seguridad/roles/${id}`, data);
export const eliminarRol = (id) => axios.delete(`/seguridad/roles/${id}`);

// Permisos
export const listarPermisos = () => axios.get("/seguridad/permisos");
export const actualizarPermisos = (data) => axios.put("/seguridad/permisos", data);

// Módulos visibles
export const listarModulos = () => axios.get("/seguridad/modulos");
export const actualizarModulos = (data) => axios.put("/seguridad/modulos", data);

// Permisos por módulo
export const listarPermisosModulo = () => axios.get("/seguridad/permisos-modulo");
export const actualizarPermisosModulo = (data) =>
  axios.put("/seguridad/permisos-modulo", data);

