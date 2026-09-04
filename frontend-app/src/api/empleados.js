import axios from "./axios";

export const loginEmpleado = (data) =>
  axios.post("/empleados/empleados/login", data);

export const listarEmpleados = () =>
  axios.get("/empleados");

export const buscarEmpleados = (q, activo) =>
  axios.get("/empleados/search", { params: { q, activo } });

export const obtenerEmpleado = (id) =>
  axios.get(`/empleados/${id}`);

export const crearEmpleado = (data) =>
  axios.post("/empleados", data);

export const editarEmpleado = (id, data) =>
  axios.put(`/empleados/${id}`, data);

export const eliminarEmpleado = (id) =>
  axios.delete(`/empleados/${id}`);

export const subirFotoEmpleado = (id, archivo) => {
  const formData = new FormData();
  formData.append("archivo", archivo);
  return axios.post(`/empleados/${id}/foto`, formData);
};

export const actualizarModulosVisibles = (id, modulos) =>
  axios.put(`/empleados/${id}/modulos`, {
    modulos_visibles_list: modulos,
  });

export const actualizarPermisosModulo = (id, permisos) =>
  axios.put(`/empleados/${id}/permisos`, {
    permisos_modulo_dict: permisos,
  });

