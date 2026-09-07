import { useEffect, useState } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadLogs() {
  const { logs = [], cargarTodo } = useSeguridad();

  // Paginación
  const [pagina, setPagina] = useState(0);
  const pageSize = 20;

  // Búsqueda general
  const [busqueda, setBusqueda] = useState("");

  // Filtro por fecha
  const [filtroFecha, setFiltroFecha] = useState("");

  // Ordenación
  const [orden, setOrden] = useState({ campo: "fecha", asc: false });

  const ordenar = (campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true
    }));
  };

  // Iconos por tipo de evento
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

  // ---------------------------
  // FILTRO DE BÚSQUEDA + FECHA
  // ---------------------------
  const logsFiltrados = logs.filter((l) => {
    const texto = busqueda.toLowerCase();
    const coincideBusqueda =
      l.evento?.toLowerCase().includes(texto) ||
      l.detalle?.toLowerCase().includes(texto) ||
      l.fecha?.toLowerCase().includes(texto);

    const coincideFecha = filtroFecha
      ? l.fecha.startsWith(filtroFecha)
      : true;

    return coincideBusqueda && coincideFecha;
  });

  // ---------------------------
  // ORDENACIÓN
  // ---------------------------
  const logsOrdenados = [...logsFiltrados].sort((a, b) => {
    const campo = orden.campo;
    const asc = orden.asc ? 1 : -1;

    if (a[campo] < b[campo]) return -1 * asc;
    if (a[campo] > b[campo]) return 1 * asc;
    return 0;
  });

  // ---------------------------
  // PAGINACIÓN
  // ---------------------------
  const logsPaginados = logsOrdenados.slice(
    pagina * pageSize,
    pagina * pageSize + pageSize
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Logs del sistema</h1>

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
            <th
              className="p-2 cursor-pointer"
              onClick={() => ordenar("fecha")}
            >
              Fecha {orden.campo === "fecha" ? (orden.asc ? "▲" : "▼") : ""}
            </th>

            <th
              className="p-2 cursor-pointer"
              onClick={() => ordenar("evento")}
            >
              Evento {orden.campo === "evento" ? (orden.asc ? "▲" : "▼") : ""}
            </th>

            <th
              className="p-2 cursor-pointer"
              onClick={() => ordenar("detalle")}
            >
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

        <span className="text-sm text-gray-600">
          Página {pagina + 1}
        </span>

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
