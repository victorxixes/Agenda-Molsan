import { useSeguridadStore } from "../store/seguridadStore";

/**
 * Hook premium SJ‑2026
 * Acceso directo al store de Seguridad:
 * - Ficha de usuario
 * - Auditoría
 * - Logs
 * - Acciones de seguridad
 */
export const useSeguridad = () => {
  return useSeguridadStore();
};
