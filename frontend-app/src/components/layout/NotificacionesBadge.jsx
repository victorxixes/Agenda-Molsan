import { useNotificacionesStore } from "../../store/notificacionesStore";

export default function NotificacionesBadge() {
  const notificaciones = useNotificacionesStore((s) => s.notificaciones);
  const count = notificaciones.length;

  return (
    <div className="relative inline-flex items-center">
      <span className="material-icons text-gray-700">notifications</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}
