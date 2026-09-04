import { useEffect, useState } from "react";
import { getAuditoria, getAuditoriaMetricas } from "../../api/auditoria";

export default function AuditoriaAvanzada() {
  const [registros, setRegistros] = useState([]);
  const [metricas, setMetricas] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    getAuditoria().then((res) => setRegistros(res.data));
    getAuditoriaMetricas().then((res) => setMetricas(res.data));
  }, []);

  const filtrados = registros.filter((r) =>
    JSON.stringify(r).toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Auditoría Avanzada</h1>

      {/* MÉTRICAS */}
      {metricas && (
        <section className="border p-4 rounded bg-white shadow">
          <h2 className="text-xl font-semibold mb-3">Métricas</h2>

          <p>Total registros: {metricas.total_registros}</p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-semibold mb-2">Por módulo</h3>
              <ul>
                {metricas.por_modulo.map((m, i) => (
                  <li key={i}>
                    {m.modulo}: {m.cantidad}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Por acción</h3>
              <ul>
                {metricas.por_accion.map((a, i) => (
                  <li key={i}>
                    {a.accion}: {a.cantidad}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Últimos logins</h3>
            <ul>
              {metricas.ultimos_logins.map((l, i) => (
                <li key={i}>
                  {l.usuario} — {l.fecha}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar en auditoría..."
        className="border p-2 rounded w-full"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* TABLA PRINCIPAL */}
      <section className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Últimos registros</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Módulo</th>
              <th>Acción</th>
              <th>Descripción</th>
              <th>IP</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((r) => (
              <tr key={r.id} className="border-b">
                <td>{r.fecha}</td>
                <td>{r.usuario}</td>
                <td>{r.modulo}</td>
                <td>{r.accion}</td>
                <td>{r.descripcion}</td>
                <td>{r.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
