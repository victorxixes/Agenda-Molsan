import { useEffect } from "react";

export function useEmpleadosWS(onEvento) {
  useEffect(() => {
const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/empleados`);

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
