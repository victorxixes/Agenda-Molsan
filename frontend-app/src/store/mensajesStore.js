import { create } from "zustand";
import * as api from "../api/mensajes";

export const useMensajesStore = create((set, get) => ({
  mensajes: [],
  conectados: [],
  typing: {}, // { userId: true }

  cargarConversacion: async (usuarioId, otroId) => {
    const res = await api.obtenerConversacion(usuarioId, otroId);
    set({ mensajes: res.data });
  },

  enviarMensajeREST: async (data) => {
    const res = await api.enviarMensajeREST(data);
    return res.data;
  },

  enviarArchivoREST: async (file, remitente_id, destinatario_id) => {
    const upload = await api.subirArchivo(file);
    if (upload.data.status === "ok") {
      await api.enviarMensajeREST({
        remitente_id,
        destinatario_id,
        archivo_url: upload.data.archivo_url,
      });
    }
  },

  marcarLeido: async (id) => {
    await api.marcarLeido(id);
  },

  marcarConversacionLeida: async (usuarioId, otroId) => {
    await api.marcarConversacionLeida(usuarioId, otroId);
  },

  setConectados: (lista) => set({ conectados: lista }),

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

