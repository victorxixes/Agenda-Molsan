import { useEffect, useState, useMemo, useCallback } from "react";
import { getLogs } from "../../api/logs";

/**
 * Logs Técnicos — SJ‑2026 Premium
 * - Buscador optimizado
 * - Tabla glass‑UI
 * - Animación fade‑in
 */

export default function LogsAvanzados() {
  const [logs, setLogs] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    getLogs().then((res) => setLogs(res.data || []));
  }, []);

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return logs.filter((l) => {
      const texto = `${l.evento} ${l.detalle} ${l.ip}`.toLowerCase();
      return texto.includes(q);
    });
  }, [logs, busqueda]);

  const handleBusqueda = useCallback((e) => {
    setBusqueda(e.target.value);
  }, []);

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      <h1 className="text-2xl font-bold text-white drop-shadow">
        Logs Técnicos
      </h1>

      {/* BUSCADOR PREMIUM */}
      <input
        type="text"
        placeholder="Buscar en logs..."
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
              <th>Evento</th>
              <th>Detalle</th>
              <th>IP</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((l) => (
              <tr
                key={l.id}
                className="
                  border-b border-white/10 hover:bg-white/10 transition
                "
              >
                <td className="py-2">
                  {new Date(l.fecha).toLocaleString("es-ES")}
                </td>
                <td>{l.evento}</td>
                <td>{l.detalle}</td>
                <td>{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
