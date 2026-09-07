import axios from "./axios";

// ⭐ LISTAR TABLAS
export const listarTablas = () => {
  return axios.get("/debug/tablas");
};

// ⭐ DESCRIBIR TABLA
export const describirTabla = (tabla) => {
  return axios.get(`/debug/describe/${tabla}`);
};

// ⭐ OBTENER CONTENIDO DE TABLA
export const obtenerContenidoTabla = (tabla) => {
  return axios.get(`/debug/contenido/${tabla}`);
};

// ⭐ URL para WebSocket realtime
export const buildRealtimeWsUrl = (baseUrl, params) => {
  const query = new URLSearchParams(params).toString();
  return `${baseUrl.replace("http", "ws")}/ws/realtime/?${query}`;
};
