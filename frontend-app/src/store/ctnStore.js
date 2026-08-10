
import { create } from "zustand";

export const useCTNStore = create((set, get) => ({
  notarias: [],
  loading: false,
  error: null,

  // 🔥 Cargar NOTARÍAS desde CTN (CORREGIDO)
  cargarNotarias: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch(`${import.meta.env.VITE_API_URL}/ctn/notarias`);
      if (!res.ok) throw new Error("Error al cargar notarías");

      const data = await res.json();

      set({
        notarias: data,
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
