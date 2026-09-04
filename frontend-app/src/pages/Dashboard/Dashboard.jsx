import { useEffect } from "react";
import { useDashboard } from "../../hooks/useDashboard";

export default function Dashboard() {
  const { data, loading, cargarDashboard } = useDashboard();

  useEffect(() => {
    cargarDashboard();
  }, []);

  if (loading || !data) {
    return <p className="p-6">Cargando dashboard…</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KPI titulo="Citas hoy" valor={data.hoy} />
        <KPI titulo="Citas semana" valor={data.semana} />
        <KPI titulo="Citas mes" valor={data.mes} />
        <KPI titulo="Firmas mes" valor={data.firmas_mes} />
        <KPI titulo="VC mes" valor={data.vc_mes} />
        <KPI titulo="Presenciales mes" valor={data.presenciales_mes} />
      </div>

      {/* Próximas citas */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Próximas citas (hoy)</h2>
        <ProximasCitas citas={data.proximas} />
      </section>
    </div>
  );
}

function KPI({ titulo, valor }) {
  return (
    <div className="border rounded p-4 bg-white shadow">
      <p className="text-gray-600">{titulo}</p>
      <p className="text-2xl font-bold">{valor}</p>
    </div>
  );
}

function ProximasCitas({ citas }) {
  if (!citas.length) return <p>No hay citas próximas.</p>;

  return (
    <ul className="space-y-2">
      {citas.map((c, i) => (
        <li key={i} className="border p-3 rounded bg-white shadow-sm">
          <div className="flex justify-between">
            <span className="font-semibold">{c.tipo_firma}</span>
            <span className="text-sm text-gray-500">{c.fecha}</span>
          </div>
          <p className="text-sm">
            {c.hora_inicio} → {c.hora_fin}
          </p>
          <p className="text-sm text-gray-700">
            Notario: {c.notario || "—"}
          </p>
          <p className="text-sm text-gray-700">
            Apoderado: {c.apoderado || "—"}
          </p>
        </li>
      ))}
    </ul>
  );
}

