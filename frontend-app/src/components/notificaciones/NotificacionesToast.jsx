import { useEffect } from "react";
import { useNotificacionesStore } from "../../store/notificacionesStore";

export default function NotificacionesToast() {
  const notificaciones = useNotificacionesStore((s) => s.notificaciones);

  useEffect(() => {
    if (notificaciones.length === 0) return;

    const audio = new Audio("/sonido-notificacion.mp3");
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }, [notificaciones]);

  return (
    <div className="fixed bottom-4 right-4 space-y-3 z-50">
      {notificaciones.slice(0, 3).map((n) => (
        <div
          key={n.id}
          className="
            bg-white/90 backdrop-blur-xl shadow-xl border border-gray-300
            px-4 py-3 rounded-xl w-64 animate-fadeIn
          "
        >
          <div className="font-semibold text-gray-800">
            {n.tipo === "nuevo_mensaje" && "Nuevo mensaje"}
            {n.tipo === "nuevo_archivo" && "Nuevo archivo"}
            {n.tipo === "online" && "Usuario conectado"}
            {n.tipo === "offline" && "Usuario desconectado"}
          </div>

          <div className="text-gray-600 text-sm mt-1">
            {n.preview || n.archivo_url || ""}
          </div>
        </div>
      ))}
    </div>
  );
}
