import { useEffect, useState } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadAuditoria() {
  const { auditoria = [], cargarTodo } = useSeguridad();

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

  // Iconos por tipo de acción
  const iconosAccion = {
    login: "🔐",
    login_error: "⚠️",
    acceso: "📥",
    update: "✏️",
    delete: "🗑️",
    permiso: "🔧",
    modulo: "📦",
    default: "📄"
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  // ---------------------------
  // FILTRO DE BÚSQUEDA + FECHA
  // ---------------------------
  const auditoriaFiltrada = auditoria.filter((a) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      a.usuario?.toLowerCase().includes(texto) ||
      a.modulo?.toLowerCase().includes(texto) ||
      a.accion?.toLowerCase().includes(texto) ||
      a.descripcion?.toLowerCase().includes(texto) ||
      a.fecha?.toLowerCase().includes(texto);

    const coincideFecha = filtroFecha
      ? a.fecha.startsWith(filtroFecha)
      : true;

    return coincideBusqueda && coincideFecha;
  });

  // ---------------------------
  // ORDENACIÓN
  // ---------------------------
  const auditoriaOrdenada = [...auditoriaFiltrada].sort((a, b) => {
    const campo = orden.campo;
    const asc = orden.asc ? 1 : -1;

    if (a[campo] < b[campo]) return -1 * asc;
    if (a[campo] > b[campo]) return 1 * asc;
    return 0;
  });

  // ---------------------------
  // PAGINACIÓN
  // ---------------------------
  const auditoriaPaginada = auditoriaOrdenada.slice(
    pagina * pageSize,
    pagina * pageSize + pageSize
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Auditoría del sistema</h1>

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          className="border rounded px-3 py-2 w-full md:w-1/2"
          placeholder="Buscar por usuario, módulo, acción o descripción..."
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
              onClick={() => ordenar("usuario")}
            >
              Usuario {orden.campo === "usuario" ? (orden.asc ? "▲" : "▼") : ""}
            </th>

            <th
              className="p-2 cursor-pointer"
              onClick={() => ordenar("modulo")}
            >
              Módulo {orden.campo === "modulo" ? (orden.asc ? "▲" : "▼") : ""}
            </th>

            <th
              className="p-2 cursor-pointer"
              onClick={() => ordenar("accion")}
            >
              Acción {orden.campo === "accion" ? (orden.asc ? "▲" : "▼") : ""}
            </th>

            <th className="p-2">Descripción</th>
          </tr>
        </thead>

        <tbody>
          {auditoriaPaginada.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="p-2">{a.fecha}</td>

              <td className="p-2">{a.usuario}</td>

              <td className="p-2">{a.modulo}</td>

              <td className="p-2">
                {iconosAccion[a.accion] || iconosAccion.default} {a.accion}
              </td>

              <td className="p-2">{a.descripcion}</td>
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
          disabled={(pagina + 1) * pageSize >= auditoriaOrdenada.length}
          onClick={() => setPagina(pagina + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
