import { useEffect, useRef, useState, useMemo } from "react";
import { buildRealtimeWsUrl } from "../../api/monitorRealtime";

/**
 * MonitorRealtime — SJ‑2026 Premium
 * - WebSocket realtime
 * - Métricas glass‑UI
 * - Animación fade‑in
 */

export default function MonitorRealtime({ baseUrl }) {
  const wsRef = useRef(null);

  const [stats, setStats] = useState({
    total: 0,
    porRol: {},
    porModulo: {},
    porGrupo: {},
    porUsuario: {},
  });

  useEffect(() => {
    if (!baseUrl) return;

    const url = buildRealtimeWsUrl(baseUrl, {
      modulo: "panel-tecnico",
      grupo: "monitor-realtime",
      rol: "admin",
    });

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
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

    ws.onerror = () => {};
    ws.onmessage = () => {};

    return () => ws.close();
  }, [baseUrl]);

  const resumen = useMemo(() => stats.total, [stats.total]);

  return (
    <div
      className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        p-6 shadow-xl space-y-4 animate-fade-in
      "
    >
      <h2 className="text-xl font-semibold text-white drop-shadow">
        Monitor Realtime (WebSockets)
      </h2>

      <div className="grid grid-cols-2 gap-4 text-white">

        {/* RESUMEN */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-4 shadow-inner">
          <h3 className="font-semibold mb-2">Resumen</h3>
          <p>Total conexiones (esta vista): {resumen}</p>
        </div>

        {/* POR ROL */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-4 shadow-inner">
          <h3 className="font-semibold mb-2">Por rol</h3>
          <ul className="space-y-1">
            {Object.entries(stats.porRol).map(([rol, count]) => (
              <li key={rol}>{rol}: {count}</li>
            ))}
          </ul>
        </div>

        {/* POR MÓDULO */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-4 shadow-inner">
          <h3 className="font-semibold mb-2">Por módulo</h3>
          <ul className="space-y-1">
            {Object.entries(stats.porModulo).map(([mod, count]) => (
              <li key={mod}>{mod}: {count}</li>
            ))}
          </ul>
        </div>

        {/* POR GRUPO */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-4 shadow-inner">
          <h3 className="font-semibold mb-2">Por grupo</h3>
          <ul className="space-y-1">
            {Object.entries(stats.porGrupo).map(([grp, count]) => (
              <li key={grp}>{grp}: {count}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-sm text-white/60">
        Este monitor está basado en conexiones WebSocket reales al endpoint
        <code className="ml-1 text-white/80">/ws/realtime/</code>.
      </p>
    </div>
  );
}
