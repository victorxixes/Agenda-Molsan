import { create } from "zustand";
import * as api from "../api/dashboard";

export const useDashboardExtendidoStore = create((set) => ({
  data: null,
  loading: false,

  cargarDashboardExtendido: async () => {
    set({ loading: true });
    const res = await api.obtenerDashboardExtendido();
    set({ data: res.data, loading: false });
  },
}));
