import { useEffect, useCallback, useMemo } from "react";
import { useDashboard } from "../../hooks/useDashboard";

/**
 * Dashboard — SJ‑2026 Premium
 * - KPIs glass‑UI
 * - Próximas citas premium
 * - Animaciones fade + slide
 * - Render optimizado
 */

export default function Dashboard() {
  const { data, loading, cargarDashboard } = useDashboard();

  const cargar = useCallback(() => cargarDashboard(), [cargarDashboard]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (loading || !data) {
    return (
      <div className="p-6 text-white/80 animate-pulse">
        Cargando dashboard…
      </div>
    );
  }

  const citasHoy = useMemo(() => data.proximas || [], [data.proximas]);

  return (
    <div className="p-6 space-y-10 animate-fade-in">

      {/* TITULO */}
      <div>
        <h1 className="text-3xl font-bold text-white drop-shadow">
          Dashboard corporativo
        </h1>
        <p className="text-white/70 mt-1">
          Resumen general de actividad y métricas clave
        </p>
      </div>

      {/* GRID DE KPIs PREMIUM */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">

        <CardMetric titulo="Citas hoy" valor={data.hoy} icon="calendar" color="from-blue-500 to-blue-700" />
        <CardMetric titulo="Citas semana" valor={data.semana} icon="calendar" color="from-indigo-500 to-indigo-700" />
        <CardMetric titulo="Citas mes" valor={data.mes} icon="calendar" color="from-purple-500 to-purple-700" />
        <CardMetric titulo="Firmas mes" valor={data.firmas_mes} icon="clipboard" color="from-green-500 to-green-700" />
        <CardMetric titulo="VC mes" valor={data.vc_mes} icon="video" color="from-pink-500 to-pink-700" />
        <CardMetric titulo="Presenciales mes" valor={data.presenciales_mes} icon="user-group" color="from-orange-500 to-orange-700" />

      </div>

      {/* PRÓXIMAS CITAS */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-4 drop-shadow">
          Próximas citas (hoy)
        </h2>

        <ProximasCitas citas={citasHoy} />
      </div>

    </div>
  );
}

/* TARJETA PREMIUM */
function CardMetric({ titulo, valor, icon, color }) {
  return (
    <div
      className={`
        group p-5 rounded-2xl shadow-xl border border-white/10
        bg-gradient-to-br ${color}
        text-white backdrop-blur-xl
        transition-all duration-300
        hover:scale-[1.03] hover:shadow-2xl
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80">{titulo}</p>
          <p className="text-3xl font-bold mt-1">{valor}</p>
        </div>

        <div
          className="
            w-12 h-12 flex items-center justify-center rounded-xl
            bg-white/20 backdrop-blur-md
            group-hover:bg-white/30 transition-all duration-300
          "
        >
          <svg className="w-6 h-6 text-white">
            <use href={`/icons/icons.svg#${icon}`} />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* LISTADO DE CITAS PREMIUM */
function ProximasCitas({ citas = [] }) {
  if (!citas.length) {
    return <p className="text-white/70">No hay citas próximas.</p>;
  }

  return (
    <ul className="space-y-4">
      {citas.map((c, i) => (
        <li
          key={i}
          className="
            bg-white/10 border border-white/10 rounded-xl p-4
            shadow-lg backdrop-blur-xl
            hover:bg-white/20 transition-all duration-300
          "
        >
          <div className="flex justify-between mb-1">
            <span className="font-semibold text-white">{c.tipo_firma}</span>
            <span className="text-sm text-white/70">{c.fecha}</span>
          </div>

          <p className="text-sm text-white/80">
            {c.hora_inicio} → {c.hora_fin}
          </p>

          <p className="text-sm text-white/70">
            Notario: {c.notario || "—"}
          </p>

          <p className="text-sm text-white/70">
            Apoderado: {c.apoderado || "—"}
          </p>
        </li>
      ))}
    </ul>
  );
}
