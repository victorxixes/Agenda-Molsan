import { useEffect } from "react";
import { useAgendaStore } from "../store/agendaStore";
import { useEmpleadosStore } from "../store/empleadosStore";
import { useNotariasStore } from "../store/notariasStore";
import { useAgendaWS } from "./useAgendaWS";

export function useAgendaData(year, month) {
  const { citas, cargarMes } = useAgendaStore();
  const { apoderados, cargarApoderados } = useEmpleadosStore();

  // ⭐ Nombres correctos del store
  const { notarias, cargarNotarias } = useNotariasStore();

  // WebSocket blindado
  useAgendaWS(1);

  // Cargar todo en paralelo
  useEffect(() => {
    cargarMes(year, month);
    cargarApoderados();
    cargarNotarias();   // ⭐ nombre correcto
  }, [year, month]);

  return {
    citas,
    apoderados,
    notarias,           // ⭐ nombre correcto
  };
}
