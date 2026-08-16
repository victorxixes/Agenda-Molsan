import { connectWS } from "./ws";

export function connectNotificaciones(usuarioId, onMessage) {
  const WS = import.meta.env.VITE_WS_URL;
  return connectWS(`${WS}/ws/notificaciones/${usuarioId}`, onMessage);
}
