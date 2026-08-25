import axios from "../api/axios";

export const empleadosAPI = {
  listar: () =>
    axios.get(`/empleados`).then(r => r.data),

  obtener: (id) =>
    axios.get(`/empleados/${id}`).then(r => r.data),

  crear: (data) =>
    axios.post(`/empleados`, data).then(r => r.data),

  actualizar: (id, data) =>
    axios.put(`/empleados/${id}`, data).then(r => r.data),

  eliminar: (id) =>
    axios.delete(`/empleados/${id}`).then(r => r.data),

  // 🔥 Actualizar módulos visibles
  actualizarModulos: (id, modulos) =>
    axios.put(`/empleados/${id}/permisos`, { modulos }).then(r => r.data),

  // 🔥 Actualizar permisos por módulo
  actualizarPermisos: (id, permisos) =>
    axios.put(`/empleados/${id}/permisos-detalle`, { permisos }).then(r => r.data),

  // 🔥 Subir foto
  subirFoto: (id, archivo) => {
    const formData = new FormData();
    formData.append("archivo", archivo);
    return axios.post(`/empleados/${id}/foto`, formData).then(r => r.data);
  },
};
