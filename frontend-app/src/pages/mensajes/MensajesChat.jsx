import React, { useState, useEffect } from "react";
import UsuariosSidebar from "../../sidebar/UsuariosSidebar";
import ConversacionPanel from "../../components/mensajes/ConversacionPanel";
import { useMensajesStore } from "../../store/mensajesStore";

export default function MensajesChat() {
  const { conectados, cargarConectados } = useMensajesStore();
  const [destinatarioId, setDestinatarioId] = useState(null);

  // Cargar conectados al entrar
  useEffect(() => {
    cargarConectados();
  }, []);

  const destinatario = conectados.find((u) => u.id === destinatarioId) || null;

  return (
    <div className="flex h-full bg-neutral-100">
      <UsuariosSidebar seleccionar={setDestinatarioId} />

      <ConversacionPanel destinatario={destinatario} />
    </div>
  );
}
