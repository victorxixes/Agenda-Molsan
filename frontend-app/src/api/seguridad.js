import axios from "./axios";

export const seguridadAPI = {

  // 🔥 Listar roles reales
  listarRoles: () =>
    axios.get(`/seguridad/roles`).then(r => r.data),

  // 🔥 Crear rol
  crearRol: (data) =>
    axios.post(`/seguridad/roles`, data).then(r => r.data),

  // 🔥 Obtener permisos base
  obtenerPermisosBase: () =>
    axios.get(`/seguridad/permisos`).then(r => r.data),

  // 🔥 Obtener permisos por rol
  obtenerPermisosRol: (rolId) =>
    axios.get(`/seguridad/permisos/${rolId}`).then(r => r.data),

  // 🔥 Eventos de seguridad
  listarEventos: () =>
    axios.get(`/seguridad/eventos`).then(r => r.data),
};
