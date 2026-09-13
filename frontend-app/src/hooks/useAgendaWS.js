import { useEffect, useRef } from "react";
import { useAgendaStore } from "../store/agendaStore";

export function useAgendaWS(userId) {
  const wsRef = useRef(null);

  // Acceso al store
  const addCita = useAgendaStore((s) => s.addCita);
  const updateCita = useAgendaStore((s) => s.updateCita);
  const removeCita = useAgendaStore((s) => s.removeCita);

  const marcarResaltada = useAgendaStore((s) => s.marcarResaltada);
  const notify = useAgendaStore((s) => s.notify);

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
      try {
        ws.send(JSON.stringify({ tipo: "suscribir", userId }));
      } catch (e) {
        console.warn("WS: no se pudo enviar mensaje inicial");
      }
    };

    ws.onerror = () => {
      console.warn("WS Agenda error. Modo offline.");
    };

    ws.onclose = () => {
      console.warn("WS Agenda cerrado. Modo offline.");
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (!data || !data.tipo) return;

        console.log("WS evento:", data);

        switch (data.tipo) {
          // -----------------------------
          // CREAR CITA
          // -----------------------------
          case "crear":
            addCita(data.cita);
            marcarResaltada(data.cita.id);
            notify(`Nueva cita creada: ${data.cita.tipo_cita} — ${data.cita.hora_inicio}`);
            break;

          // -----------------------------
          // EDITAR CITA
          // -----------------------------
          case "editar":
            updateCita(data.cita);
            notify(`Cita actualizada: ${data.cita.tipo_cita} — ${data.cita.hora_inicio}`);
            break;

          // -----------------------------
          // ELIMINAR CITA
          // -----------------------------
          case "eliminar":
            removeCita(data.id);
            notify(`Cita eliminada`);
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
