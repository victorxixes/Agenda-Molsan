import { create } from "zustand";

export const useSistemaStore = create((set) => ({
  estado: null,
  info: null,
  loading: false,

  cargarEstado: async () => {
    set({ loading: true });
    set({
      estado: {
        message: "Sistema operativo",
        fecha: new Date().toISOString()
      },
      loading: false
    });
  },

  cargarInfo: async () => {
    set({ loading: true });
    set({
      info: {
        version: "1.0.0",
        servicios_activos: 5,
        modulos: ["agenda", "ctn", "empleados"],
        ultimo_reinicio: new Date().toISOString()
      },
      loading: false
    });
  },
}));
