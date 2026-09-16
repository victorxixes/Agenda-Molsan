import { create } from "zustand";
import * as api from "../api/herramientas";

/**
 * Store de Herramientas — Versión SJ‑2026 Premium
 * Gestiona:
 * - Importación CTN
 * - Estado de carga
 * - Resultado de la operación
 */

export const useHerramientasStore = create((set) => ({
  resultado: null,
  loading: false,
  error: null,

  // ---------------------------------------------------------
  // IMPORTAR CTN (Excel)
  // ---------------------------------------------------------
  importarCTN: async (file) => {
    set({ loading: true, error: null });

    try {
      const res = await api.importarCTN(file);
      set({ resultado: res.data || null, loading: false });
    } catch {
      set({ resultado: null, loading: false, error: "Error al importar CTN" });
    }
  },
}));
