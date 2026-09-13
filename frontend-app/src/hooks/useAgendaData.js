import { useEffect } from "react";
import { useAgendaStore } from "../store/agendaStore";
import { useEmpleadosStore } from "../store/empleadosStore";
import { useNotariasStore } from "../store/notariasStore";
import { useAgendaWS } from "./useAgendaWS";

export function useAgendaData(year, month) {
  const citas = useAgendaStore((s) => s.citas);
  const cargarMes = useAgendaStore((s) => s.cargarMes);

  const apoderados = useEmpleadosStore((s) => s.apoderados);
  const cargarApoderados = useEmpleadosStore((s) => s.cargarApoderados);

  const notarias = useNotariasStore((s) => s.notarias);
  const cargarNotarias = useNotariasStore((s) => s.cargarNotarias);

  // WebSocket con handlers reales (crear/editar/eliminar)
  useAgendaWS(1);

  useEffect(() => {
    // Carga inicial del mes
    cargarMes(year, month);

    // Cargar datos auxiliares
    cargarApoderados();
    cargarNotarias();
  }, [year, month]);

  return {
    citas,
    apoderados,
    notarias,
  };
}
