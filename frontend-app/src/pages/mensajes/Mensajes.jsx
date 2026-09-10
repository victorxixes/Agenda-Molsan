import { useEffect, useRef, useState } from "react";
import { useMensajesStore } from "../../store/mensajesStore";
import { useMensajesWS } from "../../hooks/useMensajesWS";
import MensajeBubble from "../../components/mensajes/MensajeBubble";
import MensajesHeader from "../../components/mensajes/MensajesHeader";

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

  // Scroll inteligente
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    const estaAbajo = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;

    if (estaAbajo) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [mensajes]);

  // Enviar mensaje por WebSocket
  const enviarMensajeWS = () => {
    wsRef.current?.send(
      JSON.stringify({
        tipo: "mensaje",
        destinatario_id: otroId,
        contenido: texto,
      })
    );
  };

  // Enviar typing por WebSocket
  const enviarTypingWS = () => {
    wsRef.current?.send(
      JSON.stringify({
        tipo: "typing",
        destinatario_id: otroId,
      })
    );
  };

  // Agrupar mensajes por fecha
  const mensajesAgrupados = mensajes.reduce((acc, m) => {
    const fecha = m.fecha.split(" ")[0];
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(m);
    return acc;
  }, {});

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      
      {/* Lista de empleados conectados */}
      <div className="border p-4">
        <h2 className="font-bold mb-2">Conectados</h2>

        {conectados.map((c) => (
          <div
            key={c.id}
            className="cursor-pointer hover:bg-gray-100 p-2 flex items-center gap-3"
            onClick={() => setOtroId(c.id)}
          >
            <img
              src={c.foto || "/no-foto.png"}
              alt="foto"
              className="w-10 h-10 rounded-full object-cover border"
            />

            <div className="text-sm">
              <div className="font-semibold text-gray-900">
                {c.nombre} {c.apellidos}
              </div>
              <div className="text-xs text-gray-600">ID: {c.id}</div>
            </div>

            <span
              className={`w-3 h-3 rounded-full ${
                conectados.some((x) => x.id === c.id)
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            ></span>
          </div>
        ))}

      </div>

      {/* Chat */}
      <div className="col-span-2 border p-4">
        {otroId ? (
          <>
            {/* Cabecera del chat */}
            <MensajesHeader otroId={otroId} conectados={conectados} />

            <div
              ref={chatRef}
              className="h-[400px] overflow-y-auto border p-2 mb-4"
            >
              {Object.keys(mensajesAgrupados).map((fecha) => (
                <div key={fecha}>
                  <div className="text-center text-gray-500 text-sm my-2">
                    {fecha}
                  </div>

                  {mensajesAgrupados[fecha].map((m) => {
                    const remitente = conectados.find(
                      (x) => x.id === m.remitente_id
                    );

                    return (
                      <MensajeBubble
                        key={m.id}
                        mensaje={m}
                        usuarioId={usuarioId}
                        avatarUrl={remitente?.foto || "/no-foto.png"}
                        online={conectados.some(
                          (x) => x.id === m.remitente_id
                        )}
                      />
                    );
                  })}
                </div>
              ))}

              {/* Typing animado */}
              {typing[otroId] && (
                <div className="flex items-center gap-2 text-gray-500 italic text-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!texto.trim()) return;

                enviarMensajeWS();

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
                  enviarTypingWS();
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
