import { create } from "zustand";
import * as api from "../api/logs";

/**
 * Store de Logs — Versión SJ‑2026 Premium
 * Gestiona:
 * - Listado de logs
 * - Filtros
 * - Estado de carga
 */

export const useLogsStore = create((set) => ({
  logs: [],
  loading: false,
  error: null,

  // ---------------------------------------------------------
  // CARGAR LOGS
  // ---------------------------------------------------------
  cargarLogs: async (filtros = {}) => {
    set({ loading: true, error: null });

    try {
      const res = await api.listarLogs(filtros);
      set({ logs: res.data || [], loading: false });
    } catch {
      set({ logs: [], loading: false, error: "Error cargando logs" });
    }
  },
}));
