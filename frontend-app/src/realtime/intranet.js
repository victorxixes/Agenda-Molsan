import { connectWS } from "./ws";

export function connectIntranet(usuarioId, onMessage) {
  const WS = import.meta.env.VITE_WS_URL;

  return connectWS(
    `${WS}/ws/intranet`,
    onMessage,
    () => ({ usuario_id: usuarioId })
  );
}
