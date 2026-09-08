import { useEffect } from "react";
import { useAgendaStore } from "../store/agendaStore";
import { useEmpleadosStore } from "../store/empleadosStore";
import { useNotariasStore } from "../store/notariasStore";
import { useAgendaWS } from "./useAgendaWS";

export function useAgendaData(year, month) {
  const { citas, cargarMes } = useAgendaStore();
  const { apoderados, cargarApoderados } = useEmpleadosStore();
  const { notarias, cargarNotarias } = useNotariasStore();

  // WebSocket blindado
  useAgendaWS(1);

  useEffect(() => {
    cargarMes(year, month);
    cargarApoderados();
    cargarNotarias();
  }, [year, month]);

  return {
    citas,
    apoderados,
    notarias,
  };
}
