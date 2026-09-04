import { useEffect, useState } from "react";
import { useLogs } from "../../hooks/useLogs";

export default function Logs() {
  const { logs, cargarLogs, loading } = useLogs();
  const [tipo, setTipo] = useState("");
  const [texto, setTexto] = useState("");

  useEffect(() => {
    cargarLogs();
  }, []);

  const aplicarFiltros = () => {
    cargarLogs({
      tipo: tipo || undefined,
      texto: texto || undefined,
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Logs del sistema</h1>

      {/* Filtros */}
      <div className="grid grid-cols-3 gap-4">
        <input
          className="border p-2"
          placeholder="Filtrar por tipo (security, error, info...)"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Buscar texto..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={aplicarFiltros}
        >
          Aplicar filtros
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <p>Cargando logs…</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>ID</th>
              <th>Tipo</th>
              <th>Mensaje</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b">
                <td>{log.id}</td>
                <td>{log.tipo}</td>
                <td>{log.mensaje}</td>
                <td>{new Date(log.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
