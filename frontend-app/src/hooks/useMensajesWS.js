import { useEffect, useRef } from "react";
import { useMensajesStore } from "../store/mensajesStore";

/**
 * WebSocket de Mensajes — Versión SJ‑2026 Premium
 * - Conexión blindada para Render/StrictMode
 * - Keep-alive automático
 * - Reconexión inteligente
 * - Manejo de online/offline, typing y nuevos mensajes
 */
export const useMensajesWS = (empleadoId, otroId) => {
  const wsRef = useRef(null);
  const pingInterval = useRef(null);

  const cargarConversacion = useMensajesStore((s) => s.cargarConversacion);
  const cargarConectados = useMensajesStore((s) => s.cargarConectados);
  const setConectadosWS = useMensajesStore((s) => s.setConectadosWS);
  const setTyping = useMensajesStore((s) => s.setTyping);
  const clearTyping = useMensajesStore((s) => s.clearTyping);

  useEffect(() => {
    if (!empleadoId) return;

    // Evitar doble conexión
    if (wsRef.current) return;

    let ws;

    const conectar = () => {
      ws = new WebSocket(
        `${import.meta.env.VITE_WS_URL}/ws/mensajes/${empleadoId}`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        cargarConectados();

        // Keep-alive premium
        pingInterval.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send("ping");
          }
        }, 15000);
      };

      ws.onmessage = (event) => {
        if (!event.data) return;

        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }

        if (!data?.tipo) return;

        // Estado online/offline
        if (data.tipo === "online") {
          setConectadosWS(data);
        }

        if (data.tipo === "offline") {
          setConectadosWS({ id: data.id, offline: true });
        }

        // Typing
        if (data.tipo === "typing") {
          setTyping(data.from);
          setTimeout(() => clearTyping(data.from), 1500);
        }

        // Mensajes nuevos
        if (
          data.tipo === "mensaje" ||
          data.tipo === "archivo" ||
          data.tipo === "nuevo_mensaje" ||
          data.tipo === "nuevo_archivo"
        ) {
          if (otroId) cargarConversacion(empleadoId, otroId);
        }
      };

      ws.onerror = () => {
        console.warn("WS Mensajes error.");
      };

      ws.onclose = () => {
        clearInterval(pingInterval.current);
        pingInterval.current = null;

        // Reconexión automática premium
        setTimeout(() => conectar(), 2000);
      };
    };

    conectar();

    return () => {
      try {
        wsRef.current?.close();
      } catch {}

      clearInterval(pingInterval.current);
      pingInterval.current = null;

      wsRef.current = null;
    };
  }, [empleadoId, otroId]);

  return wsRef;
};
