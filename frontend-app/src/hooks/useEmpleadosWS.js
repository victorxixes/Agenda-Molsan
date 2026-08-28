import { useEffect, useRef, useState } from "react";
import { useEmpleadosStore } from "../store/empleadosStore";

export function useEmpleadosWS() {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  const addEvent = useEmpleadosStore((s) => s.addRealtimeEmpleadoEvent);
  const procesar = useEmpleadosStore((s) => s.procesarEventoRealtime);

  useEffect(() => {
const url = `${import.meta.env.VITE_WS_URL}/ws/empleados?room=empleados`;

    const conectar = () => {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
      };

      ws.onmessage = async (ev) => {
        let data = null;

        try {
          data = JSON.parse(ev.data);
        } catch {
          return; // ignorar mensajes no JSON
        }

        // Ignorar ACK
        if (data.tipo === "ws_conectado") return;

        // Guardar en panel realtime
        addEvent(data);

        // Procesar en el store
        await procesar(data);
      };

      ws.onclose = () => {
        setConnected(false);

        // 🔥 Reconexión automática
        setTimeout(() => conectar(), 2000);
      };

      ws.onerror = () => {
        setConnected(false);
      };
    };

    conectar();

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const send = (msg) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify(msg));
  };

  return { connected, send };
}
