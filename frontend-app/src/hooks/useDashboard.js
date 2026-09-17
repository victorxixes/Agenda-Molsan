import { useDashboardStore } from "../store/dashboardStore";

/**
 * Hook premium SJ‑2026
 * Acceso directo al store del Dashboard (estado + acciones)
 * Mantiene la arquitectura unificada de hooks del ERP.
 */
export const useDashboard = () => {
  return useDashboardStore();
};
