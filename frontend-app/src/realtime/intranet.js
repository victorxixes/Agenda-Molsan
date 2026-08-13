import { connectWS } from "./ws";

export function connectIntranet(usuarioId, onMessage) {
  return connectWS(
    `${import.meta.env.VITE_API_URL_WS}/ws/intranet`,
    onMessage,
    () => ({ usuario_id: usuarioId })
  );
}
