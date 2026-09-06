import { useEffect, useRef } from "react";
import { useIntranetStore } from "../store/intranetStore";

export const useIntranetWS = () => {
  const cargarDocumentos = useIntranetStore((s) => s.cargarDocumentos);
  const cargarNoticias = useIntranetStore((s) => s.cargarNoticias);

  const wsRef = useRef(null);

  useEffect(() => {
    if (wsRef.current) return; // evita doble conexión

    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/intranet`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      if (!event.data) return;

      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (!data || !data.tipo) return;

      if (data.tipo.includes("documento")) cargarDocumentos();
      if (data.tipo.includes("noticia")) cargarNoticias();
    };

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);
};
