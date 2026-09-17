import { useEffect, useState, useMemo, useCallback } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadLogs() {
  const { logs = [], cargarTodo } = useSeguridad();

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

  const iconosEvento = useMemo(
    () => ({
      login: "🔐",
      login_error: "⚠️",
      acceso: "📥",
      update: "✏️",
      delete: "🗑️",
      default: "📄",
    }),
    []
  );

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  // BLINDAJE: limpiar logs corruptos
  const logsSeguros = useMemo(() => {
    if (!Array.isArray(logs)) return [];

    return logs.filter((l) => {
      return (
        l &&
        typeof l === "object" &&
        typeof l.id !== "undefined" &&
        typeof l.evento === "string" &&
        typeof l.detalle === "string" &&
        typeof l.fecha === "string" &&
        (typeof l.ip === "string" || typeof l.ip === "undefined")
      );
    });
  }, [logs]);

  const logsFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return logsSeguros.filter((l) => {
      const coincideBusqueda =
        l.evento.toLowerCase().includes(texto) ||
        l.detalle.toLowerCase().includes(texto) ||
        l.fecha.toLowerCase().includes(texto);

      const coincideFecha = filtroFecha
        ? l.fecha.startsWith(filtroFecha)
        : true;

      return coincideBusqueda && coincideFecha;
    });
  }, [logsSeguros, busqueda, filtroFecha]);

  const logsOrdenados = useMemo(() => {
    const { campo, asc } = orden;
    const dir = asc ? 1 : -1;

    return [...logsFiltrados].sort((a, b) => {
      const va = a[campo];
      const vb = b[campo];

      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }, [logsFiltrados, orden]);

  const logsPaginados = useMemo(() => {
    return logsOrdenados.slice(
      pagina * pageSize,
      pagina * pageSize + pageSize
    );
  }, [logsOrdenados, pagina]);

  const descargarExcel = useCallback(() => {
    const encabezados = ["ID", "Evento", "Detalle", "Fecha", "IP"];
    const filas = logsOrdenados.map((l) => [
      l.id,
      l.evento,
      l.detalle,
      l.fecha,
      l.ip || "-",
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
    a.download = "logs_sistema.xls";
    a.click();

    URL.revokeObjectURL(url);
  }, [logsOrdenados]);

  return (
    <div className="p-6 space-y-6 text-white animate-fade-in">

      <h1 className="text-3xl font-bold drop-shadow mb-4">
        Logs del sistema — SJ‑2026
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
          placeholder="Buscar por evento, detalle o fecha..."
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

              <th className="p-3 cursor-pointer" onClick={() => ordenar("evento")}>
                Evento {orden.campo === "evento" ? (orden.asc ? "▲" : "▼") : ""}
              </th>

              <th className="p-3 cursor-pointer" onClick={() => ordenar("detalle")}>
                Detalle {orden.campo === "detalle" ? (orden.asc ? "▲" : "▼") : ""}
              </th>

              <th className="p-3">IP</th>
            </tr>
          </thead>

          <tbody>
            {logsPaginados.map((l) => (
              <tr
                key={String(l.id)}
                className="border-b border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-3">{l.fecha}</td>

                <td className="p-3">
                  {iconosEvento[l.evento] || iconosEvento.default} {l.evento}
                </td>

                <td className="p-3">{l.detalle || "-"}</td>
                <td className="p-3">{l.ip || "-"}</td>
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
          disabled={(pagina + 1) * pageSize >= logsOrdenados.length}
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
