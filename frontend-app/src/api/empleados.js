import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export const empleadosAPI = {

  listar: () => axios.get(`${API}/api/empleados`).then(r => r.data),

  obtener: (id) => axios.get(`${API}/api/empleados/${id}`).then(r => r.data),

  crear: (data) => axios.post(`${API}/api/empleados`, data).then(r => r.data),

  actualizar: (id, data) =>
    axios.put(`${API}/api/empleados/${id}`, data).then(r => r.data),

  eliminar: (id) =>
    axios.delete(`${API}/api/empleados/${id}`).then(r => r.data),

  inhabilitar: (id) =>
    axios.put(`${API}/api/empleados/${id}/inhabilitar`).then(r => r.data),

  resetPassword: (id, nueva) =>
    axios.put(`${API}/api/empleados/${id}/reset-password?nueva_password=${nueva}`)
      .then(r => r.data),

  obtenerModulos: (id) =>
    axios.get(`${API}/api/empleados/${id}/modulos`).then(r => r.data),

  actualizarModulos: (id, modulos) =>
    axios.put(`${API}/api/empleados/${id}/modulos`, modulos).then(r => r.data),

  actualizarPermisos: (id, permisos) =>
    axios.put(`${API}/api/empleados/${id}/permisos`, permisos).then(r => r.data),
};
