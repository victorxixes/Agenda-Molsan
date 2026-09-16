import { useNotificacionesStore } from "../../store/notificacionesStore";

export default function NotificacionesBadge() {
  const notificaciones = useNotificacionesStore((s) => s.notificaciones);
  const count = notificaciones.length;

  return (
    <div className="relative inline-flex items-center">
      <span className="material-icons text-white/80 drop-shadow">
        notifications
      </span>

      {count > 0 && (
        <span
          className="
            absolute -top-1 -right-1 bg-red-600 text-white text-xs
            px-1.5 py-0.5 rounded-full shadow-lg backdrop-blur-md
            border border-white/20
          "
        >
          {count}
        </span>
      )}
    </div>
  );
}
