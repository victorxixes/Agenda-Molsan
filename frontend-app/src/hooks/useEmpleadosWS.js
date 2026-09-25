import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";

export function useEmpleadosWS(onEvento) {
  const wsRef = useRef(null);
  const { token, authReady } = useAuthStore();

  useEffect(() => {
    if (!authReady || !token) return;

    // 🔥 Evitar doble conexión
    if (wsRef.current) return;

    const ws = new WebSocket(
      `${import.meta.env.VITE_WS_URL}/ws/empleados?token=${token}`
    );

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS Empleados conectado");
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
    };

    return () => {
      try {
        wsRef.current?.close();
      } catch {}
      wsRef.current = null;
    };
  }, [token, authReady, onEvento]);
}
