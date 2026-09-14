import axios from "./axios";

export const getCitasMes = (year, month) =>
  axios.get(`/api/agenda/mes/${year}/${month}`);

export const getCitasDia = (fecha) =>
  axios.get(`/api/agenda/dia/${fecha}`);

export const getCitasSemana = (fecha) =>
  axios.get(`/api/agenda/semana/${fecha}`);

export const buscarCitas = (params) =>
  axios.get(`/api/agenda/search`, { params });

export const obtenerCita = (id) =>
  axios.get(`/api/agenda/${id}`);

export const crearCita = (data) =>
  axios.post(`/api/agenda/`, data);

export const editarCita = (id, data) =>
  axios.put(`/api/agenda/${id}`, data);

export const eliminarCita = (id) =>
  axios.delete(`/api/agenda/${id}`);

export const moverCita = (id, fecha, inicio, fin) =>
  axios.put(`/api/agenda/mover/${id}`, null, {
    params: {
      nueva_fecha: fecha,
      nueva_hora_inicio: inicio,
      nueva_hora_fin: fin,
    },
  });
