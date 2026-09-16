import { useCtnStore } from "../store/ctnStore";

/**
 * Hook premium SJ‑2026
 * Acceso directo al store de CTN (Notarías)
 * Mantiene la arquitectura unificada de hooks del ERP.
 */
export const useCtn = () => {
  return useCtnStore();
};
