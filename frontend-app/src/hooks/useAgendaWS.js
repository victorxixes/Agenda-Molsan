import { useEffect, useRef } from "react";
import { useAgendaStore } from "../store/agendaStore";

export function useAgendaWS(userId) {
  const wsRef = useRef(null);

  // Acceso al store
  const cargarDia = useAgendaStore((s) => s.cargarDia);
  const cargarSemana = useAgendaStore((s) => s.cargarSemana);
  const cargarMes = useAgendaStore((s) => s.cargarMes);
  const vista = useAgendaStore((s) => s.vista);
  const fechaActual = useAgendaStore((s) => s.fechaActual);

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

        // Refresco automático según la vista actual
        switch (vista) {
          case "dia":
            cargarDia(fechaActual);
            break;

          case "semana":
            cargarSemana(fechaActual);
            break;

          case "mes": {
            const f = new Date(fechaActual);
            cargarMes(f.getFullYear(), f.getMonth() + 1);
            break;
          }
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
  }, [userId, vista, fechaActual]);
}
