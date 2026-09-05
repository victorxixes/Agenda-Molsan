import { create } from "zustand";
import * as api from "../api/mensajes";

export const useMensajesStore = create((set, get) => ({
  mensajes: [],
  conectados: [],       // lista de IDs conectados
  typing: {},           // { userId: true }

  // =========================================================
  // CARGAR CONVERSACIÓN
  // =========================================================
  cargarConversacion: async (usuarioId, otroId) => {
    try {
      const res = await api.obtenerConversacion(usuarioId, otroId);
      set({ mensajes: res.data });
    } catch (err) {
      console.error("Error cargando conversación:", err);
    }
  },

  // =========================================================
  // ENVIAR MENSAJE REST
  // =========================================================
  enviarMensajeREST: async (data) => {
    try {
      const res = await api.enviarMensajeREST(data);
      return res.data;
    } catch (err) {
      console.error("Error enviando mensaje REST:", err);
    }
  },

  // =========================================================
  // ENVIAR ARCHIVO REST
  // =========================================================
  enviarArchivoREST: async (file, remitente_id, destinatario_id) => {
    try {
      const upload = await api.subirArchivo(file);

      if (upload?.data?.status === "ok") {
        await api.enviarMensajeREST({
          remitente_id,
          destinatario_id,
          archivo_url: upload.data.archivo_url,
        });
      }
    } catch (err) {
      console.error("Error enviando archivo:", err);
    }
  },

  // =========================================================
  // MARCAR LEÍDO
  // =========================================================
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

  // =========================================================
  // USUARIOS CONECTADOS (online/offline)
  // =========================================================
  setConectados: (userId) =>
    set((state) => {
      const esta = state.conectados.includes(userId);

      return {
        conectados: esta
          ? state.conectados.filter((id) => id !== userId) // offline
          : [...state.conectados, userId],                // online
      };
    }),

  // =========================================================
  // TYPING
  // =========================================================
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
