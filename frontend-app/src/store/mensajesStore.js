import { create } from "zustand";
import * as api from "../api/mensajes";

export const useMensajesStore = create((set, get) => ({
  mensajes: [],
  conectados: [],
  typing: {},
  error: null,
  usuarioId: null,

  // ---------------------------------------------------------
  // CARGAR CONVERSACIÓN (solo al abrir chat)
  // ---------------------------------------------------------
  cargarConversacion: async (usuarioId, otroId) => {
    if (!usuarioId || !otroId) return;

    try {
      const res = await api.obtenerConversacion(usuarioId, otroId);
      set({ mensajes: res.data || [] });
    } catch (err) {
      console.error("Error cargando conversación:", err);
      set({ error: "Error cargando conversación" });
    }
  },

  // ---------------------------------------------------------
  // CARGAR CONECTADOS (REST)
  // ---------------------------------------------------------
  cargarConectados: async () => {
    try {
      const res = await api.obtenerConectados();
      const usuarioId = get().usuarioId;

      set({
        conectados: (res.data || []).filter((e) => e.id !== usuarioId),
      });
    } catch (err) {
      console.error("Error cargando conectados:", err);
      set({ error: "Error cargando conectados" });
    }
  },

  // ---------------------------------------------------------
  // WS: ACTUALIZAR LISTA DE CONECTADOS
  // ---------------------------------------------------------
  setConectadosWS: (empleado) =>
    set((state) => {
      const usuarioId = get().usuarioId;

      if (!empleado || !empleado.id) return state;
      if (empleado.id === usuarioId) return state;

      // OFFLINE
      if (empleado.offline) {
        return {
          conectados: state.conectados.filter((e) => e.id !== empleado.id),
        };
      }

      // ONLINE (actualizar si existe)
      const existe = state.conectados.some((e) => e.id === empleado.id);

      if (existe) {
        return {
          conectados: state.conectados.map((e) =>
            e.id === empleado.id ? { ...e, ...empleado } : e
          ),
        };
      }

      // Nuevo conectado
      return {
        conectados: [...state.conectados, empleado],
      };
    }),

  // ---------------------------------------------------------
  // REST: ENVIAR MENSAJE
  // ---------------------------------------------------------
  enviarMensajeREST: async (data) => {
    try {
      const res = await api.enviarMensajeREST(data);
      return res.data;
    } catch (err) {
      console.error("Error enviando mensaje REST:", err);
      set({ error: "Error enviando mensaje" });
      return null;
    }
  },

  // ---------------------------------------------------------
  // MARCAR LEÍDO
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // TYPING
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // 🔥 REALTIME: MENSAJE DE TEXTO
  // ---------------------------------------------------------
  addMensajeRealtime: (mensaje) =>
    set((state) => ({
      mensajes: [...state.mensajes, mensaje],
    })),

  // ---------------------------------------------------------
  // 🔥 REALTIME: ARCHIVO
  // ---------------------------------------------------------
  addArchivoRealtime: (mensaje) =>
    set((state) => ({
      mensajes: [...state.mensajes, mensaje],
    })),
}));
