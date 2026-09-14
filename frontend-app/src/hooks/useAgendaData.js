import { useEffect } from "react";
import { useAgendaStore } from "../store/agendaStore";
import { useAgendaWS } from "./useAgendaWS";

export function useAgendaData(year, month) {
  const citas = useAgendaStore((s) => s.citas);
  const cargarMes = useAgendaStore((s) => s.cargarMes);

  // WebSocket: solo una vez
  useAgendaWS();

  useEffect(() => {
    cargarMes(year, month);
  }, [year, month]);

  return { citas };
}
