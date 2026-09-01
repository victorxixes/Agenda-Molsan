import React, { useState, useEffect, useRef } from "react";
import { useMensajesStore } from "../../store/mensajesStore";
import { useAuthStore } from "../../store/authStore";
import { connectChat } from "../../realtime/chat";

function formatearFecha(fecha) {
  const d = new Date(fecha);
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export default function ConversacionPanel({ destinatario }) {
  const {
    conversacion,
    cargarConversacion,
    enviarMensaje,
    marcarLeido,
    agregarMensajeRealtime,
    typing,
    setTyping
  } = useMensajesStore();

  const { user } = useAuthStore();
  const remitenteId = user?.id;

  const [texto, setTexto] = useState("");
  const chatRef = useRef(null);
  const wsRef = useRef(null);

  // ---------------------------------------------------------
  // WebSocket del chat
  // ---------------------------------------------------------
  useEffect(() => {
    if (!remitenteId) return;

    wsRef.current = connectChat(remitenteId, (msg) => {
      if (msg.tipo === "typing") {
        setTyping(true);
        setTimeout(() => setTyping(false), 1500);
      }

      if (msg.tipo === "nuevo_mensaje") {
        agregarMensajeRealtime(msg);
      }
    });

    return () => wsRef.current?.close();
  }, [remitenteId]);

  // ---------------------------------------------------------
  // Cargar conversación
  // ---------------------------------------------------------
useEffect(() => {
  if (!remitenteId || !destinatario?.id) return;   // ← FIX

  cargarConversacion(remitenteId, destinatario.id);
  marcarLeido(destinatario.id, remitenteId);
}, [remitenteId, destinatario]);


  // ---------------------------------------------------------
  // Auto-scroll + sonido
  // ---------------------------------------------------------
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth"
      });
    }

    const ultimo = conversacion[conversacion.length - 1];
    if (ultimo && ultimo.remitente_id !== remitenteId) {
      new Audio("/sounds/message.mp3").play();
    }
  }, [conversacion]);

  if (!destinatario) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-500">
        Selecciona un usuario para comenzar la conversación
      </div>
    );
  }

  const ultimo = conversacion[conversacion.length - 1];
  const nuevoMensajeRecibido =
    ultimo && ultimo.remitente_id !== remitenteId;

  return (
    <div className="flex-1 flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="p-4 border-b border-neutral-300 flex items-center gap-3 bg-white">
        <img
         src={  destinatario.foto ||  `${import.meta.env.VITE_API_URL}/fotos/default-avatar.png`}
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

          {typing && (
            <span className="text-xs text-neutral-400 block mt-1">
              Escribiendo…
            </span>
          )}

          {nuevoMensajeRecibido && (
            <span className="text-xs text-blue-600 font-semibold block mt-1">
              Nuevo mensaje recibido
            </span>
          )}
        </div>
      </div>

      {/* Mensajes */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {(() => {
          let ultimaFecha = null;

          return conversacion.map((m) => {
            const fechaActual = formatearFecha(m.fecha);
            const mostrarSeparador = fechaActual !== ultimaFecha;
            ultimaFecha = fechaActual;

            const esMio = m.remitente_id === remitenteId;

            return (
              <React.Fragment key={m.id}>
                {mostrarSeparador && (
                  <div className="text-center text-neutral-500 text-xs my-2">
                    {fechaActual}
                  </div>
                )}

                <div
                  className={`max-w-[70%] p-3 rounded-xl shadow-sm text-sm ${
                    esMio
                      ? "ml-auto bg-[#D9E8FF] text-neutral-800"
                      : "bg-white border border-neutral-200 text-neutral-700 flex items-start gap-2 animate-pulse"
                  }`}
                >
                 {!esMio && (
  <img
    src={
      destinatario.foto ||
      `${import.meta.env.VITE_API_URL}/fotos/default-avatar.png`
    }
    className="w-6 h-6 rounded-full object-cover"
  />
)}

                  <div>
                    {m.texto}
                    <div className="text-xs text-neutral-400 mt-1">{m.hora}</div>
                  </div>
                </div>
              </React.Fragment>
            );
          });
        })()}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-neutral-300 flex items-center gap-3">
        <input
          type="text"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);

            // Enviar evento typing
            try {
              wsRef.current?.socket?.send(
                JSON.stringify({
                  tipo: "typing",
                  remitente_id: remitenteId,
                  destinatario_id: destinatario.id
                })
              );
            } catch {}

            setTyping(true);
            setTimeout(() => setTyping(false), 1500);
          }}
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

            // Enviar por WebSocket
            try {
              wsRef.current?.socket?.send(
                JSON.stringify({
                  tipo: "mensaje",
                  remitente_id: remitenteId,
                  destinatario_id: destinatario.id,
                  texto
                })
              );
            } catch {}

            setTexto("");
          }}
          className="bg-[#0A2E5C] text-white p-3 rounded-full hover:bg-[#08305A] active:scale-90 transition-transform"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
