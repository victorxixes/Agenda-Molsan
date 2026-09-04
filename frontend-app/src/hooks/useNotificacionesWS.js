import { useEffect } from "react";
import { useNotificacionesStore } from "../store/notificacionesStore";

export const useNotificacionesWS = () => {
  const addNotificacion = useNotificacionesStore((s) => s.addNotificacion);

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS}/ws/intranet`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Documentos
      if (data.tipo === "nuevo_documento") {
        addNotificacion({
          tipo: "documento",
          titulo: `Nuevo documento: ${data.titulo}`,
          descripcion: data.concepto || "",
        });
      }

      if (data.tipo === "documento_eliminado") {
        addNotificacion({
          tipo: "documento",
          titulo: `Documento eliminado`,
          descripcion: `ID: ${data.id}`,
        });
      }

      // Noticias
      if (data.tipo === "nueva_noticia") {
        addNotificacion({
          tipo: "noticia",
          titulo: `Nueva noticia: ${data.titulo}`,
          descripcion: data.descripcion || "",
        });
      }

      if (data.tipo === "noticia_eliminada") {
        addNotificacion({
          tipo: "noticia",
          titulo: `Noticia eliminada`,
          descripcion: `ID: ${data.id}`,
        });
      }

      // Aquí podrás añadir más tipos: agenda, mensajes, dashboard, etc.
    };

    return () => ws.close();
  }, []);
};
