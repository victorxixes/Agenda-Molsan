import { useEffect, useState, useMemo, useCallback } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadAuditoria() {
  const { auditoria = [], cargarTodo } = useSeguridad();

  const [pagina, setPagina] = useState(0);
  const pageSize = 20;

  const [busqueda, setBusqueda] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  const [orden, setOrden] = useState({ campo: "fecha", asc: false });

  const ordenar = useCallback((campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true,
    }));
  }, []);

  const iconosAccion = useMemo(
    () => ({
      login: "🔐",
      login_error: "⚠️",
      acceso: "📥",
      update: "✏️",
      delete: "🗑️",
      permiso: "🔧",
      modulo: "📦",
      default: "📄",
    }),
    []
  );

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  // BLINDAJE: limpiar auditoría corrupta
  const auditoriaSegura = useMemo(() => {
    if (!Array.isArray(auditoria)) return [];

    return auditoria.filter((a) => {
      return (
        a &&
        typeof a === "object" &&
        typeof a.id !== "undefined" &&
        typeof a.fecha === "string" &&
        typeof a.usuario === "string" &&
        typeof a.modulo === "string" &&
        typeof a.accion === "string" &&
        typeof a.descripcion === "string"
      );
    });
  }, [auditoria]);

  const auditoriaFiltrada = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return auditoriaSegura.filter((a) => {
      const coincideBusqueda =
        a.usuario.toLowerCase().includes(texto) ||
        a.modulo.toLowerCase().includes(texto) ||
        a.accion.toLowerCase().includes(texto) ||
        a.descripcion.toLowerCase().includes(texto) ||
        a.fecha.toLowerCase().includes(texto);

      const coincideFecha = filtroFecha
        ? a.fecha.startsWith(filtroFecha)
        : true;

      return coincideBusqueda && coincideFecha;
    });
  }, [auditoriaSegura, busqueda, filtroFecha]);

  const auditoriaOrdenada = useMemo(() => {
    const { campo, asc } = orden;
    const dir = asc ? 1 : -1;

    return [...auditoriaFiltrada].sort((a, b) => {
      const va = a[campo];
      const vb = b[campo];

      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }, [auditoriaFiltrada, orden]);

  const auditoriaPaginada = useMemo(() => {
    return auditoriaOrdenada.slice(
      pagina * pageSize,
      pagina * pageSize + pageSize
    );
  }, [auditoriaOrdenada, pagina]);

  const descargarExcel = useCallback(() => {
    const encabezados = ["ID", "Usuario", "Módulo", "Acción", "Descripción", "Fecha"];
    const filas = auditoriaOrdenada.map((a) => [
      a.id,
      a.usuario,
      a.modulo,
      a.accion,
      a.descripcion,
      a.fecha,
    ]);

    const contenido = [encabezados, ...filas]
      .map((fila) => fila.join("\t"))
      .join("\n");

    const blob = new Blob([contenido], {
      type: "application/vnd.ms-excel",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "auditoria_sistema.xls";
    a.click();

    URL.revokeObjectURL(url);
  }, [auditoriaOrdenada]);

  return (
    <div className="p-6 space-y-6 text-white animate-fade-in">

      <h1 className="text-3xl font-bold drop-shadow mb-4">
        Auditoría del sistema — SJ‑2026
      </h1>

      <button
        onClick={descargarExcel}
        className="
          px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700
          text-white shadow-lg transition active:scale-[0.97]
        "
      >
        Descargar Excel
      </button>

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

      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-xl overflow-hidden
        "
      >
        <table className="w-full text-sm text-white">
          <thead className="bg-white/10 border-b border-white/20">
            <tr>
              <th className="p-3 cursor-pointer" onClick={() => ordenar("fecha")}>
                Fecha {orden.campo === "fecha" ? (orden.asc ? "▲" : "▼") : ""}
              </th>

              <th className="p-3 cursor-pointer" onClick={() => ordenar("usuario")}>
                Usuario {orden.campo === "usuario" ? (orden.asc ? "▲" : "▼") : ""}
              </th>

              <th className="p-3 cursor-pointer" onClick={() => ordenar("modulo")}>
                Módulo {orden.campo === "modulo" ? (orden.asc ? "▲" : "▼") : ""}
              </th>

              <th className="p-3 cursor-pointer" onClick={() => ordenar("accion")}>
                Acción {orden.campo === "accion" ? (orden.asc ? "▲" : "▼") : ""}
              </th>

              <th className="p-3">Descripción</th>
            </tr>
          </thead>

          <tbody>
            {auditoriaPaginada.map((a) => (
              <tr
                key={String(a.id)}
                className="border-b border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-3">{a.fecha}</td>
                <td className="p-3">{a.usuario}</td>
                <td className="p-3">{a.modulo}</td>

                <td className="p-3">
                  {iconosAccion[a.accion] || iconosAccion.default} {a.accion}
                </td>

                <td className="p-3">{a.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3 mt-4 text-white">
        <button
          disabled={pagina === 0}
          onClick={() => setPagina(pagina - 1)}
          className="
            px-3 py-1 bg-white/10 border border-white/20 rounded-xl
            disabled:opacity-40 hover:bg-white/20 transition active:scale-[0.97]
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
            disabled:opacity-40 hover:bg-white/20 transition active:scale-[0.97]
          "
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
