import { useEffect, useCallback } from "react";
import { useDashboard } from "../../hooks/useDashboard";

import IconCalendar from "../../icons/IconCalendar.jsx";
import IconWeek from "../../icons/IconWeek.jsx";
import IconMonth from "../../icons/IconMonth.jsx";
import IconClock from "../../icons/IconClock.jsx";

export default function Dashboard() {
  const { data, loading, cargarDashboard } = useDashboard();

  const cargar = useCallback(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 drop-shadow">
        Panel de actividad
      </h1>

      {loading && <p>Cargando…</p>}

      {!loading && data && (
        <>
          
          {/* BLOQUES RESUMEN — 4 columnas alineadas */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

  {/* Próximas citas */}
  <div className="bg-blue-600/20 border border-blue-600/30 p-4 rounded-xl shadow-lg backdrop-blur-xl">
    <div className="flex items-center gap-2 mb-1">
      <IconCalendar className="w-5 h-5 text-blue-300" />
      <h3 className="text-blue-200 font-semibold">Próximas</h3>
    </div>
    <p className="text-3xl font-bold text-blue-100">
      {data.proximas.length}
    </p>
  </div>

  {/* VC realizadas */}
  <div className="bg-green-600/20 border border-green-600/30 p-4 rounded-xl shadow-lg backdrop-blur-xl">
    <div className="flex items-center gap-2 mb-1">
      <IconWeek className="w-5 h-5 text-green-300" />
      <h3 className="text-green-200 font-semibold">VC realizadas</h3>
    </div>
    <p className="text-3xl font-bold text-green-100">
      {data.realizadasVC.length}
    </p>
  </div>

  {/* Presencial realizadas */}
  <div className="bg-purple-600/20 border border-purple-600/30 p-4 rounded-xl shadow-lg backdrop-blur-xl">
    <div className="flex items-center gap-2 mb-1">
      <IconMonth className="w-5 h-5 text-purple-300" />
      <h3 className="text-purple-200 font-semibold">Presencial realizadas</h3>
    </div>
    <p className="text-3xl font-bold text-purple-100">
      {data.realizadasPresencial.length}
    </p>
  </div>

  {/* Total mes — ahora alineado */}
  <div className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-xl backdrop-blur-xl">
    <h3 className="text-xl mb-2 font-semibold text-white drop-shadow">
      Total mes
    </h3>
    <p className="text-3xl font-bold text-white">
      {data.totalMes}
    </p>
  </div>

</div>

          {/* PRÓXIMAS CITAS */}
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-xl backdrop-blur-xl">
            <h3 className="text-xl mb-4 font-semibold text-white drop-shadow">
              Próximas citas
            </h3>

            {data.proximas.length === 0 && (
              <p className="text-white/70">No hay citas próximas.</p>
            )}

            <ul className="space-y-4">
              {data.proximas.map((c, i) => (
                <li
                  key={i}
                  className="bg-white/10 border border-white/10 rounded-xl p-4 shadow-lg backdrop-blur-xl hover:bg-white/20 transition"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-white">
                      {c.tipo_firma || "—"}
                    </span>
                    <span className="text-sm text-white/70">{c.fecha}</span>
                  </div>

                  <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                    <IconClock className="w-4 h-4 text-white/60" />
                    {c.hora_inicio} → {c.hora_fin}
                  </div>

                  <p className="text-sm text-white/70">
                    <span className="font-semibold text-white/80">Notario:</span>{" "}
                    {c.notario || "—"}
                  </p>

                  <p className="text-sm text-white/70">
                    <span className="font-semibold text-white/80">Apoderado:</span>{" "}
                    {c.apoderado || "—"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
