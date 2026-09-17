import { useEffect, useRef } from "react";
import { useAgendaStore } from "../store/agendaStore";

/**
 * WebSocket de Agenda — Versión SJ‑2026 Premium
 * - Conexión blindada para Render / StrictMode
 * - Manejo de eventos crear/editar/eliminar
 * - Notificaciones premium
 * - Refresco automático de la vista actual
 */
export function useAgendaWS() {
  const wsRef = useRef(null);

  const addCita = useAgendaStore((s) => s.addCita);
  const updateCita = useAgendaStore((s) => s.updateCita);
  const removeCita = useAgendaStore((s) => s.removeCita);

  const marcarResaltada = useAgendaStore((s) => s.marcarResaltada);
  const notify = useAgendaStore((s) => s.notify);
  const refrescarVista = useAgendaStore((s) => s.refrescarVista);

  useEffect(() => {
    // Evitar doble conexión en StrictMode
    if (wsRef.current) return;

    let ws;

    try {
      ws = new WebSocket(import.meta.env.VITE_WS_URL + "/ws/agenda");
    } catch {
      console.warn("WS Agenda no disponible (Render). Modo offline.");
      return;
    }

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS Agenda conectado");
    };

    ws.onerror = () => {
      console.warn("WS Agenda error. Modo offline.");
    };

    ws.onclose = () => {
      console.warn("WS Agenda cerrado. Modo offline.");
    };

    ws.onmessage = async (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (!data?.tipo) return;

        console.log("WS evento:", data);

        switch (data.tipo) {
          case "crear":
            addCita(data.cita);
            marcarResaltada(data.cita.id);
            notify(
              `Nueva cita creada: ${data.cita.tipo_cita} — ${data.cita.hora_inicio}`
            );
            // refrescarVista sin parámetros → usa fechaActual del store
            await refrescarVista();
            break;

          case "editar":
            updateCita(data.cita);
            notify(
              `Cita actualizada: ${data.cita.tipo_cita} — ${data.cita.hora_inicio}`
            );
            await refrescarVista();
            break;

          case "eliminar":
            removeCita(data.id);
            notify("Cita eliminada");
            await refrescarVista();
            break;
        }
      } catch {
        console.warn("WS mensaje inválido");
      }
    };

    return () => {
      try {
        ws.close();
      } catch {}
    };
  }, [addCita, updateCita, removeCita, marcarResaltada, notify, refrescarVista]);
}
