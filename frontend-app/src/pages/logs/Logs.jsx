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
    <div className="container-sj space-y-6">
      
      {/* Título principal */}
      <div className="seg-card">
        <h1 className="seg-title">Logs del sistema</h1>
        <p className="seg-desc">Monitorización avanzada de eventos, seguridad y actividad del ERP.</p>
      </div>

      {/* Filtros avanzados */}
      <div className="seg-card grid-sj grid-4">
        <input
          className="sj-input"
          placeholder="Tipo (error, security, info...)"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />

        <input
          className="sj-input"
          placeholder="Buscar texto..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        <input
          type="date"
          className="sj-input"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
        />

        <input
          type="date"
          className="sj-input"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
        />

        <button
          className="sj-btn col-span-4"
          onClick={aplicarFiltros}
        >
          Aplicar filtros
        </button>
      </div>

      {/* Tabla premium */}
      <div className="seg-card overflow-hidden">
        {loading ? (
          <p className="text-gray-600 text-sm">Cargando logs…</p>
        ) : (
          <table className="sj-table w-full text-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Mensaje</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>

                  <td className={`flex items-center gap-2 ${colorTipo(log.tipo)}`}>
                    <span>{iconoTipo(log.tipo)}</span>
                    <span>{log.tipo}</span>
                  </td>

                  <td>{log.mensaje}</td>
                  <td>{new Date(log.fecha).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación premium */}
      <div className="seg-card flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="sj-btn bg-gray-200 text-gray-700 hover:bg-gray-300"
            disabled={pagina <= 1}
            onClick={() => setPagina((p) => p - 1)}
          >
            ← Anterior
          </button>

          <span className="text-sm text-gray-600">
            Página {pagina}
          </span>

          <button
            className="sj-btn bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => setPagina((p) => p + 1)}
          >
            Siguiente →
          </button>
        </div>

        <select
          className="sj-input w-40"
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
