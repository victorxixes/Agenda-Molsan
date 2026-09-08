import { create } from "zustand";
import { obtenerNotarios } from "../api/agenda";

export const useNotariasStore = create((set) => ({
  notarias: [],
  cargando: false,
  error: null,

  cargarNotarias: async () => {
    try {
      set({ cargando: true, error: null });

      const res = await obtenerNotarios();
      const lista = Array.isArray(res.data) ? res.data : [];

      set({
        notarias: lista,
        cargando: false,
        error: null,
      });
    } catch (err) {
      console.error("Error cargando notarías:", err);
      set({
        cargando: false,
        error: err.message || "Error cargando notarías",
      });
    }
  },
}));
