import axios from "./axios";

export const seguridadAPI = {
  listarRoles: () =>
    axios.get(`/seguridad/roles`).then(r => r.data),

  crearRol: (data) =>
    axios.post(`/seguridad/roles`, data).then(r => r.data),

  obtenerPermisosBase: () =>
    axios.get(`/seguridad/permisos`).then(r => r.data),

  obtenerPermisosRol: (rolId) =>
    axios.get(`/seguridad/permisos/${rolId}`).then(r => r.data),

  listarEventos: () =>
    axios.get(`/seguridad/eventos`).then(r => r.data),
};
