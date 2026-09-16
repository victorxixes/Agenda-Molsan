import { useEffect, useState } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadAuditoria() {
  const { auditoria = [], cargarTodo } = useSeguridad();

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

  const auditoriaFiltrada = auditoria.filter((a) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      a.usuario?.toLowerCase().includes(texto) ||
      a.modulo?.toLowerCase().includes(texto) ||
      a.accion?.toLowerCase().includes(texto) ||
      a.descripcion?.toLowerCase().includes(texto) ||
      a.fecha?.toLowerCase().includes(texto);

    const coincideFecha = filtroFecha ? a.fecha.startsWith(filtroFecha) : true;

    return coincideBusqueda && coincideFecha;
  });

  const auditoriaOrdenada = [...auditoriaFiltrada].sort((a, b) => {
    const campo = orden.campo;
    const asc = orden.asc ? 1 : -1;

    if (a[campo] < b[campo]) return -1 * asc;
    if (a[campo] > b[campo]) return 1 * asc;
    return 0;
  });

  const auditoriaPaginada = auditoriaOrdenada.slice(
    pagina * pageSize,
    pagina * pageSize + pageSize
  );

  // DESCARGA EXCEL
  const descargarExcel = () => {
    const encabezados = ["ID", "Usuario", "Módulo", "Acción", "Descripción", "Fecha"];
    const filas = auditoriaOrdenada.map((a) => [
      a.id,
      a.usuario,
      a.modulo,
      a.accion,
      a.descripcion,
      a.fecha
    ]);

    const contenido = [encabezados, ...filas]
      .map((fila) => fila.join("\t"))
      .join("\n");

    const blob = new Blob([contenido], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "auditoria_sistema.xls";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER PREMIUM */}
      <h1 className="text-3xl font-bold text-white drop-shadow mb-4">
        Auditoría del sistema — SJ‑2026
      </h1>

      {/* BOTÓN EXCEL PREMIUM */}
      <button
        onClick={descargarExcel}
        className="
          px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700
          text-white shadow-lg transition
        "
      >
        Descargar Excel
      </button>

      {/* FILTROS PREMIUM */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          className="
            w-full md:w-1/2 bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          placeholder="Buscar por usuario, módulo, acción o descripción..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPagina(0);
          }}
        />

        <input
          type="date"
          className="
            w-full md:w-1/3 bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white focus:ring-2 focus:ring-blue-400
          "
          value={filtroFecha}
          onChange={(e) => {
            setFiltroFecha(e.target.value);
            setPagina(0);
          }}
        />
      </div>

      {/* TABLA PREMIUM */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-xl overflow-hidden
        "
      >
        <table className="w-full text-sm text-white">
          <thead className="bg-white/10 border-b border-white/20">
            <tr>
              <th
                className="p-3 cursor-pointer"
                onClick={() => ordenar("fecha")}
              >
                Fecha {orden.campo === "fecha" ? (orden.asc ? "▲" : "▼") : ""}
              </th>

              <th
                className="p-3 cursor-pointer"
                onClick={() => ordenar("usuario")}
              >
                Usuario {orden.campo === "usuario" ? (orden.asc ? "▲" : "▼") : ""}
              </th>

              <th
                className="p-3 cursor-pointer"
                onClick={() => ordenar("modulo")}
              >
                Módulo {orden.campo === "modulo" ? (orden.asc ? "▲" : "▼") : ""}
              </th>

              <th
                className="p-3 cursor-pointer"
                onClick={() => ordenar("accion")}
              >
                Acción {orden.campo === "accion" ? (orden.asc ? "▲" : "▼") : ""}
              </th>

              <th className="p-3">Descripción</th>
            </tr>
          </thead>

          <tbody>
            {auditoriaPaginada.map((a) => (
              <tr
                key={a.id}
                className="border-b border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-3">{a.fecha}</td>
                <td className="p-3">{a.usuario}</td>
                <td className="p-3">{a.modulo}</td>

                <td className="p-3">
                  {iconosAccion[a.accion] || iconosAccion.default}{" "}
                  {a.accion}
                </td>

                <td className="p-3">{a.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN PREMIUM */}
      <div className="flex items-center gap-3 mt-4 text-white">
        <button
          disabled={pagina === 0}
          onClick={() => setPagina(pagina - 1)}
          className="
            px-3 py-1 bg-white/10 border border-white/20 rounded-xl
            disabled:opacity-40 hover:bg-white/20 transition
          "
        >
          ← Anterior
        </button>

        <span className="text-sm text-white/70">
          Página {pagina + 1}
        </span>

        <button
          disabled={(pagina + 1) * pageSize >= auditoriaOrdenada.length}
          onClick={() => setPagina(pagina + 1)}
          className="
            px-3 py-1 bg-white/10 border border-white/20 rounded-xl
            disabled:opacity-40 hover:bg-white/20 transition
          "
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
