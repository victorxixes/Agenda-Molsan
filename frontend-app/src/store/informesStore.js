import { create } from "zustand";
import {
  getInformeAgenda,
  getInformeApoderados,
  getInformeZonas,
} from "../api/informesApi";

export const useInformesStore = create((set) => ({
  loading: false,
  error: null,

  agenda: null,
  apoderados: [],
  zonas: [],

  cargarAgenda: async (year, month, day) => {
    set({ loading: true, error: null });
    try {
      const data = await getInformeAgenda(year, month, day);
      set({ agenda: data, loading: false });
    } catch (err) {
      set({ error: "Error cargando informe de agenda", loading: false });
    }
  },

  cargarApoderados: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getInformeApoderados();
      set({ apoderados: data, loading: false });
    } catch (err) {
      set({ error: "Error cargando informe de apoderados", loading: false });
    }
  },

  cargarZonas: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getInformeZonas();
      set({ zonas: data, loading: false });
    } catch (err) {
      set({ error: "Error cargando informe de zonas", loading: false });
    }
  },
}));
