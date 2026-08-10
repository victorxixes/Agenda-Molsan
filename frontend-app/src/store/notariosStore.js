import { create } from "zustand";

export const useNotariosStore = create((set, get) => ({
  notarios: [],
  loading: false,
  error: null,

  // Cargar todos los notarios
  cargarNotarios: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch(`${import.meta.env.VITE_API_URL}/agenda/notarios`);
      if (!res.ok) throw new Error("Error al cargar notarios");

      const data = await res.json();

      set({
        notarios: data,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error cargando notarios:", err);
      set({
        loading: false,
        error: err.message || "Error desconocido",
      });
    }
  },

  // Obtener un notario por ID
  getNotarioById: (id) => {
    return get().notarios.find((n) => n.id === Number(id)) || null;
  },
}));
