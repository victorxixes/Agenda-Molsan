import React, { useState } from "react";
import UsuariosSidebar from "../../sidebar/UsuariosSidebar";
import ConversacionPanel from "../../components/mensajes/ConversacionPanel";
import { useMensajesStore } from "../../store/mensajesStore";

export default function MensajesChat() {
  const { conectados } = useMensajesStore();
  const [destinatarioId, setDestinatarioId] = useState(null);

  const destinatario = conectados.find((u) => u.id === destinatarioId);

  return (
    <div className="flex h-full bg-neutral-100">
      <UsuariosSidebar seleccionar={setDestinatarioId} />

      <ConversacionPanel destinatario={destinatario} />
    </div>
  );
}
