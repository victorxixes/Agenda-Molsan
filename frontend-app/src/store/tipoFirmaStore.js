import { create } from "zustand";

export const useTipoFirmaStore = create((set, get) => ({
  tiposFirma: [],
  loading: false,
  error: null,

  // Cargar tipos de firma desde el backend
  cargarTiposFirma: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch(`${import.meta.env.VITE_API_URL}/agenda/tipos-firma`);
      if (!res.ok) throw new Error("Error al cargar tipos de firma");

      const data = await res.json();

      set({
        tiposFirma: data,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error cargando tipos de firma:", err);
      set({
        loading: false,
        error: err.message || "Error desconocido",
      });
    }
  },

  // Obtener tipo de firma por ID
  getTipoFirmaById: (id) => {
    return get().tiposFirma.find((t) => t.id === Number(id)) || null;
  },
}));
