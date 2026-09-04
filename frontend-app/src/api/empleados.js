import axios from "./axios";

// CRUD básico
export const buscarEmpleados = (params) =>
  axios.get("/empleados/search", { params });

export const listarEmpleados = () =>
  axios.get("/empleados/");

export const obtenerEmpleado = (id) =>
  axios.get(`/empleados/${id}`);

export const crearEmpleado = (payload) =>
  axios.post("/empleados/", payload);

export const editarEmpleado = (id, payload) =>
  axios.put(`/empleados/${id}`, payload);

export const eliminarEmpleado = (id) =>
  axios.delete(`/empleados/${id}`);

// Foto
export const subirFotoEmpleado = (id, file) => {
  const formData = new FormData();
  formData.append("archivo", file);
  return axios.post(`/empleados/${id}/foto`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Seguridad: módulos y permisos
export const actualizarModulosVisibles = (id, modulos_visibles_list) =>
  axios.put(`/empleados/${id}/modulos`, { modulos_visibles_list });

export const actualizarPermisosModulo = (id, permisos_modulo_dict) =>
  axios.put(`/empleados/${id}/permisos`, { permisos_modulo_dict });

// Ficha completa
export const obtenerFichaCompleta = (id) =>
  axios.get(`/seguridad/empleado/${id}/ficha-completa`);
