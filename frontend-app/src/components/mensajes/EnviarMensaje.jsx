import React, { useState } from "react";
import GlassCard from "../ui/GlassCard.jsx";

export default function EnviarMensaje({ remitente, destinatario, enviar }) {
  const [texto, setTexto] = useState("");

  const enviarMensaje = () => {
    if (!texto.trim()) return;
    enviar(remitente, destinatario, texto);
    setTexto("");
  };

  return (
    <GlassCard className="flex items-center gap-3 mt-4">
      <input
        type="text"
        className="flex-1 input"
        placeholder="Escribe un mensaje..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      <button
        onClick={enviarMensaje}
        className="btn-primary"
      >
        Enviar
      </button>
    </GlassCard>
  );
}
