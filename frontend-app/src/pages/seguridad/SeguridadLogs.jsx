import { useEffect, useState } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadLogs() {
  const { logs = [], cargarTodo } = useSeguridad();

  const [pagina, setPagina] = useState(0);
  const pageSize = 20;

  const [busqueda, setBusqueda] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  const [orden, setOrden] = useState({ campo: "fecha", asc: false });

  const ordenar = (campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true
    }));
  };

  const iconosEvento = {
    login: "🔐",
    login_error: "⚠️",
    acceso: "📥",
    update: "✏️",
    delete: "🗑️",
    default: "📄"
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const logsFiltrados = logs.filter((l) => {
    const texto = busqueda.toLowerCase();
    const coincideBusqueda =
      l.evento?.toLowerCase().includes(texto) ||
      l.detalle?.toLowerCase().includes(texto) ||
      l.fecha?.toLowerCase().includes(texto);

    const coincideFecha = filtroFecha ? l.fecha.startsWith(filtroFecha) : true;

    return coincideBusqueda && coincideFecha;
  });

  const logsOrdenados = [...logsFiltrados].sort((a, b) => {
    const campo = orden.campo;
    const asc = orden.asc ? 1 : -1;

    if (a[campo] < b[campo]) return -1 * asc;
    if (a[campo] > b[campo]) return 1 * asc;
    return 0;
  });

  const logsPaginados = logsOrdenados.slice(
    pagina * pageSize,
    pagina * pageSize + pageSize
  );

  // DESCARGA EXCEL
  const descargarExcel = () => {
    const encabezados = ["ID", "Evento", "Detalle", "Fecha", "IP"];
    const filas = logsOrdenados.map((l) => [
      l.id,
      l.evento,
      l.detalle,
      l.fecha,
      l.ip || "-"
    ]);

    const contenido = [encabezados, ...filas]
      .map((fila) => fila.join("\t"))
      .join("\n");

    const blob = new Blob([contenido], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "logs_sistema.xls";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Logs del sistema</h1>

      {/* BOTÓN EXCEL */}
      <button
        onClick={descargarExcel}
        className="px-3 py-2 bg-green-600 text-white rounded mb-4"
      >
        Descargar Excel
      </button>

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          className="border rounded px-3 py-2 w-full md:w-1/2"
          placeholder="Buscar por evento, detalle o fecha..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPagina(0);
          }}
        />

        <input
          type="date"
          className="border rounded px-3 py-2 w-full md:w-1/3"
          value={filtroFecha}
          onChange={(e) => {
            setFiltroFecha(e.target.value);
            setPagina(0);
          }}
        />
      </div>

      {/* TABLA */}
      <table className="w-full border rounded bg-white text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 cursor-pointer" onClick={() => ordenar("fecha")}>
              Fecha {orden.campo === "fecha" ? (orden.asc ? "▲" : "▼") : ""}
            </th>
            <th className="p-2 cursor-pointer" onClick={() => ordenar("evento")}>
              Evento {orden.campo === "evento" ? (orden.asc ? "▲" : "▼") : ""}
            </th>
            <th className="p-2 cursor-pointer" onClick={() => ordenar("detalle")}>
              Detalle {orden.campo === "detalle" ? (orden.asc ? "▲" : "▼") : ""}
            </th>
            <th className="p-2">IP</th>
          </tr>
        </thead>

        <tbody>
          {logsPaginados.map((l) => (
            <tr key={l.id} className="border-b">
              <td className="p-2">{l.fecha}</td>
              <td className="p-2">
                {iconosEvento[l.evento] || iconosEvento.default} {l.evento}
              </td>
              <td className="p-2">{l.detalle || "-"}</td>
              <td className="p-2">{l.ip || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINACIÓN */}
      <div className="flex items-center gap-3 mt-4">
        <button
          disabled={pagina === 0}
          onClick={() => setPagina(pagina - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          ← Anterior
        </button>

        <span className="text-sm text-gray-600">Página {pagina + 1}</span>

        <button
          disabled={(pagina + 1) * pageSize >= logsOrdenados.length}
          onClick={() => setPagina(pagina + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
