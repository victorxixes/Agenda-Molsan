import { create } from "zustand";
import { auditoriaAPI } from "../api/auditoria";

export const useAuditoriaStore = create((set) => ({
  estado: null,
  metricas: null,

  cargarEstado: async () => {
    const data = await auditoriaAPI.estado();
    set({ estado: data });
  },

  cargarMetricas: async () => {
    const data = await auditoriaAPI.metricas();
    set({ metricas: data });
  },
}));
