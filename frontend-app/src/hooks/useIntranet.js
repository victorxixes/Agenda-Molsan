import { useIntranetStore } from "../store/intranetStore";

/**
 * Hook premium SJ‑2026
 * Acceso directo al store de Intranet (noticias, documentos, acciones).
 * Mantiene la arquitectura unificada de hooks del ERP.
 */
export const useIntranet = () => {
  return useIntranetStore();
};

