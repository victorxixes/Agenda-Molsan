import { useLogsStore } from "../store/logsStore";

/**
 * Hook premium SJ‑2026
 * Acceso directo al store de Logs (estado + acciones)
 */
export const useLogs = () => {
  return useLogsStore();
};
