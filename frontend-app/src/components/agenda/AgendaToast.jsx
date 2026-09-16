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
    <div className="fixed bottom-6 right-6 space-y-3 z-50 pointer-events-none">
      {notificaciones.map((n) => (
        <div
          key={n.id}
          className="
            pointer-events-auto px-4 py-3 rounded-xl shadow-2xl text-sm
            bg-white/10 backdrop-blur-xl border border-white/20 text-white
            animate-[fadeIn_0.3s_ease,slideUp_0.3s_ease]
          "
          style={{
            animationFillMode: "both",
          }}
        >
          {n.msg}
        </div>
      ))}
    </div>
  );
}
