import { useEffect, useRef } from "react";

/**
 * WebSocket de Empleados — Versión SJ‑2026 Premium
 * - Conexión blindada para evitar dobles WS en Render/StrictMode
 * - Recibe eventos del backend y los pasa al callback onEvento
 * - Cierre seguro y limpieza completa
 */
export function useEmpleadosWS(onEvento) {
  const wsRef = useRef(null);

  useEffect(() => {
  return; // DESACTIVAR WS TEMPORALMENTE
}, []);


    // Cerrar WS previo si existiera
    try {
      wsRef.current?.close();
    } catch {}

    // Crear conexión
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/empleados`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ tipo: "ping" }));
    };

    ws.onmessage = (ev) => {
      if (!ev.data) return;

      let data;
      try {
        data = JSON.parse(ev.data);
      } catch {
        return;
      }

      if (data?.tipo && onEvento) {
        onEvento(data);
      }
    };

    ws.onerror = () => {
      console.warn("WS Empleados error. Modo offline.");
    };

    ws.onclose = () => {
      console.warn("WS Empleados cerrado.");
    };

    return () => {
      try {
        wsRef.current?.close();
      } catch {}
      wsRef.current = null;
    };
  }, []);
}
