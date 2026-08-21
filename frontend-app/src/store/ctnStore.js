import { create } from "zustand";
import { ctnAPI } from "../api/ctn";

export const useCTNStore = create((set, get) => ({
  notarias: [],
  loading: false,
  error: null,

  cargarNotarias: async () => {
    try {
      set({ loading: true, error: null });

      const data = await ctnAPI.listar();

      set({
        notarias: Array.isArray(data) ? data : [],
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error cargando notarías:", err);
      set({
        loading: false,
        error: err.message || "Error desconocido",
      });
    }
  },

  getNotariaById: (id) => {
    return get().notarias.find((n) => n.id === Number(id)) || null;
  },
}));
