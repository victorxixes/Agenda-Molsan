import { create } from "zustand";
import * as api from "../api/dashboard";

/**
 * Store del Dashboard — Versión SJ‑2026 Premium
 * Gestiona:
 * - Datos agregados del sistema
 * - Estado de carga
 */

export const useDashboardStore = create((set) => ({
  data: null,
  loading: false,

  // ---------------------------------------------------------
  // CARGAR DASHBOARD
  // ---------------------------------------------------------
  cargarDashboard: async () => {
    set({ loading: true });

    try {
      const res = await api.obtenerDashboard();
      set({ data: res.data || null, loading: false });
    } catch {
      set({ data: null, loading: false });
    }
  },
}));
