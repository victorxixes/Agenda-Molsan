import { useEffect, useRef, useState } from "react";
import { buildRealtimeWsUrl } from "../../api/monitorRealtime";

export default function MonitorRealtime({ baseUrl }) {
  const wsRef = useRef(null);

  const [stats, setStats] = useState({
    total: 0,
    porRol: {},
    porModulo: {},
    porGrupo: {},
    porUsuario: {},
  });

  // Simulamos conexiones locales: cada pestaña que abre este panel
  // se considera una conexión "técnica" al monitor.
  useEffect(() => {
    const url = buildRealtimeWsUrl(baseUrl, {
      modulo: "panel-tecnico",
      grupo: "monitor-realtime",
      rol: "admin",
    });

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      // Cada conexión que abre este panel cuenta como 1.
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        porModulo: {
          ...prev.porModulo,
          "panel-tecnico": (prev.porModulo["panel-tecnico"] || 0) + 1,
        },
        porGrupo: {
          ...prev.porGrupo,
          "monitor-realtime": (prev.porGrupo["monitor-realtime"] || 0) + 1,
        },
        porRol: {
          ...prev.porRol,
          admin: (prev.porRol.admin || 0) + 1,
        },
      }));
    };

    ws.onclose = () => {
      setStats((prev) => ({
        ...prev,
        total: Math.max(prev.total - 1, 0),
      }));
    };

    ws.onerror = () => {
      // Podríamos marcar error de conexión si quieres
    };

    // De momento no procesamos mensajes, porque tu backend
    // no envía eventos al cliente todavía.
    ws.onmessage = () => {};

    return () => {
      ws.close();
    };
  }, [baseUrl]);

  return (
    <div className="p-4 border rounded bg-white shadow space-y-4">
      <h2 className="text-xl font-semibold">Monitor Realtime (WebSockets)</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded p-3">
          <h3 className="font-semibold mb-2">Resumen</h3>
          <p>Total conexiones (esta vista): {stats.total}</p>
        </div>

        <div className="border rounded p-3">
          <h3 className="font-semibold mb-2">Por rol</h3>
          <ul>
            {Object.entries(stats.porRol).map(([rol, count]) => (
              <li key={rol}>
                {rol}: {count}
              </li>
            ))}
          </ul>
        </div>

        <div className="border rounded p-3">
          <h3 className="font-semibold mb-2">Por módulo</h3>
          <ul>
            {Object.entries(stats.porModulo).map(([mod, count]) => (
              <li key={mod}>
                {mod}: {count}
              </li>
            ))}
          </ul>
        </div>

        <div className="border rounded p-3">
          <h3 className="font-semibold mb-2">Por grupo</h3>
          <ul>
            {Object.entries(stats.porGrupo).map(([grp, count]) => (
              <li key={grp}>
                {grp}: {count}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Este monitor está basado en las conexiones WebSocket reales al endpoint
        <code className="ml-1">/ws/realtime/</code>. Cuando el backend empiece a
        emitir eventos <code>RealtimeEvent</code>, aquí podremos mostrar mucho
        más detalle (usuarios activos, módulos activos, etc.).
      </p>
    </div>
  );
}
