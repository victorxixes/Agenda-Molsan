import { connectWS } from "./ws";

export function connectIntranet(usuarioId, onMessage) {
  const ws = connectWS(
    `${import.meta.env.VITE_API_URL_WS}/ws/intranet`,
    onMessage
  );

  // Enviar ID del usuario al conectar
  setTimeout(() => {
    try {
      ws.socket?.send(JSON.stringify({ usuario_id: usuarioId }));
    } catch {}
  }, 300);

  return ws;
}
