import { create } from "zustand";

export const usePermisosStore = create((set) => ({
  modulos: [],
  acciones: {},
  loading: false,

  setModulos: (modulos) => set({ modulos }),
  setAcciones: (acciones) => set({ acciones }),
}));
