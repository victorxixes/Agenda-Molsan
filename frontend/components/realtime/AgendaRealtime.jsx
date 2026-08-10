import React, { useEffect } from "react";
import { connectAgenda } from "../../realtime/agenda";
import { useRealtimeStore } from "../../store/realtimeStore";

export default function AgendaRealtime() {
  const { agendaEventos, pushAgenda } = useRealtimeStore();

  useEffect(() => {
    const ws = connectAgenda(pushAgenda);
    return () => ws.close();
  }, []);

  return (
    <div className="p-3 border rounded bg-white">
      <h3 className="font-semibold mb-2">Eventos de Agenda</h3>

      <ul className="max-h-64 overflow-y-auto">
        {agendaEventos.map((e, i) => (
          <li key={i} className="border-b py-1">
            <strong>{e.tipo}</strong> — Cita #{e.cita_id}
          </li>
        ))}
      </ul>
    </div>
  );
}
