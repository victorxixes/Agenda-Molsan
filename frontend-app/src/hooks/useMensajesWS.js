import { useEffect } from "react";
import { useMensajesStore } from "../store/mensajesStore";

export const useMensajesWS = (empleadoId, otroId) => {
  const cargarConversacion = useMensajesStore((s) => s.cargarConversacion);
  const setConectados = useMensajesStore((s) => s.setConectados);
  const setTyping = useMensajesStore((s) => s.setTyping);
  const clearTyping = useMensajesStore((s) => s.clearTyping);

  useEffect(() => {
const ws = new WebSocket(
  `${import.meta.env.VITE_WS_URL}/ws/mensajes/${empleadoId}`
);


    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.tipo === "online" || data.tipo === "offline") {
        setConectados(data.user_id);
      }

      if (data.tipo === "typing") {
        setTyping(data.from);
        setTimeout(() => clearTyping(data.from), 1500);
      }

      if (data.tipo === "mensaje" || data.tipo === "archivo") {
        cargarConversacion(empleadoId, otroId);
      }

      if (data.tipo === "nuevo_mensaje" || data.tipo === "nuevo_archivo") {
        cargarConversacion(empleadoId, otroId);
      }
    };

    return () => ws.close();
  }, [empleadoId, otroId]);
};

