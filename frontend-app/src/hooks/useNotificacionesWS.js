import { useEffect, useRef } from "react";
import { useNotificacionesStore } from "../store/notificacionesStore";

export const useNotificacionesWS = (empleadoId) => {
  const wsRef = useRef(null);
  const pingInterval = useRef(null);
  const reconnectTimeout = useRef(null);

  const addNotificacion = useNotificacionesStore((s) => s.addNotificacion);

  useEffect(() => {
    if (!empleadoId) return;
    if (wsRef.current) return;

    let ws;

    const conectar = () => {
      ws = new WebSocket(
        `${import.meta.env.VITE_WS_URL}/ws/notificaciones/${empleadoId}`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        pingInterval.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send("ping");
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

        if (!data?.tipo) return;

        addNotificacion(data);
      };

      ws.onerror = () => console.warn("WS Notificaciones error.");

      ws.onclose = () => {
        clearInterval(pingInterval.current);
        pingInterval.current = null;
        wsRef.current = null;

        reconnectTimeout.current = setTimeout(() => {
          if (empleadoId) conectar();
        }, 2000);
      };
    };

    conectar();

    return () => {
      try {
        wsRef.current?.close();
      } catch {}

      clearInterval(pingInterval.current);
      pingInterval.current = null;

      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }

      wsRef.current = null;
    };
  }, [empleadoId, addNotificacion]);

  return wsRef;
};
