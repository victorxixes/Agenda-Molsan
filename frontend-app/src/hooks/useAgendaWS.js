import { useEffect, useRef } from "react";
import { useAgendaStore } from "../store/agendaStore";

export const useAgendaWS = (usuarioId) => {
  const refrescarVista = useAgendaStore((s) => s.refrescarVista);
  const wsRef = useRef(null);

  useEffect(() => {
    // Cerrar cualquier conexión previa
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
      // Si falla la creación del WS, no rompemos nada
      return;
    }

    wsRef.current = ws;

    ws.onopen = () => {
      // Opcional: podrías enviar algo con usuarioId en el futuro
      // ws.send(JSON.stringify({ tipo: "init", usuarioId }));
    };

    ws.onerror = () => {
      // No hacemos nada, solo evitamos que burbujee
    };

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

      if (!data || !data.tipo) return;

      // Ignoramos mensajes de handshake
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
