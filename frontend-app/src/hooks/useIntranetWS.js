import { useEffect, useRef } from "react";
import { useIntranetStore } from "../store/intranetStore";

/**
 * WebSocket de Intranet — Versión SJ‑2026 Premium
 * - Conexión blindada para Render/StrictMode
 * - Actualiza documentos y noticias en tiempo real
 * - Cierre seguro y limpieza completa
 */
export const useIntranetWS = () => {
  const cargarDocumentos = useIntranetStore((s) => s.cargarDocumentos);
  const cargarNoticias = useIntranetStore((s) => s.cargarNoticias);

  const wsRef = useRef(null);

  useEffect(() => {
    // Evitar doble conexión
    if (wsRef.current) return;

    // Cerrar WS previo si existiera
    try {
      wsRef.current?.close();
    } catch {}

    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/intranet`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      if (!event.data) return;

      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (!data?.tipo) return;

      if (data.tipo.includes("documento")) cargarDocumentos();
      if (data.tipo.includes("noticia")) cargarNoticias();
    };

    ws.onerror = () => {
      console.warn("WS Intranet error. Modo offline.");
    };

    ws.onclose = () => {
      console.warn("WS Intranet cerrado.");
    };

    return () => {
      try {
        wsRef.current?.close();
      } catch {}
      wsRef.current = null;
    };
  }, []);
};
