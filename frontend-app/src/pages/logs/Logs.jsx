import { useEffect, useState } from "react";
import { useLogs } from "../../hooks/useLogs";

export default function Logs() {
  const { logs, cargarLogs, loading } = useLogs();

  // Filtros
  const [tipo, setTipo] = useState("");
  const [texto, setTexto] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  // Paginación local
  const [pagina, setPagina] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Ordenación
  const [orden, setOrden] = useState({ campo: "fecha", dir: "desc" });

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

  // Iconos por tipo
  const iconoTipo = (tipo) => {
    switch (tipo) {
      case "error":
        return "⚠️";
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

  // Colores por tipo
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

  // Ordenar columnas
  const ordenar = (campo) => {
    setOrden((prev) => ({
      campo,
      dir: prev.campo === campo && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  const logsOrdenados = [...logs].sort((a, b) => {
    const campo = orden.campo;
    const dir = orden.dir === "asc" ? 1 : -1;

    if (campo === "fecha") {
      return (new Date(a.fecha) - new Date(b.fecha)) * dir;
    }
    if (typeof a[campo] === "string") {
      return a[campo].localeCompare(b[campo]) * dir;
    }
    return (a[campo] - b[campo]) * dir;
  });

  // Paginación local
  const totalPaginas = Math.ceil(logsOrdenados.length / pageSize);
  const visibles = logsOrdenados.slice(
    (pagina - 1) * pageSize,
    pagina * pageSize
  );

  // Exportar Excel
  const exportarExcel = () => {
    const filas = logsOrdenados.map((l) => ({
      ID: l.id,
      Tipo: l.tipo,
      Mensaje: l.mensaje,
      Fecha: l.fecha,
    }));

    const csv = [
      "ID,Tipo,Mensaje,Fecha",
      ...filas.map((f) =>
        `${f.ID},${f.Tipo},${f.Mensaje.replace(/,/g, ";")},${f.Fecha}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "logs_sistema.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-sj space-y-6">

      {/* Título */}
      <div className="seg-card">
        <h1 className="seg-title">Logs del sistema</h1>
        <p className="seg-desc">Monitorización avanzada de eventos, seguridad y actividad del ERP.</p>
      </div>

      {/* Filtros */}
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

        <button className="sj-btn col-span-4" onClick={aplicarFiltros}>
          Aplicar filtros
        </button>
      </div>

      {/* Tabla */}
      <div className="seg-card overflow-hidden">
        {loading ? (
          <p className="text-gray-600 text-sm">Cargando logs…</p>
        ) : (
          <table className="sj-table w-full text-sm">
            <thead>
              <tr>
                <th className="cursor-pointer" onClick={() => ordenar("id")}>
                  ID
                </th>
                <th className="cursor-pointer" onClick={() => ordenar("tipo")}>
                  Tipo
                </th>
                <th className="cursor-pointer" onClick={() => ordenar("mensaje")}>
                  Mensaje
                </th>
                <th className="cursor-pointer" onClick={() => ordenar("fecha")}>
                  Fecha
                </th>
              </tr>
            </thead>

            <tbody>
              {visibles.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>

                  <td className={`flex items-center gap-2 ${colorTipo(log.tipo)}`}>
                    <span>{iconoTipo(log.tipo)}</span>
                    <span>{log.tipo}</span>
                  </td>

                  <td>{log.mensaje}</td>

                  <td>{new Date(log.fecha).toLocaleString("es-ES")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación + Exportar */}
      <div className="seg-card flex items-center justify-between">

        {/* Paginación */}
        <div className="flex items-center gap-2">
          <button
            className="sj-btn bg-gray-200 text-gray-700 hover:bg-gray-300"
            disabled={pagina <= 1}
            onClick={() => setPagina((p) => p - 1)}
          >
            ← Anterior
          </button>

          <span className="text-sm text-gray-600">
            Página {pagina} de {totalPaginas}
          </span>

          <button
            className="sj-btn bg-gray-200 text-gray-700 hover:bg-gray-300"
            disabled={pagina >= totalPaginas}
            onClick={() => setPagina((p) => p + 1)}
          >
            Siguiente →
          </button>
        </div>

        {/* Tamaño página */}
        <select
          className="sj-input w-40"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={20}>20 por página</option>
          <option value={50}>50 por página</option>
          <option value={100}>100 por página</option>
        </select>

        {/* Exportar Excel */}
        <button
          onClick={exportarExcel}
          className="sj-btn bg-green-600 hover:bg-green-700 px-4 py-2"
        >
          Exportar Excel
        </button>
      </div>
    </div>
  );
}
