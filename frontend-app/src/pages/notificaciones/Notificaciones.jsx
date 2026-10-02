```jsx
import { useMemo } from "react";
import { useNotificacionesStore } from "../../store/notificacionesStore";
import { useNotificacionesWS } from "../../hooks/useNotificacionesWS";

/**
 * Notificaciones — MOLSAN ERP PREMIUM 2027
 *
 * - WebSocket realtime
 * - Glass UI premium
 * - Contador de notificaciones
 * - Iconos por tipo
 * - Estado vacío premium
 * - Diseño responsive
 * - Render estable
 */

export default function Notificaciones() {
  const {
    notificaciones,
    clearNotificaciones,
  } = useNotificacionesStore();

  // ============================================================
  // WEBSOCKET REALTIME
  // ============================================================

  useNotificacionesWS();

  // ============================================================
  // LISTA ESTABLE
  // ============================================================

  const lista = useMemo(
    () => (Array.isArray(notificaciones) ? notificaciones : []),
    [notificaciones]
  );

  // ============================================================
  // ICONOS POR TIPO
  // ============================================================

  const iconosTipo = {
    error: "⛔",
    security: "🔐",
    warning: "⚠️",
    success: "✅",
    info: "ℹ️",
    noticia: "📰",
    sistema: "⚙️",
    default: "🔔",
  };

  // ============================================================
  // COLORES / ESTILOS POR TIPO
  // ============================================================

  const estilosTipo = {
    error: {
      borde: "border-red-400/30",
      fondo: "bg-red-500/10",
      icono: "bg-red-500/20 border-red-400/30",
    },

    security: {
      borde: "border-purple-400/30",
      fondo: "bg-purple-500/10",
      icono: "bg-purple-500/20 border-purple-400/30",
    },

    warning: {
      borde: "border-amber-400/30",
      fondo: "bg-amber-500/10",
      icono: "bg-amber-500/20 border-amber-400/30",
    },

    success: {
      borde: "border-emerald-400/30",
      fondo: "bg-emerald-500/10",
      icono: "bg-emerald-500/20 border-emerald-400/30",
    },

    noticia: {
      borde: "border-blue-400/30",
      fondo: "bg-blue-500/10",
      icono: "bg-blue-500/20 border-blue-400/30",
    },

    sistema: {
      borde: "border-cyan-400/30",
      fondo: "bg-cyan-500/10",
      icono: "bg-cyan-500/20 border-cyan-400/30",
    },

    info: {
      borde: "border-sky-400/30",
      fondo: "bg-sky-500/10",
      icono: "bg-sky-500/20 border-sky-400/30",
    },

    default: {
      borde: "border-white/20",
      fondo: "bg-white/5",
      icono: "bg-white/10 border-white/20",
    },
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const obtenerTipo = (tipo) => {
    if (!tipo) return "default";

    const valor = String(tipo).toLowerCase();

    return estilosTipo[valor] ? valor : "default";
  };

  const obtenerIcono = (tipo) => {
    const tipoNormalizado = obtenerTipo(tipo);

    return (
      iconosTipo[tipoNormalizado] ||
      iconosTipo.default
    );
  };

  const obtenerEstilo = (tipo) => {
    const tipoNormalizado = obtenerTipo(tipo);

    return (
      estilosTipo[tipoNormalizado] ||
      estilosTipo.default
    );
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";

    try {
      const fechaObj = new Date(fecha);

      if (Number.isNaN(fechaObj.getTime())) {
        return String(fecha);
      }

      return fechaObj.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(fecha);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="p-4 md:p-6 space-y-6 text-white animate-fade-in">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          relative overflow-hidden
          bg-white/10 backdrop-blur-xl
          border border-white/20
          rounded-3xl
          p-5 md:p-6
          shadow-2xl
        "
      >

        {/* Glow decorativo */}

        <div
          className="
            absolute -top-16 -right-16
            w-40 h-40
            bg-blue-500/10
            rounded-full
            blur-3xl
            pointer-events-none
          "
        />

        <div
          className="
            absolute -bottom-20 -left-16
            w-40 h-40
            bg-purple-500/10
            rounded-full
            blur-3xl
            pointer-events-none
          "
        />

        <div
          className="
            relative z-10
            flex flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
          "
        >

          <div>

            <div className="flex items-center gap-3">

              <div
                className="
                  w-12 h-12
                  rounded-2xl
                  bg-blue-500/15
                  border border-blue-400/20
                  flex items-center justify-center
                  text-2xl
                  shadow-lg
                "
              >
                🔔
              </div>

              <div>

                <h1
                  className="
                    text-2xl md:text-3xl
                    font-bold
                    tracking-tight
                    text-white
                    drop-shadow
                  "
                >
                  Notificaciones internas
                </h1>

                <p className="text-white/55 text-sm mt-1">
                  Actividad y avisos en tiempo real del ERP.
                </p>

              </div>

            </div>

          </div>

          <div className="flex items-center gap-3">

            {/* CONTADOR */}

            <div
              className="
                px-4 py-2
                rounded-2xl
                bg-white/5
                border border-white/10
                text-center
                min-w-[90px]
              "
            >

              <div className="text-xl font-bold text-white">
                {lista.length}
              </div>

              <div className="text-[10px] uppercase tracking-wider text-white/45">
                Avisos
              </div>

            </div>

            {/* LIMPIAR */}

            <button
              type="button"
              onClick={clearNotificaciones}
              disabled={lista.length === 0}
              className="
                px-4 py-2.5
                rounded-2xl
                bg-red-500/15
                border border-red-400/20
                text-red-100
                text-sm font-medium
                shadow-lg
                transition-all duration-200
                hover:bg-red-500/25
                hover:border-red-400/30
                hover:shadow-red-500/10
                active:scale-[0.97]
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              🗑️ Limpiar
            </button>

          </div>

        </div>

      </div>

      {/* ======================================================
          ESTADO VACÍO
      ====================================================== */}

      {lista.length === 0 ? (

        <div
          className="
            min-h-[320px]
            flex flex-col
            items-center
            justify-center
            text-center
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            rounded-3xl
            shadow-xl
            px-6
          "
        >

          <div
            className="
              w-20 h-20
              rounded-3xl
              bg-white/5
              border border-white/10
              flex items-center justify-center
              text-4xl
              shadow-lg
              mb-5
            "
          >
            🔕
          </div>

          <h2 className="text-lg font-semibold text-white">
            No hay notificaciones
          </h2>

          <p className="text-sm text-white/50 mt-2 max-w-md">
            Cuando se produzca una nueva actividad o evento del sistema,
            aparecerá automáticamente aquí.
          </p>

          <div
            className="
              mt-5
              inline-flex items-center gap-2
              px-3 py-1.5
              rounded-full
              bg-emerald-500/10
              border border-emerald-400/20
              text-emerald-200
              text-xs
            "
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Conexión en tiempo real activa
          </div>

        </div>

      ) : (

        /* ====================================================
           LISTA
        ==================================================== */

        <div className="space-y-4">

          {lista.map((n, index) => {

            const tipo = obtenerTipo(n.tipo);
            const estilo = obtenerEstilo(n.tipo);
            const icono = obtenerIcono(n.tipo);

            return (
              <div
                key={n.id ?? `notificacion-${index}`}
                className={`
                  group
                  relative overflow-hidden
                  rounded-3xl
                  border
                  ${estilo.borde}
                  ${estilo.fondo}
                  backdrop-blur-xl
                  p-4 md:p-5
                  shadow-xl
                  transition-all duration-300
                  hover:bg-white/[0.08]
                  hover:-translate-y-[1px]
                  hover:shadow-2xl
                  animate-fade-in
                `}
              >

                {/* Línea lateral */}

                <div
                  className="
                    absolute left-0 top-4 bottom-4
                    w-[3px]
                    rounded-r-full
                    bg-white/20
                    group-hover:bg-white/40
                    transition
                  "
                />

                <div className="flex gap-4">

                  {/* ICONO */}

                  <div
                    className={`
                      flex-shrink-0
                      w-12 h-12
                      rounded-2xl
                      ${estilo.icono}
                      border
                      flex items-center justify-center
                      text-xl
                      shadow-lg
                    `}
                  >
                    {icono}
                  </div>

                  {/* CONTENIDO */}

                  <div className="flex-1 min-w-0">

                    <div
                      className="
                        flex flex-col
                        md:flex-row
                        md:items-start
                        md:justify-between
                        gap-2
                      "
                    >

                      <div className="min-w-0">

                        <h2
                          className="
                            text-base md:text-lg
                            font-semibold
                            text-white
                            drop-shadow
                            break-words
                          "
                        >
                          {n.titulo || "Notificación"}
                        </h2>

                      </div>

                      <span
                        className="
                          flex-shrink-0
                          text-xs
                          text-white/45
                          whitespace-nowrap
                        "
                      >
                        {formatearFecha(n.fecha)}
                      </span>

                    </div>

                    {/* DESCRIPCIÓN */}

                    {n.descripcion && (
                      <p
                        className="
                          mt-2
                          text-sm
                          leading-relaxed
                          text-white/70
                          break-words
                        "
                      >
                        {n.descripcion}
                      </p>
                    )}

                    {/* FOOTER */}

                    <div className="flex flex-wrap items-center gap-2 mt-4">

                      <span
                        className="
                          inline-flex items-center gap-1.5
                          px-2.5 py-1
                          rounded-xl
                          bg-white/5
                          border border-white/10
                          text-[11px]
                          text-white/55
                        "
                      >
                        <span className="text-[10px]">
                          🏷️
                        </span>

                        {n.tipo || "general"}
                      </span>

                      <span
                        className="
                          inline-flex items-center gap-1.5
                          px-2.5 py-1
                          rounded-xl
                          bg-emerald-500/5
                          border border-emerald-400/10
                          text-[11px]
                          text-emerald-200/70
                        "
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Tiempo real
                      </span>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
}
```

Este ya queda bastante más integrado con el estilo **Premium 2027** que estamos aplicando al resto de módulos. Además, el botón **Limpiar** queda desactivado visualmente cuando no hay nada que limpiar y el estado vacío deja claro que el WebSocket sigue activo.
