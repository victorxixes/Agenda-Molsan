import React, { useEffect } from "react";
import { connectDashboard } from "../../realtime/dashboard";
import { useRealtimeStore } from "../../store/realtimeStore";

export default function DashboardRealtime() {
  const { dashboardEventos, pushDashboard } = useRealtimeStore();

  useEffect(() => {
    const ws = connectDashboard(pushDashboard);

    return () => {
      try {
        ws.close();
      } catch (e) {
        console.warn("WS ya estaba cerrado:", e);
      }
    };
  }, []);

  // Protección total: evita el error de .map sobre undefined
  const safeEventos = Array.isArray(dashboardEventos)
    ? dashboardEventos
    : [];

  return (
    <div className="p-3 border rounded bg-white">
      <h3 className="font-semibold mb-2">Eventos del Dashboard</h3>

      <ul className="max-h-64 overflow-y-auto">
        {safeEventos.map((e, i) => (
          <li key={i} className="border-b py-1">
            <strong>{e?.tipo ?? "Evento desconocido"}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
