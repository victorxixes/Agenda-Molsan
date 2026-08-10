import React, { useEffect } from "react";
import { connectNotificaciones } from "../../realtime/notificaciones";
import { useRealtimeStore } from "../../store/realtimeStore";
import { useAuthStore } from "../../store/authStore";

export default function NotificacionesRealtime() {
  const { user } = useAuthStore();
  const { notificaciones, pushNotificacion } = useRealtimeStore();

  useEffect(() => {
    if (!user) return;
    const ws = connectNotificaciones(user.id, pushNotificacion);
    return () => ws.close();
  }, [user]);

  return (
    <div className="p-3 border rounded bg-white">
      <h3 className="font-semibold mb-2">Notificaciones</h3>

      <ul className="max-h-64 overflow-y-auto">
        {notificaciones.map((n, i) => (
          <li key={i} className="border-b py-1">
            <strong>{n.tipo}</strong>: {n.mensaje}
          </li>
        ))}
      </ul>
    </div>
  );
}
