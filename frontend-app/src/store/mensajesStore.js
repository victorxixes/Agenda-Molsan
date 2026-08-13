import { create } from "zustand";
import { mensajesAPI } from "../api/mensajes";
import { crearLog } from "../lib/log";

export const useMensajesStore = create((set, get) => ({
  conectados: [],
  conversacion: [],
  noLeidos: 0,
  usuarioActual: null,

  // ---------------------------------------------------------
  // USUARIOS CONECTADOS
  // ---------------------------------------------------------
  cargarConectados: async () => {
    const data = await mensajesAPI.conectados();
    const safe = Array.isArray(data) ? data : [];
    set({ conectados: safe });
  },

  // ---------------------------------------------------------
  // CONVERSACIÓN ENTRE DOS USUARIOS
  // ---------------------------------------------------------
  cargarConversacion: async (u1, u2) => {
    const data = await mensajesAPI.conversacion(u1, u2);

    // 🔥 Protección total
    const safe = Array.isArray(data) ? data : [];

    set({ conversacion: safe });
  },

  // ---------------------------------------------------------
  // ENVIAR MENSAJE
  // ---------------------------------------------------------
  enviarMensaje: async (data) => {
    const res = await mensajesAPI.enviar(data);

    await crearLog(
      "mensajes",
      "enviar",
      `Mensaje enviado de ${data.remitente_id} a ${data.destinatario_id}`,
      res
    );

    await get().cargarConversacion(data.remitente_id, data.destinatario_id);
  },

  // ---------------------------------------------------------
  // MARCAR COMO LEÍDO
  // ---------------------------------------------------------
  marcarLeido: async (remitente, destinatario) => {
    await mensajesAPI.marcarLeido(remitente, destinatario);

    await crearLog(
      "mensajes",
      "leer",
      `Conversación marcada como leída: remitente ${remitente}, destinatario ${destinatario}`,
      { remitente, destinatario }
    );

    await get().cargarConversacion(remitente, destinatario);
  },

  // ---------------------------------------------------------
  // CONTADOR DE NO LEÍDOS
  // ---------------------------------------------------------
  cargarNoLeidos: async (usuarioId) => {
    const data = await mensajesAPI.noLeidos(usuarioId);
    set({ noLeidos: data });
  },
}));
