import { create } from "zustand";
import * as api from "../api/ctn";

export const useCtnStore = create((set) => ({
  notarias: [],
  notaria: null,
  loading: false,

  cargarNotarias: async (search = "") => {
    set({ loading: true });
    const res = await api.listarNotarias(search);
    set({ notarias: res.data, loading: false });
  },

  cargarNotaria: async (id) => {
    set({ loading: true });
    const res = await api.obtenerNotaria(id);
    set({ notaria: res.data, loading: false });
  },
}));
