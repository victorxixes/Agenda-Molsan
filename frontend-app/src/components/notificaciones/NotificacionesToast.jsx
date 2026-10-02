import { useEffect } from "react";
import { useNotificacionesStore } from "../../store/notificacionesStore";

export default function NotificacionesToast() {
  const notificaciones = useNotificacionesStore(
    (s) => s.notificaciones
  );

  useEffect(() => {
    if (notificaciones.length === 0) return;

    const audio = new Audio("/sonido-notificacion.mp3");
    audio.volume = 0.4;

    audio.play().catch(() => {});
  }, [notificaciones]);

  return (
    <div
      className="
        fixed
        bottom-5
        right-5
        space-y-3
        z-[9999]
        w-[min(380px,calc(100vw-2rem))]
      "
    >
      {notificaciones.slice(0, 3).map((n) => (
        <Toast
          key={n.id}
          notificacion={n}
        />
      ))}
    </div>
  );
}

function Toast({ notificacion: n }) {
  const configuracion = obtenerConfiguracion(n.tipo);

  return (
    <div
      className="
        relative
        overflow-hidden
        bg-slate-900/85
        backdrop-blur-2xl
        border border-white/15
        shadow-2xl
        rounded-2xl
        p-4
        text-white
        animate-fade-in
      "
    >

      {/* Línea lateral */}
      <div
        className={`
          absolute
          left-0
          top-0
          bottom-0
          w-1
          ${configuracion.color}
        `}
      />

      <div className="flex items-start gap-3">

        {/* ICONO */}
        <div
          className="
            w-10 h-10
            shrink-0
            rounded-xl
            bg-white/10
            border border-white/10
            flex items-center justify-center
            text-lg
          "
        >
          {configuracion.icono}
        </div>

        {/* CONTENIDO */}
        <div className="min-w-0 flex-1">

          <div className="flex items-center justify-between gap-3">

            <div className="font-semibold text-sm">
              {configuracion.titulo}
            </div>

            <div className="text-[10px] text-white/35 whitespace-nowrap">
              Ahora
            </div>

          </div>

          <div className="text-sm text-white/65 mt-1 break-words">
            {n.preview || n.archivo_url || ""}
          </div>

          {n.tipo && (
            <div
              className="
                inline-flex
                mt-2
                px-2 py-1
                rounded-lg
                bg-white/5
                border border-white/10
                text-[10px]
                text-white/35
              "
            >
              {n.tipo}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function obtenerConfiguracion(tipo) {
  switch (tipo) {
    case "nuevo_mensaje":
      return {
        icono: "💬",
        titulo: "Nuevo mensaje",
        color: "bg-blue-400",
      };

    case "nuevo_archivo":
      return {
        icono: "📎",
        titulo: "Nuevo archivo",
        color: "bg-purple-400",
      };

    case "online":
      return {
        icono: "🟢",
        titulo: "Usuario conectado",
        color: "bg-emerald-400",
      };

    case "offline":
      return {
        icono: "⚫",
        titulo: "Usuario desconectado",
        color: "bg-slate-400",
      };

    case "error":
      return {
        icono: "⛔",
        titulo: "Error",
        color: "bg-red-400",
      };

    case "warning":
      return {
        icono: "⚠️",
        titulo: "Advertencia",
        color: "bg-yellow-400",
      };

    default:
      return {
        icono: "🔔",
        titulo: "Nueva notificación",
        color: "bg-blue-400",
      };
  }
}
