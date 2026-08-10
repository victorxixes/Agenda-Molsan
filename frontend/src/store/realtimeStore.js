
import { create } from "zustand";
import { useMensajesStore } from "./mensajesStore";
import { useIntranetStore } from "./intranetStore";
import { useDashboardStore } from "./dashboardStore";

export const useRealtimeStore = create((set) => ({
  chat: [],
  notificaciones: [],
  agendaEventos: [],
  dashboardEventos: [],
  seguridadEventos: [],
  logsEventos: [],

  // ============================================================
  // PUSH GENÉRICOS (guardan eventos en memoria)
  // ============================================================
  pushChat: (msg) =>
    set((state) => ({ chat: [...state.chat, msg] })),

  pushNotificacion: (msg) =>
    set((state) => ({ notificaciones: [...state.notificaciones, msg] })),

  pushAgenda: (msg) =>
    set((state) => ({ agendaEventos: [...state.agendaEventos, msg] })),

  pushDashboard: (msg) =>
    set((state) => ({ dashboardEventos: [...state.dashboardEventos, msg] })),

  pushSeguridad: (msg) =>
    set((state) => ({ seguridadEventos: [...state.seguridadEventos, msg] })),

  pushLogs: (msg) =>
    set((state) => ({ logsEventos: [...state.logsEventos, msg] })),

  // ============================================================
  // HANDLER PRINCIPAL: recibe eventos WS y los distribuye
  // ============================================================
  handleEvent: (event) => {
    const msg = JSON.parse(event.data);

    // ============================================================
    // 1) REALTIME MENSAJES
    // ============================================================
    if (msg.tipo === "mensaje") {
      const mensajesStore = useMensajesStore.getState();

      mensajesStore.cargarConversacion(
        msg.remitente_id,
        msg.destinatario_id
      );

      mensajesStore.cargarNoLeidos(msg.destinatario_id);

      set((state) => ({
        chat: [...state.chat, msg]
      }));
    }

    // ============================================================
    // 2) REALTIME INTRANET
    // ============================================================
    if (msg.tipo === "intranet") {
      const intranetStore = useIntranetStore.getState();

      if (msg.accion === "crear_noticia" || msg.accion === "eliminar_noticia") {
        intranetStore.cargarNoticias();
      }

      if (msg.accion === "subir_documento" || msg.accion === "eliminar_documento") {
        intranetStore.cargarDocumentos();
      }

      set((state) => ({
        notificaciones: [...state.notificaciones, msg]
      }));
    }

    // ============================================================
    // 3) REALTIME DASHBOARD
    // ============================================================
    if (msg.tipo === "dashboard") {
      const dashboardStore = useDashboardStore.getState();

      dashboardStore.cargarDashboard();

      set((state) => ({
        dashboardEventos: [...state.dashboardEventos, msg]
      }));
    }

    // ============================================================
    // 4) REALTIME LOGS
    // ============================================================
    if (msg.tipo === "log") {
      set((state) => ({
        logsEventos: [...state.logsEventos, msg]
      }));
    }

    // ============================================================
    // 5) REALTIME SEGURIDAD
    // ============================================================
    if (msg.tipo === "seguridad") {
      set((state) => ({
        seguridadEventos: [...state.seguridadEventos, msg]
      }));
    }

    // ============================================================
    // 6) REALTIME AGENDA
    // ============================================================
    if (msg.tipo === "agenda") {
      const dashboardStore = useDashboardStore.getState();
      dashboardStore.cargarDashboard();

      set((state) => ({
        agendaEventos: [...state.agendaEventos, msg]
      }));
    }
  },
}));
