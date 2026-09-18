import { useEffect, useRef } from "react";

/**
 * WebSocket de Empleados — Versión SJ‑2026 Premium
 * Desactivado temporalmente.
 */
export function useEmpleadosWS(onEvento) {
  const wsRef = useRef(null);

  useEffect(() => {
    // WS desactivado temporalmente
    return () => {
      try {
        wsRef.current?.close();
      } catch {}
      wsRef.current = null;
    };
  }, []);
}
