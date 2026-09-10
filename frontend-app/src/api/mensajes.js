import axios from "./axios";

export const obtenerConectados = () =>
  axios.get("/mensajes/conectados");

export const enviarMensajeREST = (data) =>
  axios.post("/mensajes", data);

export const subirArchivo = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post("/mensajes/upload", formData);
};

export const obtenerConversacion = (usuarioId, otroId) =>
  axios.get(`/mensajes/${usuarioId}/${otroId}`);

export const marcarLeido = (mensajeId) =>
  axios.put(`/mensajes/leido/${mensajeId}`);

export const marcarConversacionLeida = (usuarioId, otroId) =>
  axios.put(`/mensajes/leido/conversacion/${usuarioId}/${otroId}`);
