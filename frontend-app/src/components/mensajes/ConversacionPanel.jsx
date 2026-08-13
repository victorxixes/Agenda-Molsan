import React, { useState, useEffect, useRef } from "react";
import { useMensajesStore } from "../../store/mensajesStore";
import { useAuthStore } from "../../store/authStore";

export default function ConversacionPanel({ destinatario }) {
  const {
    conversacion,
    cargarConversacion,
    enviarMensaje,
    marcarLeido
  } = useMensajesStore();

  const { user } = useAuthStore();
  const remitenteId = user?.id;

  const [texto, setTexto] = useState("");
  const chatRef = useRef(null);

  // Cargar conversación
  useEffect(() => {
    if (remitenteId && destinatario) {
      cargarConversacion(remitenteId, destinatario);
      marcarLeido(destinatario, remitenteId);
    }
  }, [remitenteId, destinatario]);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [conversacion]);

  if (!destinatario) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-500">
        Selecciona un usuario para comenzar la conversación
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="p-4 border-b border-neutral-300 flex items-center gap-3 bg-white">
        <img
          src={destinatario.foto || "/default-avatar.png"}
          alt={destinatario.nombre}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold text-neutral-800">
            {destinatario.nombre}
          </h2>
          <span className="text-sm text-neutral-500">
            {destinatario.logeado ? "Conectado" : "Desconectado"}
          </span>
        </div>
      </div>

      {/* Mensajes */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {conversacion.map((m) => (
          <div
            key={m.id}
            className={`max-w-[70%] p-3 rounded-xl shadow-sm text-sm ${
              m.remitente_id === remitenteId
                ? "ml-auto bg-[#D9E8FF] text-neutral-800"
                : "bg-white border border-neutral-200 text-neutral-700"
            }`}
          >
            {m.texto}
            <div className="text-xs text-neutral-400 mt-1">{m.hora}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-neutral-300 flex items-center gap-3">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 p-3 rounded-xl border border-neutral-300 focus:outline-none"
        />

        <button
          onClick={() => {
            enviarMensaje({
              remitente_id: remitenteId,
              destinatario_id: destinatario.id,
              texto,
            });
            setTexto("");
          }}
          className="bg-[#0A2E5C] text-white p-3 rounded-full hover:bg-[#08305A]"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
