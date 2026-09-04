import { useEffect, useState } from "react";
import { getLogs } from "../../api/logs";

export default function LogsAvanzados() {
  const [logs, setLogs] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    getLogs().then((res) => setLogs(res.data));
  }, []);

  const filtrados = logs.filter((l) =>
    JSON.stringify(l).toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Logs Técnicos</h1>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar en logs..."
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
              <th>Evento</th>
              <th>Detalle</th>
              <th>IP</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((l) => (
              <tr key={l.id} className="border-b">
                <td>{l.fecha}</td>
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
