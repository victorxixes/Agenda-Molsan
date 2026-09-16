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

  useEffect(() => {
    if (otroId) cargarConversacion(usuarioId, otroId);
  }, [otroId, usuarioId]);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight });
  }, [mensajes]);

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

  const enviarTypingWS = () => {
    if (!otroId) return;

    wsRef.current?.send(
      JSON.stringify({
        tipo: "typing",
        destinatario_id: otroId,
      })
    );
  };

  const handleAdjunto = async (e) => {
    const file = e.target.files[0];
    if (!file || !otroId) return;

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/mensajes/upload`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (data.status !== "ok") return;

      const archivo_url = data.archivo_url;

      wsRef.current?.send(
        JSON.stringify({
          tipo: "archivo",
          destinatario_id: otroId,
          archivo_url,
        })
      );

      await enviarMensajeREST({
        remitente_id: usuarioId,
        destinatario_id: otroId,
        contenido: null,
        archivo_url,
      });

    } catch (err) {
      console.error("Error adjunto:", err);
    }
  };

  const mensajesAgrupados = mensajes.reduce((acc, m) => {
    const fechaObj = new Date(m.fecha);
    const fecha = isNaN(fechaObj.getTime())
      ? "Sin fecha"
      : fechaObj.toISOString().split("T")[0];

    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(m);
    return acc;
  }, {});

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
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

            <span className="w-3 h-3 rounded-full bg.green-500"></span>
          </div>
        ))}
      </div>

      <div className="col-span-2 border p-4">
        {otroId ? (
          <>
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

              <label className="bg-gray-200 px-3 py-2 rounded cursor-pointer text-sm flex items-center">
                📎
                <input
                  type="file"
                  className="hidden"
                  onChange={handleAdjunto}
                />
              </label>

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
            Selecciona un usuario conectado en la columna izquierda para empezar a chatear.
          </p>
        )}
      </div>
    </div>
  );
}
