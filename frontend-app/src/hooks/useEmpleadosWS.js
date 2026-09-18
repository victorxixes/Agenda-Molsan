import { useEffect, useRef } from "react";

export function useEmpleadosWS(onEvento) {
  const wsRef = useRef(null);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    if (wsRef.current) return;

    let ws;

    const conectar = () => {
      ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/empleados`);
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
        console.warn("WS Empleados error.");
      };

      ws.onclose = () => {
        console.warn("WS Empleados cerrado.");

        wsRef.current = null;

        reconnectTimeout.current = setTimeout(() => {
          conectar();
        }, 2000);
      };
    };

    conectar();

    return () => {
      try {
        wsRef.current?.close();
      } catch {}

      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }

      wsRef.current = null;
    };
  }, [onEvento]);
}
