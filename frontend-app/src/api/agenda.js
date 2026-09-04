import axios from "./axios";

export const getCitasDia = (fecha) =>
  axios.get(`/agenda/dia/${fecha}`);

export const getCitasSemana = (fecha) =>
  axios.get(`/agenda/semana/${fecha}`);

export const getCitasMes = (year, month) =>
  axios.get(`/agenda/mes/${year}/${month}`);

export const buscarCitas = (params) =>
  axios.get("/agenda/search", { params });

export const obtenerCita = (id) =>
  axios.get(`/agenda/${id}`);

export const crearCita = (data) =>
  axios.post("/agenda", data);

export const editarCita = (id, data) =>
  axios.put(`/agenda/${id}`, data);

export const eliminarCita = (id) =>
  axios.delete(`/agenda/${id}`);

export const moverCita = (id, nueva_fecha, nueva_hora_inicio, nueva_hora_fin) =>
  axios.put(`/agenda/mover/${id}`, {
    nueva_fecha,
    nueva_hora_inicio,
    nueva_hora_fin,
  });

export const obtenerNotarios = () =>
  axios.get("/agenda/notarios");

export const obtenerRutaNotarios = () =>
  axios.get("/agenda/notarios/ruta");

