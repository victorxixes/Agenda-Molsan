import { useEffect, useState } from "react";
import { useLogs } from "../../hooks/useLogs";

export default function Logs() {
  const { logs, cargarLogs, loading } = useLogs();

  // Filtros
  const [tipo, setTipo] = useState("");
  const [texto, setTexto] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  // Paginación
  const [pagina, setPagina] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const aplicarFiltros = () => {
    cargarLogs({
      tipo: tipo || undefined,
      texto: texto || undefined,
      fecha_desde: fechaDesde || undefined,
      fecha_hasta: fechaHasta || undefined,
      pagina,
      page_size: pageSize,
    });
  };

  useEffect(() => {
    aplicarFiltros();
  }, [pagina, pageSize]);

  const iconoTipo = (tipo) => {
    switch (tipo) {
      case "error":
        return "🔴";
      case "security":
        return "🔐";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "•";
    }
  };

  const colorTipo = (tipo) => {
    switch (tipo) {
      case "error":
        return "text-red-600 font-semibold";
      case "security":
        return "text-blue-600 font-semibold";
      case "warning":
        return "text-yellow-600 font-semibold";
      case "info":
        return "text-gray-600";
      default:
        return "text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Logs del sistema</h1>

      {/* Filtros avanzados */}
      <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow">
        <input
          className="border p-2 rounded"
          placeholder="Tipo (error, security, info...)"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Buscar texto..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
        />

        <button
          className="col-span-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={aplicarFiltros}
        >
          Aplicar filtros
        </button>
      </div>

      {/* Tabla premium */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="p-4 text-gray-600">Cargando logs…</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-left">Mensaje</th>
                <th className="p-2 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{log.id}</td>

                  {/* Icono + tipo con color */}
                  <td className={`p-2 flex items-center gap-2 ${colorTipo(log.tipo)}`}>
                    <span>{iconoTipo(log.tipo)}</span>
                    <span>{log.tipo}</span>
                  </td>

                  <td className="p-2">{log.mensaje}</td>
                  <td className="p-2">
                    {new Date(log.fecha).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={pagina <= 1}
            onClick={() => setPagina((p) => p - 1)}
          >
            ← Anterior
          </button>

          <span className="text-sm text-gray-600">
            Página {pagina}
          </span>

          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setPagina((p) => p + 1)}
          >
            Siguiente →
          </button>
        </div>

        <select
          className="border p-2 rounded"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={20}>20 por página</option>
          <option value={50}>50 por página</option>
          <option value={100}>100 por página</option>
        </select>
      </div>
    </div>
  );
}
