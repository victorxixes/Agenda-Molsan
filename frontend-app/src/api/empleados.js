import axios from "../api/axios";

export const empleadosAPI = {
  listar: () => axios.get(`/empleados`).then(r => r.data),
  obtener: (id) => axios.get(`/empleados/${id}`).then(r => r.data),
  crear: (data) => axios.post(`/empleados`, data).then(r => r.data),
  actualizar: (id, data) => axios.put(`/empleados/${id}`, data).then(r => r.data),
  eliminar: (id) => axios.delete(`/empleados/${id}`).then(r => r.data),

  inhabilitar: (id) => axios.put(`/empleados/${id}/inhabilitar`).then(r => r.data),
  resetPassword: (id, nueva) =>
    axios.put(`/empleados/${id}/reset-password?nueva_password=${nueva}`).then(r => r.data),

  obtenerModulos: (id) =>
    axios.get(`/empleados/${id}/modulos`).then(r => r.data),

  actualizarModulos: (id, modulos) =>
    axios.put(`/empleados/${id}/modulos`, modulos).then(r => r.data),

  actualizarPermisos: (id, permisos) =>
    axios.put(`/empleados/${id}/permisos`, permisos).then(r => r.data),
};
