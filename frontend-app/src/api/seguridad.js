import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export const seguridadAPI = {
  listarRoles: () => axios.get(`${API}/roles`).then(r => r.data),
  obtenerRol: (id) => axios.get(`${API}/roles/${id}`).then(r => r.data),
  crearRol: (data) => axios.post(`${API}/roles`, data).then(r => r.data),
  actualizarRol: (id, data) => axios.put(`${API}/roles/${id}`, data).then(r => r.data),

  // NUEVO → permisos reales del backend
  obtenerPermisos: () =>
    axios.get(`${API}/seguridad/permisos`).then(r => r.data),

  listarEventos: () => axios.get(`${API}/seguridad/eventos`).then(r => r.data),
};
