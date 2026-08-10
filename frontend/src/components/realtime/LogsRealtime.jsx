import React, { useEffect } from "react";
import { connectLogs } from "../../realtime/logs";
import { useRealtimeStore } from "../../store/realtimeStore";

export default function LogsRealtime() {
  const { logsEventos, pushLogs } = useRealtimeStore();

  useEffect(() => {
    const ws = connectLogs(pushLogs);
    return () => ws.close();
  }, []);

  return (
    <div className="p-3 border rounded bg-white">
      <h3 className="font-semibold mb-2">Logs en tiempo real</h3>

      <ul className="max-h-64 overflow-y-auto">
        {logsEventos.map((e, i) => (
          <li key={i} className="border-b py-1">
            <strong>{e.tipo}</strong>: {JSON.stringify(e.datos)}
          </li>
        ))}
      </ul>
    </div>
  );
}
