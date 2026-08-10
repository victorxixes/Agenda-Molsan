import { create } from "zustand";

export const useApoderadosStore = create((set, get) => ({
  apoderados: [],
  loading: false,
  error: null,

  // Cargar apoderados desde el backend
  cargarApoderados: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch(`${import.meta.env.VITE_API_URL}/agenda/apoderados`);
      if (!res.ok) throw new Error("Error al cargar apoderados");

      const data = await res.json();

      set({
        apoderados: data,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error cargando apoderados:", err);
      set({
        loading: false,
        error: err.message || "Error desconocido",
      });
    }
  },

  // Obtener apoderado por ID
  getApoderadoById: (id) => {
    return get().apoderados.find((a) => a.id === Number(id)) || null;
  },
}));
