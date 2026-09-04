import { useEffect } from "react";
import { useIntranetStore } from "../store/intranetStore";

export const useIntranetWS = () => {
  const cargarDocumentos = useIntranetStore((s) => s.cargarDocumentos);
  const cargarNoticias = useIntranetStore((s) => s.cargarNoticias);

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS}/ws/intranet`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.tipo.includes("documento")) cargarDocumentos();
      if (data.tipo.includes("noticia")) cargarNoticias();
    };

    return () => ws.close();
  }, []);
};
