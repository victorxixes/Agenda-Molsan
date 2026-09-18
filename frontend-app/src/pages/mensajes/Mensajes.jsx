import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useMensajesStore } from "../../store/mensajesStore";
import { useMensajesWS } from "../../hooks/useMensajesWS";
import MensajeBubble from "../../components/mensajes/MensajeBubble";
import MensajesHeader from "../../components/mensajes/MensajesHeader";

/**
 * Mensajes — SJ‑2026 Premium
 * - WS realtime
 * - Glass‑UI
 * - Scroll premium
 * - Funciones estabilizadas
 */

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

  // 🔥 FILTRAR TU PROPIO USUARIO
  const conectadosFiltrados = useMemo(
    () => conectados.filter((c) => c.id !== usuarioId),
    [conectados, usuarioId]
  );

  // Cargar conversación al seleccionar usuario
  useEffect(() => {
    if (otroId) cargarConversacion(usuarioId, otroId);
  }, [otroId, usuarioId, cargarConversacion]);

  // Scroll automático al final
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [mensajes]);

  const enviarMensajeWS = useCallback(() => {
    if (!otroId || !texto.trim()) return;

    wsRef.current?.send(
      JSON.stringify({
        tipo: "mensaje",
        destinatario_id: otroId,
        contenido: texto,
      })
    );
  }, [otroId, texto, wsRef]);

  const enviarTypingWS = useCallback(() => {
    if (!otroId) return;

    wsRef.current?.send(
      JSON.stringify({
        tipo: "typing",
        destinatario_id: otroId,
      })
    );
  }, [otroId, wsRef]);

  const handleAdjunto = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file || !otroId) return;

      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/mensajes/upload`,
          {
            method: "POST",
            body: fd,
          }
        );

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
    },
    [otroId, usuarioId, enviarMensajeREST, wsRef]
  );

  const mensajesAgrupados = useMemo(
    () =>
      mensajes.reduce((acc, m) => {
        const fechaObj = new Date(m.fecha);
        const fecha = isNaN(fechaObj.getTime())
          ? "Sin fecha"
          : fechaObj.toISOString().split("T")[0];

        if (!acc[fecha]) acc[fecha] = [];
        acc[fecha].push(m);
        return acc;
      }, {}),
    [mensajes]
  );

  return (
    <div className="p-6 grid grid-cols-3 gap-4 text-white">

      {/* LISTA DE CONECTADOS */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          p-4 shadow-xl animate-fadeIn
        "
      >
        <h2 className="font-semibold text-lg mb-3 drop-shadow">Conectados</h2>

        {conectadosFiltrados.length === 0 && (
          <p className="text-sm text-white/60">
            No hay empleados conectados.
          </p>
        )}

        <div className="space-y-2">
          {conectadosFiltrados.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`
                w-full text-left cursor-pointer p-3 rounded-xl flex items-center gap-3
                transition-all duration-200
                ${
                  otroId === c.id
                    ? "bg-blue-600/30 border border-blue-500/40 shadow-lg"
                    : "bg-white/5 hover:bg-white/10 border border-white/10"
                }
              `}
              onClick={() => setOtroId(c.id)}
            >
              <img
                src={
                  c.foto
                    ? `${import.meta.env.VITE_API_URL}${c.foto}`
                    : "/no-foto.png"
                }
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />

              <div className="flex-1">
                <div className="font-semibold text-white">
                  {c.nombre} {c.apellidos}
                </div>
                <div className="text-xs text-white/60">ID: {c.id}</div>
              </div>

              <span className="w-3 h-3 rounded-full bg-green-500 border border-white" />
            </button>
          ))}
        </div>
      </div>

      {/* CHAT */}
      <div
        className="
          col-span-2 bg-white/10 backdrop-blur-xl border border-white/20
          rounded-2xl p-4 shadow-xl animate-fadeIn
        "
      >
        {otroId ? (
          <>
            <MensajesHeader otroId={otroId} conectados={conectadosFiltrados} />

            <div
              ref={chatRef}
              className="
                h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
                border border-white/10 rounded-xl
                p-4 mb-4 bg-white/5 backdrop-blur-md shadow-inner
              "
            >
              {Object.keys(mensajesAgrupados).map((fecha) => (
                <div key={fecha}>
                  <div className="text-center text-white/60 text-sm my-2">
                    {fecha}
                  </div>

                  {mensajesAgrupados[fecha].map((m) => {
                    const remitente = conectadosFiltrados.find(
                      (x) => x.id === m.remitente_id
                    );

                    const avatarUrl = remitente?.foto
                      ? `${import.meta.env.VITE_API_URL}${remitente.foto}`
                      : "/no-foto.png";

                    const online = conectadosFiltrados.some(
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
                <div className="flex items-center gap-2 text-white/70 italic text-sm mt-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-150" />
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-300" />
                  </div>
                  <span>escribiendo…</span>
                </div>
              )}
            </div>

            {/* INPUT DE MENSAJE */}
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
              className="flex gap-3"
            >
              <input
                value={texto}
                onChange={(e) => {
                  setTexto(e.target.value);
                  enviarTypingWS();
                }}
                className="
                  flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                placeholder="Escribe un mensaje…"
              />

              <label
                className="
                  bg-white/10 border border-white/20 rounded-xl px-4 py-2
                  cursor-pointer text-white shadow hover:bg-white/20 transition
                  flex items-center active:scale-[0.97]
                "
              >
                📎
                <input
                  type="file"
                  className="hidden"
                  onChange={handleAdjunto}
                />
              </label>

              <button
                type="submit"
                className="
                  bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl
                  shadow-lg transition active:scale-[0.97]
                "
              >
                Enviar
              </button>
            </form>
          </>
        ) : (
          <p className="text-white/70">
            Selecciona un usuario conectado en la columna izquierda para empezar
            a chatear.
          </p>
        )}
      </div>
    </div>
  );
}
