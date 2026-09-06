import { useEffect, useRef } from "react";

export function useEmpleadosWS(onEvento) {
  const wsRef = useRef(null);

  useEffect(() => {
    if (wsRef.current) return; // evita doble conexión en StrictMode

    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/empleados`);
    wsRef.current = ws;

    ws.onmessage = (ev) => {
      if (!ev.data) return;

      let data;
      try {
        data = JSON.parse(ev.data);
      } catch {
        return;
      }

      if (data && data.tipo && onEvento) {
        onEvento(data);
      }
    };

    ws.onopen = () => {
      ws.send(JSON.stringify({ tipo: "ping" }));
    };

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);
}
