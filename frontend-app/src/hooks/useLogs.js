import { useLogsStore } from "../store/logsStore";

/**
 * ============================================================
 * HOOK DE LOGS
 * ============================================================
 */

export const useLogs = () => {
  return useLogsStore();
};
