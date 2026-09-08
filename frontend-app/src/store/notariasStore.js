import { create } from "zustand";
import { obtenerNotarios } from "../api/agenda";

export const useNotariasStore = create((set) => ({
  notarios: [],
  cargando: false,

  cargarNotarios: async () => {
    set({ cargando: true });

    const res = await obtenerNotarios();
    const lista = Array.isArray(res.data) ? res.data : [];

    set({ notarios: lista, cargando: false });
  },
}));
