import { useEffect, useRef, useState } from "react";
import { useMensajesStore } from "../../store/mensajesStore";
import { useMensajesWS } from "../../hooks/useMensajesWS";
import MensajeBubble from "../../components/mensajes/MensajeBubble";

export default function Mensajes({ usuarioId }) {
  const [otroId, setOtroId] = useState(null);
  const [texto, setTexto] = useState("");

  const {
    mensajes,
    conectados,
    typing,
    cargarConversacion,
    enviarMensajeREST,
  } = useMensajesStore();

  const wsRef = useMensajesWS(usuarioId, otroId);
  const chatRef = useRef(null);

  // Cargar conversación al seleccionar usuario
  useEffect(() => {
    if (otroId) cargarConversacion(usuarioId, otroId);
  }, [otroId]);

  // Scroll automático
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [mensajes]);

  // -----------------------------
  // Enviar mensaje por WebSocket
  // -----------------------------
  const enviarMensajeWS = () => {
    wsRef.current?.send(
      JSON.stringify({
        tipo: "mensaje",
        destinatario_id: otroId,
        contenido: texto,
      })
    );
  };

  // -----------------------------
  // Enviar typing por WebSocket
  // -----------------------------
  const enviarTypingWS = () => {
    wsRef.current?.send(
      JSON.stringify({
        tipo: "typing",
        destinatario_id: otroId,
      })
    );
  };

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      {/* Lista de empleados conectados */}
      <div className="border p-4">
        <h2 className="font-bold mb-2">Conectados</h2>
        {conectados.map((id) => (
          <div
            key={id}
            className="cursor-pointer hover:bg-gray-100 p-2"
            onClick={() => setOtroId(id)}
          >
            Usuario {id}
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="col-span-2 border p-4">
        {otroId ? (
          <>
            <h2 className="font-bold mb-2">Chat con usuario {otroId}</h2>

            <div
              ref={chatRef}
              className="h-[400px] overflow-y-auto border p-2 mb-4"
            >
              {mensajes.map((m) => (
                <MensajeBubble
                  key={m.id}
                  mensaje={m}
                  usuarioId={usuarioId}
                />
              ))}

              {/* Indicador de typing */}
              {typing[otroId] && (
                <div className="text-gray-500 italic text-sm">
                  escribiendo…
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!texto.trim()) return;

                // Enviar por WebSocket (realtime)
                enviarMensajeWS();

                // Enviar por REST (persistencia)
                await enviarMensajeREST({
                  remitente_id: usuarioId,
                  destinatario_id: otroId,
                  contenido: texto,
                });

                setTexto("");
              }}
            >
              <input
                value={texto}
                onChange={(e) => {
                  setTexto(e.target.value);
                  enviarTypingWS(); // typing realtime
                }}
                className="border p-2 w-full"
                placeholder="Escribe un mensaje…"
              />
            </form>
          </>
        ) : (
          <p>Selecciona un usuario para chatear.</p>
        )}
      </div>
    </div>
  );
}
