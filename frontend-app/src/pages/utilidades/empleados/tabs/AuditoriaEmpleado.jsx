import React, { useEffect, useState } from "react";

export default function AuditoriaEmpleado({ dni }) {
  const [logs, setLogs] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/logs/usuario/${dni}`);
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    };
    cargar();
  }, [dni]);

  if (!logs) return <p>Cargando auditoría...</p>;
  if (logs.length === 0) return <p>No hay actividad registrada.</p>;

  return (
    <div className="space-y-6 p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Actividad reciente</h2>

      <div className="border-l-2 border-neutral-300 pl-4 space-y-6">
        {logs.map((log) => (
          <div key={log.id} className="relative">
            <div className="absolute -left-3 top-1 w-2 h-2 bg-blue-600 rounded-full"></div>

            <p className="text-sm text-neutral-500">
              {new Date(log.fecha).toLocaleString()}
            </p>

            <p className="font-semibold">{log.modulo} — {log.accion}</p>
            <p className="text-neutral-700">{log.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
