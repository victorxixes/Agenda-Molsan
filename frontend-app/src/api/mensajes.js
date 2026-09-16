import axios from "./axios";

export const obtenerConversacion = (usuarioId, otroId) =>
  axios.get(`/mensajes/${usuarioId}/${otroId}`);

export const obtenerConectados = () =>
  axios.get("/mensajes/conectados");

export const enviarMensajeREST = (data) =>
  axios.post("/mensajes", data);

export const subirArchivo = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios.post("/mensajes/upload", fd);
};

export const marcarLeido = (mensajeId) =>
  axios.put(`/mensajes/leido/${mensajeId}`);

export const marcarConversacionLeida = (usuarioId, otroId) =>
  axios.put(`/mensajes/leido/conversacion/${usuarioId}/${otroId}`);
