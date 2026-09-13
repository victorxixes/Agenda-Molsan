import { useEffect, useRef } from "react";
import { useAgendaStore } from "../store/agendaStore";

export function useAgendaWS(userId) {
  const wsRef = useRef(null);

  const addCita = useAgendaStore((s) => s.addCita);
  const updateCita = useAgendaStore((s) => s.updateCita);
  const removeCita = useAgendaStore((s) => s.removeCita);

  const marcarResaltada = useAgendaStore((s) => s.marcarResaltada);

  useEffect(() => {
    let ws;

    try {
      ws = new WebSocket(import.meta.env.VITE_WS_URL + "/ws/agenda");
    } catch (e) {
      console.warn("WS no disponible (Render). Modo offline.");
      return;
    }

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS Agenda conectado");
      ws.send(JSON.stringify({ tipo: "suscribir", userId }));
    };

    ws.onerror = () => console.warn("WS Agenda error. Modo offline.");
    ws.onclose = () => console.warn("WS Agenda cerrado. Modo offline.");

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (!data || !data.tipo) return;

        console.log("WS evento:", data);

        switch (data.tipo) {
          case "crear":
            addCita(data.cita);
            marcarResaltada(data.cita.id);
            break;

          case "editar":
            updateCita(data.cita);
            break;

          case "eliminar":
            removeCita(data.id);
            break;
        }
      } catch (e) {
        console.warn("WS mensaje inválido");
      }
    };

    return () => {
      try {
        ws.close();
      } catch (e) {}
    };
  }, [userId]);
}
