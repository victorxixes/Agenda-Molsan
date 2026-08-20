import axios from "./axios";   // ✔ usar axios centralizado

export const seguridadAPI = {
  // ---------------------------------------------------------
  // ROLES
  // ---------------------------------------------------------
  listarRoles: () =>
    axios.get("/api/seguridad/roles").then(r => r.data),

  obtenerRol: (id) =>
    axios.get(`/api/seguridad/roles/${id}`).then(r => r.data),

  crearRol: (data) =>
    axios.post("/api/seguridad/roles", data).then(r => r.data),

  actualizarRol: (id, data) =>
    axios.put(`/api/seguridad/roles/${id}`, data).then(r => r.data),

  // ---------------------------------------------------------
  // PERMISOS
  // ---------------------------------------------------------
  asignarPermiso: (usuarioId, modulo, permiso) =>
    axios.post("/api/seguridad/asignar_permiso", {
      usuario_id: usuarioId,
      modulo,
      permiso,
    }).then(r => r.data),

  obtenerPermisos: () =>
    axios.get("/api/seguridad/permisos").then(r => r.data),

  // ---------------------------------------------------------
  // EVENTOS DE SEGURIDAD
  // ---------------------------------------------------------
  listarEventos: () =>
    axios.get("/api/seguridad/eventos").then(r => r.data),
};
