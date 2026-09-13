import { useEffect } from "react";
import { useAgendaStore } from "../../store/agendaStore";

export default function AgendaToast() {
  const notificaciones = useAgendaStore((s) => s.notificaciones);
  const limpiarResaltada = useAgendaStore((s) => s.limpiarResaltada);

  // Auto-limpieza del resaltado después de 3s
  useEffect(() => {
    if (notificaciones.length === 0) return;

    const timer = setTimeout(() => {
      limpiarResaltada();
    }, 3000);

    return () => clearTimeout(timer);
  }, [notificaciones]);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 pointer-events-none">
      {notificaciones.map((n) => (
        <div
          key={n.id}
          className="
            bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg text-sm
            animate-fade-in pointer-events-auto
          "
        >
          {n.msg}
        </div>
      ))}
    </div>
  );
}
