import { connectWS } from "./ws";

export function connectNotificaciones(usuarioId, onMessage) {
  return connectWS(`${import.meta.env.VITE_API_URL_WS}/ws/notificaciones/${usuarioId}`, onMessage);
}
