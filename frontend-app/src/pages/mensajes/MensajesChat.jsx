import React, { useState, useEffect } from "react";
import UsuariosSidebar from "../../sidebar/UsuariosSidebar";
import ConversacionPanel from "../../components/mensajes/ConversacionPanel";

import { useAuthStore } from "../../store/authStore";
import { useMensajesStore } from "../../store/mensajesStore";

import { connectChat } from "../../realtime/chat";

export default function MensajesChat() {
  const { user } = useAuthStore();

  const {
    conectados,
    cargarConectados,
    cargarConversacion,
    setTyping,
  } = useMensajesStore();

  const [destinatarioId, setDestinatarioId] = useState(null);

  // ---------------------------------------------------------
  // Cargar conectados al entrar
  // ---------------------------------------------------------
  useEffect(() => {
    cargarConectados();
  }, []);

  // ---------------------------------------------------------
  // WebSocket del chat
  // ---------------------------------------------------------
  useEffect(() => {
    if (!user?.id) return;

    const ws = connectChat(user.id, (msg) => {
      // Nuevo mensaje recibido
      if (msg.tipo === "nuevo_mensaje") {
        cargarConversacion(msg.remitente_id, msg.destinatario_id);
      }

      // Indicador escribiendo
      if (msg.tipo === "typing") {
        setTyping(true);
        setTimeout(() => setTyping(false), 1500);
      }
    });

    return () => ws.close();
  }, [user]);

  // ---------------------------------------------------------
  // Obtener destinatario seleccionado
  // ---------------------------------------------------------
  const destinatario =
    conectados.find((u) => u.id === destinatarioId) || null;

  return (
    <div className="flex h-full bg-neutral-100">
      <UsuariosSidebar seleccionar={setDestinatarioId} />
      <ConversacionPanel destinatario={destinatario} />
    </div>
  );
}
