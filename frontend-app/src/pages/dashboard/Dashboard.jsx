import { useEffect, useCallback, useMemo } from "react";
import { useDashboard } from "../../hooks/useDashboard";

// Iconos locales (si usas tu sistema de SVGs)
import IconCalendar from "../../icons/IconCalendar";
import IconWeek from "../../icons/IconWeek";
import IconMonth from "../../icons/IconMonth";
import IconClock from "../../icons/IconClock";

export default function Dashboard() {
  const { data, loading, cargarDashboard } = useDashboard();

  const cargar = useCallback(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const citasHoy = useMemo(() => {
    const p = data?.proximas;
    if (!Array.isArray(p)) return [];

    return p.filter(
      (c) =>
        c &&
        typeof c === "object" &&
        typeof c.tipo_firma === "string"
    );
  }, [data?.proximas]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 drop-shadow">
        Panel de actividad
      </h1>

      {loading && <p>Cargando…</p>}

      {!loading && (
        <>
          {/* BLOQUES RESUMEN */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Hoy */}
            <div className="bg-blue-600/20 border border-blue-600/30 p-4 rounded-xl shadow-lg backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-1">
                <IconCalendar className="w-5 h-5 text-blue-300" />
                <h3 className="text-blue-200 font-semibold">Hoy</h3>
              </div>
              <p className="text-3xl font-bold text-blue-100">
                {data?.hoy ?? 0}
              </p>
            </div>

            {/* Semana */}
            <div className="bg-green-600/20 border border-green-600/30 p-4 rounded-xl shadow-lg backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-1">
                <IconWeek className="w-5 h-5 text-green-300" />
                <h3 className="text-green-200 font-semibold">Semana</h3>
              </div>
              <p className="text-3xl font-bold text-green-100">
                {data?.semana ?? 0}
              </p>
            </div>

            {/* Mes */}
            <div className="bg-purple-600/20 border border-purple-600/30 p-4 rounded-xl shadow-lg backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-1">
                <IconMonth className="w-5 h-5 text-purple-300" />
                <h3 className="text-purple-200 font-semibold">Mes</h3>
              </div>
              <p className="text-3xl font-bold text-purple-100">
                {data?.mes ?? 0}
              </p>
            </div>
          </div>

          {/* PRÓXIMAS CITAS */}
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-xl backdrop-blur-xl">
            <h3 className="text-xl mb-4 font-semibold text-white drop-shadow">
              Próximas citas
            </h3>

            {citasHoy.length === 0 && (
              <p className="text-white/70">No hay citas próximas.</p>
            )}

            <ul className="space-y-4">
              {citasHoy.map((c, i) => (
                <li
                  key={i}
                  className="bg-white/10 border border-white/10 rounded-xl p-4 shadow-lg backdrop-blur-xl hover:bg-white/20 transition"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-white">
                      {c.tipo_firma}
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
