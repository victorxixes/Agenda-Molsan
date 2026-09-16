import { create } from "zustand";
import * as api from "../api/mensajes";

export const useMensajesStore = create((set, get) => ({
  mensajes: [],
  conectados: [],
  typing: {},

  cargarConversacion: async (usuarioId, otroId) => {
    if (!usuarioId || !otroId) return;
    try {
      const res = await api.obtenerConversacion(usuarioId, otroId);
      set({ mensajes: res.data });
    } catch (err) {
      console.error("Error cargando conversación:", err);
    }
  },

  cargarConectados: async () => {
    try {
      const res = await api.obtenerConectados();
      set({ conectados: res.data });
    } catch (err) {
      console.error("Error cargando conectados:", err);
    }
  },

  setConectadosWS: (empleado) =>
    set((state) => {
      if (empleado.offline) {
        return {
          conectados: state.conectados.filter((e) => e.id !== empleado.id),
        };
      }

      const existe = state.conectados.some((e) => e.id === empleado.id);

      if (existe) {
        return {
          conectados: state.conectados.map((e) =>
            e.id === empleado.id ? { ...e, ...empleado } : e
          ),
        };
      }

      return {
        conectados: [...state.conectados, empleado],
      };
    }),

  enviarMensajeREST: async (data) => {
    try {
      const res = await api.enviarMensajeREST(data);
      return res.data;
    } catch (err) {
      console.error("Error enviando mensaje REST:", err);
    }
  },

  marcarLeido: async (id) => {
    try {
      await api.marcarLeido(id);
    } catch (err) {
      console.error("Error marcando leído:", err);
    }
  },

  marcarConversacionLeida: async (usuarioId, otroId) => {
    try {
      await api.marcarConversacionLeida(usuarioId, otroId);
    } catch (err) {
      console.error("Error marcando conversación leída:", err);
    }
  },

  setTyping: (fromId) =>
    set((state) => ({
      typing: { ...state.typing, [fromId]: true },
    })),

  clearTyping: (fromId) =>
    set((state) => {
      const t = { ...state.typing };
      delete t[fromId];
      return { typing: t };
    }),
}));
