import { useEffect } from "react";
import { useAgendaStore } from "../store/agendaStore";

export const useAgendaWS = (usuarioId) => {
  const refrescarVista = useAgendaStore((s) => s.refrescarVista);

  useEffect(() => {
    const ws = new WebSocket(
      `${import.meta.env.VITE_WS}/ws/agenda`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.tipo === "ws_conectado") return;

      // Cualquier evento → refrescar
      refrescarVista();
    };

    return () => ws.close();
  }, [usuarioId]);
};
