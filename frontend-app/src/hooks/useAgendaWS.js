import { useEffect, useRef } from "react";
import { useAgendaStore } from "../store/agendaStore";

export const useAgendaWS = (usuarioId) => {
  const refrescarVista = useAgendaStore((s) => s.refrescarVista);
  const wsRef = useRef(null);

  useEffect(() => {
    // Cerrar conexión previa
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }

    let ws;
    try {
      ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/agenda`);
    } catch {
      return;
    }

    wsRef.current = ws;

    ws.onopen = () => {};

    ws.onerror = () => {};

    ws.onclose = () => {
      wsRef.current = null;
    };

    ws.onmessage = (event) => {
      if (!event.data) return;

      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (!data || typeof data !== "object") return;
      if (!data.tipo) return;

      if (data.tipo !== "ws_conectado") {
        refrescarVista?.();
      }
    };

    return () => {
      try {
        wsRef.current?.close();
      } catch {}
      wsRef.current = null;
    };
  }, [usuarioId]);
};
