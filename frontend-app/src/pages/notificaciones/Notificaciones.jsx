import { useMemo } from "react";
import { useNotificacionesStore } from "../../store/notificacionesStore";
import { useNotificacionesWS } from "../../hooks/useNotificacionesWS";

/**
 * Notificaciones — SJ‑2026 Premium
 * - WS realtime
 * - Glass‑UI
 * - Lista optimizada
 * - Render estable
 */

export default function Notificaciones() {
  const { notificaciones, clearNotificaciones } = useNotificacionesStore();

  // WebSocket realtime
  useNotificacionesWS();

  // Evita recalcular en cada render
  const lista = useMemo(() => notificaciones, [notificaciones]);

  return (
    <div className="p-6 space-y-6 text-white">

      {/* HEADER PREMIUM */}
      <div
        className="
          flex items-center justify-between
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          p-4 shadow-xl
        "
      >
        <h1 className="text-3xl font-bold drop-shadow">
          Notificaciones internas
        </h1>

        <button
          className="
            px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700
            text-white shadow-lg transition active:scale-[0.97]
          "
          onClick={clearNotificaciones}
        >
          Limpiar
        </button>
      </div>

      {/* LISTA PREMIUM */}
      {lista.length === 0 ? (
        <p className="text-white/70 text-sm">
          No hay notificaciones.
        </p>
      ) : (
        <ul className="space-y-4">
          {lista.map((n) => (
            <li
              key={n.id}
              className="
                bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
                p-4 shadow-xl flex flex-col space-y-2 animate-fadeIn
              "
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg text-white drop-shadow">
                  {n.titulo}
                </span>

                <span className="text-xs text-white/60">
                  {new Date(n.fecha).toLocaleString()}
                </span>
              </div>

              {n.descripcion && (
                <p className="text-white/80 text-sm">{n.descripcion}</p>
              )}

              <span
                className="
                  text-xs text-white/60 mt-1
                  bg-white/5 border border-white/10 px-2 py-1 rounded-xl w-fit
                "
              >
                Tipo: {n.tipo}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
