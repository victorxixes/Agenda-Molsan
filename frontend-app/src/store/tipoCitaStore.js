import { create } from "zustand";

export const useTipoCitaStore = create((set, get) => ({
  tiposCita: [],
  loading: false,
  error: null,

  // Cargar tipos de cita desde el backend
  cargarTiposCita: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch(`${import.meta.env.VITE_API_URL}/agenda/tipos-cita`);
      if (!res.ok) throw new Error("Error al cargar tipos de cita");

      const data = await res.json();

      set({
        tiposCita: data,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error cargando tipos de cita:", err);
      set({ loading: false, error: err.message });
    }
  },

  // Obtener tipo de cita por ID
  getTipoCitaById: (id) => {
    return get().tiposCita.find((t) => t.id === Number(id)) || null;
  },
}));
