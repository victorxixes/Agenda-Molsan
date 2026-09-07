import { create } from "zustand";
import * as api from "../api/dashboard";

export const useDashboardStore = create((set) => ({
  data: null,
  loading: false,

  cargarDashboard: async () => {
    set({ loading: true });
    const res = await api.obtenerDashboard();
    set({ data: res.data, loading: false });
  },
}));
