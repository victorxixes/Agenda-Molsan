import { useEffect, useState, useMemo, useCallback } from "react";
import { getAuditoria, getAuditoriaMetricas } from "../../api/auditoria";

/**
 * Auditoría Avanzada — SJ‑2026 Premium
 * - Métricas glass‑UI
 * - Buscador optimizado
 * - Tabla premium
 */

export default function AuditoriaAvanzada() {
  const [registros, setRegistros] = useState([]);
  const [metricas, setMetricas] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    getAuditoria().then((res) => setRegistros(res.data || []));
    getAuditoriaMetricas().then((res) => setMetricas(res.data || null));
  }, []);

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return registros.filter((r) => {
      const texto = `${r.usuario} ${r.modulo} ${r.accion} ${r.descripcion}`.toLowerCase();
      return texto.includes(q);
    });
  }, [registros, busqueda]);

  const handleBusqueda = useCallback((e) => {
    setBusqueda(e.target.value);
  }, []);

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      <h1 className="text-2xl font-bold text-white drop-shadow">
        Auditoría Avanzada
      </h1>

      {/* MÉTRICAS PREMIUM */}
      {metricas && (
        <section
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            p-6 shadow-xl
          "
        >
          <h2 className="text-xl font-semibold mb-3 text-white drop-shadow">
            Métricas
          </h2>

          <p className="text-white/80">Total registros: {metricas.total_registros}</p>

          <div className="grid grid-cols-2 gap-4 mt-4 text-white">
            <div>
              <h3 className="font-semibold mb-2">Por módulo</h3>
              <ul className="space-y-1">
                {(metricas.por_modulo || []).map((m, i) => (
                  <li key={i}>
                    {m.modulo}: {m.cantidad}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Por acción</h3>
              <ul className="space-y-1">
                {(metricas.por_accion || []).map((a, i) => (
                  <li key={i}>
                    {a.accion}: {a.cantidad}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Últimos logins</h3>
            <ul className="space-y-1 text-white/80">
              {(metricas.ultimos_logins || []).map((l, i) => (
                <li key={i}>
                  {l.usuario} — {new Date(l.fecha).toLocaleString("es-ES")}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* BUSCADOR PREMIUM */}
      <input
        type="text"
        placeholder="Buscar en auditoría..."
        className="
          w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2
          text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
        "
        value={busqueda}
        onChange={handleBusqueda}
      />

      {/* TABLA PREMIUM */}
      <section
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          p-6 shadow-xl
        "
      >
        <h2 className="text-xl font-semibold mb-3 text-white drop-shadow">
          Últimos registros
        </h2>

        <table className="w-full text-sm text-white">
          <thead>
            <tr className="border-b border-white/20 text-white/70">
              <th className="py-2">Fecha</th>
              <th>Usuario</th>
              <th>Módulo</th>
              <th>Acción</th>
              <th>Descripción</th>
              <th>IP</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((r) => (
              <tr
                key={r.id}
                className="
                  border-b border-white/10 hover:bg-white/10 transition
                "
              >
                <td className="py-2">
                  {new Date(r.fecha).toLocaleString("es-ES")}
                </td>
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
