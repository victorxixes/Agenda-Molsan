import { create } from "zustand";
import * as api from "../api/mensajes";

/**
 * Store de Mensajes — Versión SJ‑2026 Premium
 * Gestiona:
 * - Conversación entre dos usuarios
 * - Usuarios conectados
 * - Estado typing
 * - Acciones REST
 * - Actualizaciones vía WebSocket
 */

export const useMensajesStore = create((set, get) => ({
  mensajes: [],
  conectados: [],
  typing: {},
  error: null,

  // ---------------------------------------------------------
  // CARGAR CONVERSACIÓN
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
  // CARGAR CONECTADOS
  // ---------------------------------------------------------
  cargarConectados: async () => {
    try {
      const res = await api.obtenerConectados();
      set({ conectados: res.data || [] });
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
      // Usuario desconectado
      if (empleado.offline) {
        return {
          conectados: state.conectados.filter((e) => e.id !== empleado.id),
        };
      }

      // Usuario ya existe → actualizar
      const existe = state.conectados.some((e) => e.id === empleado.id);

      if (existe) {
        return {
          conectados: state.conectados.map((e) =>
            e.id === empleado.id ? { ...e, ...empleado } : e
          ),
        };
      }

      // Usuario nuevo
      return {
        conectados: [...state.conectados, empleado],
      };
    }),

  // ---------------------------------------------------------
  // ENVIAR MENSAJE REST
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
  // MARCAR MENSAJE COMO LEÍDO
  // ---------------------------------------------------------
  marcarLeido: async (id) => {
    try {
      await api.marcarLeido(id);
    } catch (err) {
      console.error("Error marcando leído:", err);
    }
  },

  // ---------------------------------------------------------
  // MARCAR CONVERSACIÓN COMO LEÍDA
  // ---------------------------------------------------------
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
}));
