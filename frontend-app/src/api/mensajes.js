import axios from "./axios";

export const obtenerConectados = () =>
  axios.get("/api/mensajes/conectados");

export const enviarMensajeREST = (data) =>
  axios.post("/api/mensajes", data);

export const subirArchivo = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post("/api/mensajes/upload", formData);
};

export const obtenerConversacion = (usuarioId, otroId) =>
  axios.get(`/api/mensajes/${usuarioId}/${otroId}`);

export const marcarLeido = (mensajeId) =>
  axios.put(`/api/mensajes/leido/${mensajeId}`);

export const marcarConversacionLeida = (usuarioId, otroId) =>
  axios.put(`/api/mensajes/leido/conversacion/${usuarioId}/${otroId}`);
