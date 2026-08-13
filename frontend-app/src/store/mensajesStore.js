import { create } from "zustand";
import { mensajesAPI } from "../api/mensajes";
import { crearLog } from "../lib/log";

export const useMensajesStore = create((set, get) => ({
  conectados: [],
  conversacion: [],
  noLeidos: 0,
  usuarioActual: null,
  typing: false,

  // ---------------------------------------------------------
  // SET TYPING (WebSocket)
  // ---------------------------------------------------------
  setTyping: (estado) => set({ typing: estado }),

  // ---------------------------------------------------------
  // USUARIOS CONECTADOS
  // ---------------------------------------------------------
  cargarConectados: async () => {
    try {
      const data = await mensajesAPI.conectados();
      const safe = Array.isArray(data) ? data : [];
      set({ conectados: safe });
    } catch (err) {
      console.error("Error cargando conectados:", err);
      set({ conectados: [] });
    }
  },

  // ---------------------------------------------------------
  // CONVERSACIÓN ENTRE DOS USUARIOS
  // ---------------------------------------------------------
  cargarConversacion: async (u1, u2) => {
    try {
      const data = await mensajesAPI.conversacion(u1, u2);
      const safe = Array.isArray(data) ? data : [];

      const normalizados = safe.map((m) => ({
        id: m.id,
        mensaje: m.mensaje,               // ✔ CORRECTO
        remitente_id: m.remitente_id,
        destinatario_id: m.destinatario_id,
        fecha: m.fecha || new Date().toISOString(),
        hora: m.hora || "",
      }));

      set({ conversacion: normalizados });
    } catch (err) {
      console.error("Error cargando conversación:", err);
      set({ conversacion: [] });
    }
  },

  // ---------------------------------------------------------
  // AÑADIR MENSAJE EN TIEMPO REAL (WebSocket)
  // ---------------------------------------------------------
agregarMensajeRealtime: (msg) =>
  set((state) => ({
    conversacion: [
      ...state.conversacion,
      {
        id: msg.id || Date.now(),
        mensaje: msg.mensaje,
        remitente_id: msg.remitente_id,
        destinatario_id: msg.destinatario_id,
        fecha: new Date().toISOString(),
        hora: "",
      },
    ],
  })),


  // ---------------------------------------------------------
  // ENVIAR MENSAJE
  // ---------------------------------------------------------
  enviarMensaje: async (data) => {
    try {
      const res = await mensajesAPI.enviar(data);

      await crearLog(
        "mensajes",
        "enviar",
        `Mensaje enviado de ${data.remitente_id} a ${data.destinatario_id}`,
        res
      );

      await get().cargarConversacion(data.remitente_id, data.destinatario_id);
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }
  },

  // ---------------------------------------------------------
  // MARCAR COMO LEÍDO
  // ---------------------------------------------------------
  marcarLeido: async (remitente, destinatario) => {
    try {
      await mensajesAPI.marcarLeido(remitente, destinatario);

      await crearLog(
        "mensajes",
        "leer",
        `Conversación marcada como leída: remitente ${remitente}, destinatario ${destinatario}`,
        { remitente, destinatario }
      );

      await get().cargarConversacion(remitente, destinatario);
    } catch (err) {
      console.error("Error marcando como leído:", err);
    }
  },

  // ---------------------------------------------------------
  // CONTADOR DE NO LEÍDOS
  // ---------------------------------------------------------
  cargarNoLeidos: async (usuarioId) => {
    try {
      const data = await mensajesAPI.noLeidos(usuarioId);
      set({ noLeidos: Number(data) || 0 });
    } catch (err) {
      console.error("Error cargando no leídos:", err);
      set({ noLeidos: 0 });
    }
  },
}));
