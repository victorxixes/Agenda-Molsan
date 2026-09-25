import { useEffect, useRef } from "react";
import { useNotificacionesStore } from "../store/notificacionesStore";

/**
 * Hook WebSocket de notificaciones — SJ‑2026 Premium
 * - Sin reconexiones infinitas
 * - Sin bucles
 * - Compatible con Render (403 fix)
 * - Estable y seguro
 */

export const useNotificacionesWS = (empleadoId) => {
  const wsRef = useRef(null);
  const addNotificacion = useNotificacionesStore((s) => s.addNotificacion);

  useEffect(() => {
    if (!empleadoId) return;

    // Si ya está conectado, no volver a conectar
    if (wsRef.current) return;

    let ws;

    try {
      ws = new WebSocket(
        `${import.meta.env.VITE_WS_URL}/ws/notificaciones/${empleadoId}`
      );
    } catch (err) {
      console.warn("WS Notificaciones: error creando WebSocket:", err);
      return;
    }

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS Notificaciones conectado");
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

      // Guardar notificación en Zustand
      addNotificacion(data);
    };

    ws.onerror = () => {
      // 🔥 IMPORTANTE: NO reconectar automáticamente
      // Render bloquea WS con 403 → reconectar crea bucles infinitos
      console.warn("WS Notificaciones error.");
    };

    ws.onclose = () => {
      console.log("WS Notificaciones cerrado");
      wsRef.current = null;

      // 🔥 NO reconectar automáticamente
      // Render no permite reconexiones agresivas
    };

    return () => {
      try {
        ws.close();
      } catch {}
      wsRef.current = null;
    };
  }, [empleadoId, addNotificacion]);

  return wsRef;
};
