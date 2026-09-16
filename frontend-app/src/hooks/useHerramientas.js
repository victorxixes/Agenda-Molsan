import { useHerramientasStore } from "../store/herramientasStore";

/**
 * Hook premium SJ‑2026
 * Acceso directo al store de Herramientas.
 * Mantiene la arquitectura unificada de hooks del ERP.
 */
export const useHerramientas = () => {
  return useHerramientasStore();
};
