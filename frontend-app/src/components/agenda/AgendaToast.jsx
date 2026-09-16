import { useEffect, useMemo } from "react";
import { useAgendaStore } from "../../store/agendaStore";

/**
 * AgendaToast — SJ‑2026 Premium
 * Notificaciones flotantes para eventos de agenda.
 * - Auto‑desvanecen el resaltado en 3s
 * - Animación glass‑UI
 * - Sin re‑renders innecesarios
 */

export default function AgendaToast() {
  const notificaciones = useAgendaStore((s) => s.notificaciones);
  const limpiarResaltada = useAgendaStore((s) => s.limpiarResaltada);

  // Memo para evitar recalcular en cada render
  const hasNotificaciones = useMemo(
    () => notificaciones.length > 0,
    [notificaciones]
  );

  // Auto-limpieza del resaltado después de 3s
  useEffect(() => {
    if (!hasNotificaciones) return;

    const timer = setTimeout(() => {
      limpiarResaltada();
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasNotificaciones, limpiarResaltada]);

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
          style={{ animationFillMode: "both" }}
        >
          {n.msg}
        </div>
      ))}
    </div>
  );
}
