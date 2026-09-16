import { create } from "zustand";

/**
 * Store de Notificaciones — Versión SJ‑2026 Premium
 * Gestiona:
 * - Lista de notificaciones
 * - Añadir notificación
 * - Limpiar notificaciones
 */

export const useNotificacionesStore = create((set) => ({
  notificaciones: [],

  // ---------------------------------------------------------
  // AÑADIR NOTIFICACIÓN
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // LIMPIAR TODAS
  // ---------------------------------------------------------
  clearNotificaciones: () => set({ notificaciones: [] }),
}));
