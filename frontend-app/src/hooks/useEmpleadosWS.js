import { useEffect } from "react";

export function useEmpleadosWS(onEvento) {
  useEffect(() => {
    const ws = new WebSocket("wss://TU_BACKEND/ws/empleados");

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (onEvento) onEvento(data);
      } catch {
        // ignorar
      }
    };

    ws.onopen = () => {
      ws.send(JSON.stringify({ tipo: "ping" }));
    };

    return () => {
      ws.close();
    };
  }, [onEvento]);
}
