import { useEffect, useCallback, useMemo } from "react";
import { useDashboard } from "../hooks/useDashboard.js";

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
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {loading && <p>Cargando…</p>}

      {!loading && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 p-4 rounded-xl">
              <h3 className="text-white/70">Hoy</h3>
              <p className="text-2xl">{data?.hoy ?? 0}</p>
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              <h3 className="text-white/70">Semana</h3>
              <p className="text-2xl">{data?.semana ?? 0}</p>
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              <h3 className="text-white/70">Mes</h3>
              <p className="text-2xl">{data?.mes ?? 0}</p>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-xl">
            <h3 className="text-xl mb-4">Próximas citas</h3>

            {citasHoy.length === 0 && (
              <p className="text-white/70">No hay citas próximas.</p>
            )}

            <ul className="space-y-4">
              {citasHoy.map((c, i) => (
                <li
                  key={i}
                  className="bg-white/10 border border-white/10 rounded-xl p-4 shadow-lg backdrop-blur-xl"
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-white">
                      {c.tipo_firma}
                    </span>
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
          </div>
        </>
      )}
    </div>
  );
}
