import { useEffect } from "react";
import { useDashboardExtendido } from "../../hooks/useDashboardExtendido";

export default function DashboardExtendido() {
  const { data, loading, cargarDashboardExtendido } = useDashboardExtendido();

  useEffect(() => {
    cargarDashboardExtendido();
  }, []);

  if (loading || !data) {
    return <p className="p-6">Cargando dashboard extendido…</p>;
  }

  const { agenda, ctn, apoderados } = data;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard extendido</h1>

      {/* Agenda hoy */}
      <div className="grid grid-cols-3 gap-4">
        <KPI titulo="Presencial hoy" valor={agenda.presencial_hoy} />
        <KPI titulo="VC hoy" valor={agenda.vc_hoy} />
        <KPI titulo="Total km apoderados" valor={apoderados.km_total} />
      </div>

      {/* CTN resumen */}
      <section>
        <h2 className="text-xl font-semibold mb-2">CTN — Resumen</h2>
        <div className="grid grid-cols-2 gap-4">
          <KPI titulo="Presencial total" valor={ctn.presencial_total} />
          <KPI titulo="VC total" valor={ctn.vc_total} />
        </div>
      </section>

      {/* Próximas citas */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Próximas citas</h2>
        <ProximasCitas citas={agenda.proximas} />
      </section>

      {/* Ranking apoderados */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Ranking apoderados</h2>
        <RankingApoderados ranking={apoderados.ranking} />
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
  if (!citas.length) return <p>No hay próximas citas.</p>;

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

function RankingApoderados({ ranking }) {
  if (!ranking.length) return <p>No hay datos de apoderados.</p>;

  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th>Apoderado</th>
          <th>Firmas presencial</th>
          <th>KM total</th>
        </tr>
      </thead>
      <tbody>
        {ranking.map((r) => (
          <tr key={r.apoderado_id} className="border-b">
            <td>{r.nombre}</td>
            <td>{r.firmas_presencial}</td>
            <td>{r.km_total.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
