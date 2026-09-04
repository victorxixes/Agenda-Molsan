import { create } from "zustand";
import * as api from "../api/herramientas";

export const useHerramientasStore = create((set) => ({
  resultado: null,
  loading: false,

  importarCTN: async (file) => {
    set({ loading: true });
    const res = await api.importarCTN(file);
    set({ resultado: res.data, loading: false });
  },
}));
