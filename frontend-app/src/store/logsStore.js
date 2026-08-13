import { create } from "zustand";
import { logsAPI } from "../api/logs";

export const useLogsStore = create((set) => ({
  logs: [],
  loading: false,

  cargarLogs: async () => {
    set({ loading: true });
    const data = await logsAPI.listar();
    set({ logs: data, loading: false });
  },

  filtrarPorUsuario: async (id) => {
    if (!id || isNaN(id)) return;   // 🔥 evita 422
    set({ loading: true });
    const data = await logsAPI.porUsuario(id);
    set({ logs: data, loading: false });
  },

  filtrarPorModulo: async (modulo) => {
    set({ loading: true });
    const data = await logsAPI.porModulo(modulo);
    set({ logs: data, loading: false });
  },

  filtrarPorNivel: async (nivel) => {
    set({ loading: true });
    const data = await logsAPI.porNivel(nivel);
    set({ logs: data, loading: false });
  },

  filtrarPorFecha: async (fechaISO) => {
    set({ loading: true });
    const data = await logsAPI.porFecha(fechaISO);
    set({ logs: data, loading: false });
  },
}));
