import axios from "./axios";   // ✔ usar axios centralizado

export const seguridadAPI = {
  // ✔ Rutas correctas según tu backend FastAPI
  listarRoles: () => axios.get("/seguridad/roles").then(r => r.data),
  obtenerRol: (id) => axios.get(`/seguridad/roles/${id}`).then(r => r.data),
  crearRol: (data) => axios.post("/seguridad/roles", data).then(r => r.data),
  actualizarRol: (id, data) => axios.put(`/seguridad/roles/${id}`, data).then(r => r.data),

  // ✔ Permisos reales del backend
  obtenerPermisos: () =>
    axios.get("/seguridad/permisos").then(r => r.data),

  // ✔ Eventos de seguridad
  listarEventos: () =>
    axios.get("/seguridad/eventos").then(r => r.data),
};
