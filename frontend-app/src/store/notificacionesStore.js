import { create } from "zustand";

export const useNotificacionesStore = create((set) => ({
  notificaciones: [],

  addNotificacion: (notif) =>
    set((state) => ({
      notificaciones: [
        {
          id: Date.now(),
          tipo: notif.tipo,
          titulo: notif.titulo || "",
          descripcion: notif.descripcion || "",
          fecha: new Date().toISOString(),
        },
        ...state.notificaciones,
      ],
    })),

  clearNotificaciones: () => set({ notificaciones: [] }),
}));
