
import { useRealtimeStore } from "../store/realtimeStore";

let socket = null;
let reconnectTimer = null;
let isClosing = false;

export function connectWS(url, onMessage) {
  function start() {
    try {
      if (socket && socket.readyState === WebSocket.OPEN) return socket;

      socket = new WebSocket(url);
      isClosing = false;

      socket.onopen = () => {
        console.log("WS conectado:", url);
        if (reconnectTimer) clearTimeout(reconnectTimer);
      };

      socket.onmessage = (event) => {
        try {
          if (!event || !event.data) return;
          const parsed = JSON.parse(event.data);
          onMessage(parsed); // 🔥 AHORA SÍ
        } catch (err) {
          console.warn("WS mensaje inválido:", event?.data);
        }
      };

      socket.onerror = (err) => {
        console.warn("WS error:", err);
      };

      socket.onclose = () => {
        if (isClosing) return;

        console.log("WS cerrado, reconectando en 3s:", url);

        reconnectTimer = setTimeout(() => {
          start();
        }, 3000);
      };

      return socket;

    } catch (err) {
      console.error("WS fallo al conectar:", err);
      return null;
    }
  }

  const ws = start();

  return {
    close: () => {
      try {
        isClosing = true;
        if (reconnectTimer) clearTimeout(reconnectTimer);
        if (socket && socket.readyState !== WebSocket.CLOSED) {
          socket.close();
        }
      } catch (err) {
        console.warn("WS ya estaba cerrado:", err);
      }
    }
  };
}
