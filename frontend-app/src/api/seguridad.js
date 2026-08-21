import axios from "./axios";

export const seguridadAPI = {

  listarRoles: () =>
    axios.get(`/seguridad/roles`).then(r => r.data),

  obtenerRol: (id) =>
    axios.get(`/seguridad/roles/${id}`).then(r => r.data),

  crearRol: (data) =>
    axios.post(`/seguridad/roles`, data).then(r => r.data),

  actualizarRol: (id, data) =>
    axios.put(`/seguridad/roles/${id}`, data).then(r => r.data),

  asignarPermiso: (usuarioId, modulo, permiso) =>
    axios.post(`/seguridad/asignar_permiso`, {
      usuario_id: usuarioId,
      modulo,
      permiso,
    }).then(r => r.data),

  obtenerPermisos: () =>
    axios.get(`/seguridad/permisos`).then(r => r.data),

  listarEventos: () =>
    axios.get(`/seguridad/eventos`).then(r => r.data),
};

