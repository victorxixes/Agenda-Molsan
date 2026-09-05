import { useEffect, useRef } from "react";
import { useMensajesStore } from "../store/mensajesStore";

export const useMensajesWS = (empleadoId, otroId) => {
  const wsRef = useRef(null);

  const cargarConversacion = useMensajesStore((s) => s.cargarConversacion);
  const setConectados = useMensajesStore((s) => s.setConectados);
  const setTyping = useMensajesStore((s) => s.setTyping);
  const clearTyping = useMensajesStore((s) => s.clearTyping);

  useEffect(() => {
    if (!empleadoId) return;

    const ws = new WebSocket(
      `${import.meta.env.VITE_WS_URL}/ws/mensajes/${empleadoId}`
    );

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[WS-MSG] conectado");
    };

    ws.onerror = () => {
      console.log("[WS-MSG] error en la conexión");
    };

    ws.onmessage = (event) => {
      let data;

      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      // ONLINE / OFFLINE
      if (data.tipo === "online" || data.tipo === "offline") {
        setConectados(data.user_id);
      }

      // TYPING
      if (data.tipo === "typing") {
        setTyping(data.from);
        setTimeout(() => clearTyping(data.from), 1500);
      }

      // MENSAJE / ARCHIVO
      if (
        data.tipo === "mensaje" ||
        data.tipo === "archivo" ||
        data.tipo === "nuevo_mensaje" ||
        data.tipo === "nuevo_archivo"
      ) {
        cargarConversacion(empleadoId, otroId);
      }
    };

    ws.onclose = () => {
      console.log("[WS-MSG] desconectado");
    };

    return () => ws.close();
  }, [empleadoId, otroId]);

  return wsRef; // ← DEVOLVEMOS EL WEBSOCKET
};
