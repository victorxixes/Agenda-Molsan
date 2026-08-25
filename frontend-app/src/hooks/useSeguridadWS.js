import { useEffect, useRef, useState } from "react";

type SeguridadEvent = {
  id?: number;
  tipo: string;
  descripcion: string;
  fecha: string;
  payload?: any;
};

export function useSeguridadWS(room: string = "seguridad") {
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<SeguridadEvent[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/seguridad";
    const ws = new WebSocket(`${url}?room=${room}`);

    wsRef.current = ws;

    ws.onopen = () => setConnected(true);

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        setEvents((prev) => [data, ...prev].slice(0, 100));
      } catch {
        // si llega algo raro, lo ignoramos
      }
    };

    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    return () => {
      ws.close();
    };
  }, [room]);

  const send = (msg: any) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify(msg));
  };

  return { connected, events, send };
}
