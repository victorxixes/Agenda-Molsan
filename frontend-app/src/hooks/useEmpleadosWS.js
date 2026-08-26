
import { useEffect, useRef, useState } from "react";

export function useEmpleadosWS(room = "empleados") {
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const base = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/empleados";
    const ws = new WebSocket(`${base}?room=${room}`);

    wsRef.current = ws;

    ws.onopen = () => setConnected(true);

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        setEvents((prev) => [data, ...prev].slice(0, 100));
      } catch {
        // ignorar mensajes no JSON
      }
    };

    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    return () => {
      ws.close();
    };
  }, [room]);

  const send = (msg) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify(msg));
  };

  return { connected, events, send };
}
