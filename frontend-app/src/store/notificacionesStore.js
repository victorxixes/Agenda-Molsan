import { create } from "zustand";

export const useNotificacionesStore = create((set) => ({
  notificaciones: [],
  unreadCount: 0,

  addNotificacion: (notif) =>
    set((state) => ({
      notificaciones: [
        {
          id: Date.now(),
          ...notif,
        },
        ...state.notificaciones,
      ],
      unreadCount: state.unreadCount + 1,
    })),

  clearNotificaciones: () =>
    set(() => ({
      notificaciones: [],
      unreadCount: 0,
    })),

  markAllRead: () =>
    set((state) => ({
      unreadCount: 0,
      notificaciones: state.notificaciones.map((n) => ({
        ...n,
        read: true,
      })),
    })),
}));
