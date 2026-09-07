import { useEffect, useRef } from "react";
import { useAgendaStore } from "../store/agendaStore";

export const useAgendaWS = (usuarioId) => {
  const refrescarVista = useAgendaStore((s) => s.refrescarVista);
  const wsRef = useRef(null);

  useEffect(() => {
if (wsRef.current) {
  try {
    wsRef.current.close();
  } catch {}
}

    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/agenda`);
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

      if (data.tipo !== "ws_conectado") {
        refrescarVista();
      }
    };

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);
};
