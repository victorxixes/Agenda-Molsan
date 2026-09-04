import { create } from "zustand";
import * as api from "../api/ctn";

export const useCtnStore = create((set) => ({
  items: [],
  total: 0,
  page: 1,
  page_size: 50,
  notaria: null,
  firmas: null,
  loading: false,

  cargarNotarias: async (filtros = {}) => {
    set({ loading: true });
    const res = await api.listarNotarias(filtros);
    set({
      items: res.data.items,
      total: res.data.total,
      page: res.data.page,
      page_size: res.data.page_size,
      loading: false,
    });
  },

  cargarNotaria: async (id) => {
    set({ loading: true });
    const res = await api.obtenerNotaria(id);
    set({ notaria: res.data, loading: false });
  },

  cargarFirmasNotaria: async (id) => {
    const res = await api.obtenerFirmasNotaria(id);
    set({ firmas: res.data });
  },
}));
