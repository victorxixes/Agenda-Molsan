import { useEffect, useRef } from "react";
import { useMensajesStore } from "../store/mensajesStore";

export const useMensajesWS = (empleadoId, otroId) => {
  const wsRef = useRef(null);
  const pingInterval = useRef(null);

  const cargarConversacion = useMensajesStore((s) => s.cargarConversacion);
  const cargarConectados = useMensajesStore((s) => s.cargarConectados);
  const setConectadosWS = useMensajesStore((s) => s.setConectadosWS);
  const setTyping = useMensajesStore((s) => s.setTyping);
  const clearTyping = useMensajesStore((s) => s.clearTyping);

  useEffect(() => {
    if (!empleadoId) return;

    let ws;

    const conectar = () => {
      ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/mensajes/${empleadoId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        // Cargar conectados al abrir
        cargarConectados();

        // Keep-alive
        pingInterval.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send("ping");
          }
        }, 15000);
      };

      ws.onmessage = (event) => {
        if (!event.data) return;

        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }

        if (!data || !data.tipo) return;

        if (data.tipo === "online") {
          setConectadosWS(data);
        }

        if (data.tipo === "offline") {
          setConectadosWS({ id: data.id, offline: true });
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
          if (otroId) cargarConversacion(empleadoId, otroId);
        }
      };

      ws.onclose = () => {
        clearInterval(pingInterval.current);
        pingInterval.current = null;

        // Reconectar automáticamente
        setTimeout(() => conectar(), 2000);
      };
    };

    conectar();

    return () => {
      if (wsRef.current) wsRef.current.close();
      clearInterval(pingInterval.current);
    };
  }, [empleadoId, otroId]);

  return wsRef;
};
