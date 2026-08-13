import React from "react";
import UsuariosSidebar from "../../components/mensajes/UsuariosSidebar";
import ConversacionPanel from "../../components/mensajes/ConversacionPanel";

export default function MensajesChat() {
  return (
    <div className="flex h-full bg-neutral-100">
      {/* Sidebar */}
      <UsuariosSidebar />

      {/* Panel de conversación */}
      <ConversacionPanel />
    </div>
  );
}
