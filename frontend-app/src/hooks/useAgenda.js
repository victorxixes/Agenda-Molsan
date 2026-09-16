import { useAgendaStore } from "../store/agendaStore";

/**
 * Hook premium SJ‑2026
 * Devuelve el store completo de Agenda (estado + acciones)
 */
export const useAgenda = () => {
  return useAgendaStore();
};
