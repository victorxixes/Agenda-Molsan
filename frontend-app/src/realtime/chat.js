import { connectWS } from "./ws";

export function connectChat(usuarioId, onMessage) {
  const WS = import.meta.env.VITE_WS_URL;
  return connectWS(`${WS}/ws/chat/${usuarioId}`, onMessage);
}
