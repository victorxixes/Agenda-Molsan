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
      const notarías = Array.isArray(res.data) ? res.data : [];

      // ⭐ Extraer notarios de cada notaría
      const listaNotarios = notarías.flatMap((n) =>
        Array.isArray(n.notarios) ? n.notarios : []
      );

      set({
        notarios: listaNotarios,
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
