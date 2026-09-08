import { useEffect, useRef } from "react";

export function useAgendaWS(userId) {
  const wsRef = useRef(null);

  useEffect(() => {
    let ws;

    try {
      ws = new WebSocket("wss://agenda-intranet-b.onrender.com/ws/agenda");
    } catch (e) {
      console.warn("WS no disponible (Render). Modo offline.");
      return;
    }

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS Agenda conectado");
      try {
        ws.send(JSON.stringify({ tipo: "suscribir", userId }));
      } catch (e) {
        console.warn("WS: no se pudo enviar mensaje inicial");
      }
    };

    ws.onerror = () => {
      console.warn("WS Agenda error. Modo offline.");
    };

    ws.onclose = () => {
      console.warn("WS Agenda cerrado. Modo offline.");
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);

        // Blindaje total: si no hay tipo, ignoramos
        if (!data || !data.tipo) return;

        // Aquí puedes manejar eventos sin romper nada
        console.log("WS evento:", data);
      } catch (e) {
        console.warn("WS mensaje inválido");
      }
    };

    return () => {
      try {
        ws.close();
      } catch (e) {}
    };
  }, [userId]);
}
