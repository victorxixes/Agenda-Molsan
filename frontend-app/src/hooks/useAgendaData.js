import { useEffect } from "react";
import { useAgendaStore } from "../store/agendaStore";
import { useAgendaWS } from "./useAgendaWS";

/**
 * Hook de datos de Agenda SJ‑2026
 * - Carga el mes solicitado
 * - Activa WebSocket una sola vez
 * - Devuelve citas ya sincronizadas
 */
export function useAgendaData(year, month) {
  const citas = useAgendaStore((s) => s.citas);
  const cargarMes = useAgendaStore((s) => s.cargarMes);

  // WebSocket premium: solo una vez (a nivel de componente que use este hook)
  useAgendaWS();

  useEffect(() => {
    cargarMes(year, month);
  }, [year, month, cargarMes]);

  return { citas };
}
