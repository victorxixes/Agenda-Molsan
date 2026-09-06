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
    if (wsRef.current) return; // evita doble conexión

    const ws = new WebSocket(
      `${import.meta.env.VITE_WS_URL}/ws/mensajes/${empleadoId}`
    );

    wsRef.current = ws;

    ws.onmessage = (event) => {
      if (!event.data) return;

      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (!data || !data.tipo) return;

      if (data.tipo === "online" || data.tipo === "offline") {
        setConectados(data.user_id);
      }

      if (data.tipo === "typing") {
        setTyping(data.from);
        setTimeout(() => clearTyping(data.from), 1500);
      }

      if (
        data.tipo === "mensaje" ||
        data.tipo === "archivo" ||
        data.tipo === "nuevo_mensaje" ||
        data.tipo === "nuevo_archivo"
      ) {
        cargarConversacion(empleadoId, otroId);
      }
    };

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [empleadoId, otroId]);

  return wsRef;
};
