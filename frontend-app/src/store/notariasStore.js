import { create } from "zustand";
import { obtenerNotarios } from "../api/agenda";

export const useNotariasStore = create((set) => ({
  notarios: [],
  cargando: false,
  error: null,

  cargarNotarios: async () => {
    try {
      set({ cargando: true, error: null });

      const res = await obtenerNotarios();
      const lista = Array.isArray(res.data) ? res.data : [];

      set({
        notarios: lista,
        cargando: false,
        error: null,
      });
    } catch (err) {
      console.error("Error cargando notarios:", err);
      set({
        cargando: false,
        error: err.message || "Error cargando notarios",
      });
    }
  },
}));
