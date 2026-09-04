import { create } from "zustand";
import * as api from "../api/logs";

export const useLogsStore = create((set) => ({
  logs: [],
  loading: false,

  cargarLogs: async (filtros = {}) => {
    set({ loading: true });
    const res = await api.listarLogs(filtros);
    set({ logs: res.data, loading: false });
  },
}));
