import { connectWS } from "./ws";

export function connectChat(usuarioId, onMessage) {
  return connectWS(`${import.meta.env.VITE_API_URL_WS}/ws/chat/${usuarioId}`, onMessage);
}
