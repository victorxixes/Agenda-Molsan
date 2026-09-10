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
  }, [otroId, usuarioId, cargarConversacion]);

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
    if (!otroId || !texto.trim()) return;

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
    if (!otroId) return;

    wsRef.current?.send(
      JSON.stringify({
        tipo: "typing",
        destinatario_id: otroId,
      })
    );
  };

  // Agrupar mensajes por fecha (FIX: fecha como Date, no split directo)
  const mensajesAgrupados = mensajes.reduce((acc, m) => {
    const fechaObj = new Date(m.fecha);
    const fecha =
      isNaN(fechaObj.getTime())
        ? "Sin fecha"
        : fechaObj.toISOString().split("T")[0]; // YYYY-MM-DD

    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(m);
    return acc;
  }, {});

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      {/* Lista de empleados conectados (sidebar fijo) */}
      <div className="border p-4">
        <h2 className="font-bold mb-2">Conectados</h2>

        {conectados.length === 0 && (
          <p className="text-sm text-gray-500">No hay empleados conectados.</p>
        )}

        {conectados.map((c) => (
          <div
            key={c.id}
            className={`cursor-pointer hover:bg-gray-100 p-2 flex items-center gap-3 ${
              otroId === c.id ? "bg-blue-50" : ""
            }`}
            onClick={() => setOtroId(c.id)}
          >
            <img
              src={
                c.foto
                  ? `${import.meta.env.VITE_API_URL}${c.foto}`
                  : "/no-foto.png"
              }
              className="w-10 h-10 rounded-full object-cover border"
            />

            <div className="text-sm flex-1">
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

      {/* Chat (columna derecha, no desaparece el sidebar) */}
      <div className="col-span-2 border p-4">
        {otroId ? (
          <>
            {/* Cabecera del chat */}
            <MensajesHeader otroId={otroId} conectados={conectados} />

            <div
              ref={chatRef}
              className="h-[400px] overflow-y-auto border p-2 mb-4 bg-white"
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

                    const avatarUrl = remitente?.foto
                      ? `${import.meta.env.VITE_API_URL}${remitente.foto}`
                      : "/no-foto.png";

                    const online = conectados.some(
                      (x) => x.id === m.remitente_id
                    );

                    return (
                      <MensajeBubble
                        key={m.id}
                        mensaje={m}
                        usuarioId={usuarioId}
                        avatarUrl={avatarUrl}
                        online={online}
                      />
                    );
                  })}
                </div>
              ))}

              {/* Typing animado */}
              {typing[otroId] && (
                <div className="flex items-center gap-2 text-gray-500 italic text-sm mt-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                  <span>escribiendo…</span>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!texto.trim() || !otroId) return;

                enviarMensajeWS();

                await enviarMensajeREST({
                  remitente_id: usuarioId,
                  destinatario_id: otroId,
                  contenido: texto,
                });

                setTexto("");
              }}
              className="flex gap-2"
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

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Enviar
              </button>
            </form>
          </>
        ) : (
          <p className="text-gray-600">
            Selecciona un usuario conectado en la columna izquierda para
            empezar a chatear.
          </p>
        )}
      </div>
    </div>
  );
}
