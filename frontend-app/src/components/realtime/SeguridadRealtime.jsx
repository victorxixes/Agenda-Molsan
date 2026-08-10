import React, { useEffect } from "react";
import { connectSeguridad } from "../../realtime/seguridad";
import { useRealtimeStore } from "../../store/realtimeStore";

export default function SeguridadRealtime() {
  const { seguridadEventos, pushSeguridad } = useRealtimeStore();

  useEffect(() => {
    const ws = connectSeguridad(pushSeguridad);
    return () => ws.close();
  }, []);

  return (
    <div className="p-3 border rounded bg-white">
      <h3 className="font-semibold mb-2">Eventos de Seguridad</h3>

      <ul className="max-h-64 overflow-y-auto">
        {seguridadEventos.map((e, i) => (
          <li key={i} className="border-b py-1">
            <strong>{e.tipo}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
