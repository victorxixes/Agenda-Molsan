import React, { useState, useEffect } from "react";
import UsuariosSidebar from "../../sidebar/UsuariosSidebar";
import ConversacionPanel from "../../components/mensajes/ConversacionPanel";
import { useMensajesStore } from "../../store/mensajesStore";
import { connectChat } from "../../realtime/chat";

export default function MensajesChat() {
  const { conectados, cargarConectados } = useMensajesStore();
  const [destinatarioId, setDestinatarioId] = useState(null);

  // Cargar conectados al entrar
useEffect(() => {
  if (!user) return;

  const ws = connectChat(user.id, (msg) => {
    if (msg.tipo === "nuevo_mensaje") {
      cargarConversacion(msg.remitente_id, msg.destinatario_id);
    }

    if (msg.tipo === "typing") {
      setTyping(true);
      setTimeout(() => setTyping(false), 1500);
    }
  });

  return () => ws.close();
}, [user, destinatario]);


  const destinatario = conectados.find((u) => u.id === destinatarioId) || null;

  return (
    <div className="flex h-full bg-neutral-100">
      <UsuariosSidebar seleccionar={setDestinatarioId} />

      <ConversacionPanel destinatario={destinatario} />
    </div>
  );
}
