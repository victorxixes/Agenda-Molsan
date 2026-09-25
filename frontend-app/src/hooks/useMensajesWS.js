import { useEffect, useRef } from "react";
import { useMensajesStore } from "../store/mensajesStore";

export const useMensajesWS = (empleadoId, otroId) => {
  const wsRef = useRef(null);
  const pingInterval = useRef(null);
  const reconnectTimeout = useRef(null);

  const cargarConectados = useMensajesStore((s) => s.cargarConectados);
  const setConectadosWS = useMensajesStore((s) => s.setConectadosWS);
  const setTyping = useMensajesStore((s) => s.setTyping);
  const clearTyping = useMensajesStore((s) => s.clearTyping);

  // 🔥 Guardar usuarioId en Zustand solo cuando cambie
  useEffect(() => {
    if (!empleadoId) return;

    useMensajesStore.setState((state) => {
      if (state.usuarioId === empleadoId) return state;
      return { ...state, usuarioId: empleadoId };
    });
  }, [empleadoId]);

  useEffect(() => {
    if (!empleadoId) return;

    // Si ya existe un WS, no reconectar
    if (wsRef.current) return;

    let ws;

    const conectar = () => {
      ws = new WebSocket(
        `${import.meta.env.VITE_WS_URL}/ws/mensajes/${empleadoId}`
      );
      wsRef.current = ws;

      // ---------------------------------------------------------
      // WS OPEN
      // ---------------------------------------------------------
      ws.onopen = () => {
        cargarConectados();

        // Ping cada 15s
        pingInterval.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send("ping");
          }
        }, 15000);
      };

      // ---------------------------------------------------------
      // WS MESSAGE
      // ---------------------------------------------------------
      ws.onmessage = (event) => {
        if (!event.data) return;

        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }

        if (!data?.tipo) return;

        // ONLINE
        if (data.tipo === "online") {
          setConectadosWS(data);
        }

        // OFFLINE
        if (data.tipo === "offline") {
          setConectadosWS({ id: data.id, offline: true });
        }

        // TYPING
        if (data.tipo === "typing") {
          setTyping(data.from);
          setTimeout(() => clearTyping(data.from), 1500);
        }

        // 🔥 MENSAJE REALTIME
        if (data.tipo === "nuevo_mensaje") {
          useMensajesStore.getState().addMensajeRealtime(data.mensaje);
        }

        // 🔥 ARCHIVO REALTIME
        if (data.tipo === "nuevo_archivo") {
          useMensajesStore.getState().addArchivoRealtime(data.mensaje);
        }
      };

      // ---------------------------------------------------------
      // WS ERROR
      // ---------------------------------------------------------
      ws.onerror = () => {
        console.warn("WS Mensajes error.");
      };

      // ---------------------------------------------------------
      // WS CLOSE + RECONNECT
      // ---------------------------------------------------------
      ws.onclose = () => {
        clearInterval(pingInterval.current);
        pingInterval.current = null;
        wsRef.current = null;

        reconnectTimeout.current = setTimeout(() => {
          if (empleadoId) conectar();
        }, 2000);
      };
    };

    conectar();

    // ---------------------------------------------------------
    // CLEANUP
    // ---------------------------------------------------------
    return () => {
      try {
        wsRef.current?.close();
      } catch {}

      clearInterval(pingInterval.current);
      pingInterval.current = null;

      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }

      wsRef.current = null;
    };
  }, [
    empleadoId,
    otroId,
    cargarConectados,
    setConectadosWS,
    setTyping,
    clearTyping,
  ]);

  return wsRef;
};
