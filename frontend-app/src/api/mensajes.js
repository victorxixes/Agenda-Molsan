import axios from "./axios";

/**
 * API Mensajes — Versión SJ‑2026 Premium
 * Gestiona:
 * - Conversaciones
 * - Usuarios conectados
 * - Envío de mensajes
 * - Subida de archivos
 * - Marcado de lectura
 */

/* ---------------------------------------------------------
   CONVERSACIÓN
--------------------------------------------------------- */
export const obtenerConversacion = (usuarioId, otroId) =>
  axios.get(`/mensajes/${usuarioId}/${otroId}`);

/* ---------------------------------------------------------
   USUARIOS CONECTADOS
--------------------------------------------------------- */
export const obtenerConectados = () =>
  axios.get("/mensajes/conectados");

/* ---------------------------------------------------------
   ENVIAR MENSAJE
--------------------------------------------------------- */
export const enviarMensajeREST = (data) =>
  axios.post("/mensajes", data);

/* ---------------------------------------------------------
   SUBIR ARCHIVO
--------------------------------------------------------- */
export const subirArchivo = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios.post("/mensajes/upload", fd);
};

/* ---------------------------------------------------------
   MARCAR LEÍDO
--------------------------------------------------------- */
export const marcarLeido = (mensajeId) =>
  axios.put(`/mensajes/leido/${mensajeId}`);

/* ---------------------------------------------------------
   MARCAR CONVERSACIÓN LEÍDA
--------------------------------------------------------- */
export const marcarConversacionLeida = (usuarioId, otroId) =>
  axios.put(`/mensajes/leido/conversacion/${usuarioId}/${otroId}`);
