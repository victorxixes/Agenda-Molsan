import axios from "./axios";

export const seguridadAPI = {
  // ROLES
  listarRoles: () =>
    axios.get("/seguridad/roles").then(r => r.data),

  obtenerRol: (id) =>
    axios.get(`/seguridad/roles/${id}`).then(r => r.data),

  crearRol: (data) =>
    axios.post("/seguridad/roles", data).then(r => r.data),

  actualizarRol: (id, data) =>
    axios.put(`/seguridad/roles/${id}`, data).then(r => r.data),

  eliminarRol: (id) =>
    axios.delete(`/seguridad/roles/${id}`).then(r => r.data),

  actualizarPermisosRol: (id, permisos) =>
    axios.put(`/seguridad/roles/${id}/permisos`, permisos).then(r => r.data),

  actualizarModulosRol: (id, modulos) =>
    axios.put(`/seguridad/roles/${id}/modulos`, modulos).then(r => r.data),

  // AUDITORÍA
  listarAuditoria: () =>
    axios.get("/seguridad/auditoria").then(r => r.data),

  // EVENTOS
  listarEventos: () =>
    axios.get("/seguridad/eventos").then(r => r.data),
};
