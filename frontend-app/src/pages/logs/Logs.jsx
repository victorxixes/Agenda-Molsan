import { useEffect, useState, useCallback, useMemo } from "react";
import { useLogs } from "../../hooks/useLogs";

export default function Logs() {
  const { logs, cargarLogs, loading } = useLogs();

  const [tipo, setTipo] = useState("");
  const [texto, setTexto] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [pagina, setPagina] = useState(1);
  const PAGE_SIZE = 50;

  const [orden, setOrden] = useState({ campo: "fecha", dir: "desc" });

  const aplicarFiltros = useCallback(() => {
    cargarLogs({
      tipo: tipo || undefined,
      texto: texto || undefined,
      fecha_desde: fechaDesde || undefined,
      fecha_hasta: fechaHasta || undefined,
      pagina,
      page_size: PAGE_SIZE,
    });
  }, [tipo, texto, fechaDesde, fechaHasta, pagina, cargarLogs]);

  useEffect(() => {
    aplicarFiltros();
  }, [pagina, aplicarFiltros]);

  const iconoTipo = useCallback((tipo) => {
    switch (tipo) {
      case "error": return "⛔";
      case "security": return "🔐";
      case "warning": return "⚠️";
      case "info": return "ℹ️";
      default: return "•";
    }
  }, []);

  const colorTipo = useCallback((tipo) => {
    switch (tipo) {
      case "error": return "text-red-400";
      case "security": return "text-blue-400";
      case "warning": return "text-yellow-400";
      case "info": return "text-white/70";
      default: return "text-white";
    }
  }, []);

  const ordenar = useCallback((campo) => {
    setOrden((prev) => ({
      campo,
      dir: prev.campo === campo && prev.dir === "asc" ? "desc" : "asc",
    }));
  }, []);

  const logsOrdenados = useMemo(() => {
    const campo = orden.campo;
    const dir = orden.dir === "asc" ? 1 : -1;

    return [...logs].sort((a, b) => {
      if (campo === "fecha") {
        return (new Date(a.fecha) - new Date(b.fecha)) * dir;
      }
      if (typeof a[campo] === "string") {
        return a[campo].localeCompare(b[campo]) * dir;
      }
      return (a[campo] - b[campo]) * dir;
    });
  }, [logs, orden]);

  const totalPaginas = Math.ceil(logsOrdenados.length / PAGE_SIZE);

  const visibles = useMemo(
    () => logsOrdenados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE),
    [logsOrdenados, pagina]
  );

  const exportarExcel = useCallback(() => {
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
    a.download = "logs_sistema.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [logsOrdenados]);

  return (
    <div className="p-6 space-y-8 text-white animate-fade-in">

      {/* TÍTULO */}
      <div className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        p-6 shadow-xl
      ">
        <h1 className="text-3xl font-bold drop-shadow">Logs del sistema</h1>
        <p className="text-white/70 text-sm mt-1">
          Monitorización avanzada de eventos, seguridad y actividad del ERP.
        </p>
      </div>

      {/* FILTROS */}
      <div className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        p-6 shadow-xl grid grid-cols-4 gap-4
      ">
        <input
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400"
          placeholder="Tipo (error, security, info...)"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />

        <input
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400"
          placeholder="Buscar texto..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        <input
          type="date"
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-blue-400"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
        />

        <input
          type="date"
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-blue-400"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
        />
      </div>

      {/* BOTONES */}
      <div className="flex gap-3">
        <button
          className="
            px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
            text-white shadow-lg transition active:scale-[0.97]
          "
          onClick={aplicarFiltros}
        >
          Aplicar filtros
        </button>

        <button
          className="
            px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700
            text-white shadow-lg transition active:scale-[0.97]
          "
          onClick={exportarExcel}
        >
          Exportar Excel
        </button>
      </div>

      {/* TABLA */}
      <div className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        p-6 shadow-xl overflow-hidden
      ">
        {loading ? (
          <p className="text-white/70 text-sm animate-pulse">Cargando logs…</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/80 border-b border-white/20">
                  <th className="cursor-pointer py-2" onClick={() => ordenar("id")}>ID</th>
                  <th className="cursor-pointer py-2" onClick={() => ordenar("tipo")}>Tipo</th>
                  <th className="cursor-pointer py-2" onClick={() => ordenar("mensaje")}>Mensaje</th>
                  <th className="cursor-pointer py-2" onClick={() => ordenar("fecha")}>Fecha</th>
                </tr>
              </thead>

              <tbody>
                {visibles.map((log) => (
                  <tr
                    key={log.id}
                    className="
                      border-b border-white/10 hover:bg-white/10 transition cursor-pointer
                    "
                  >
                    <td className="py-2">{log.id}</td>

                    <td className={`py-2 flex items-center gap-2 ${colorTipo(log.tipo)}`}>
                      <span>{iconoTipo(log.tipo)}</span>
                      <span>{log.tipo}</span>
                    </td>

                    <td className="py-2">{log.mensaje}</td>

                    <td className="py-2">
                      {new Date(log.fecha).toLocaleString("es-ES")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ⭐ Paginación Premium (idéntica a CTN) */}
            <div className="flex items-center justify-between mt-4 text-white/80 text-sm">
              <button
                className="
                  px-3 py-2 rounded-xl bg-white/10 border border-white/20
                  hover:bg-white/20 transition
                "
                disabled={pagina <= 1}
                onClick={() => setPagina((p) => p - 1)}
              >
                ← Anterior
              </button>

              <span>
                Página {pagina} de {totalPaginas}
              </span>

              <button
                className="
                  px-3 py-2 rounded-xl bg-white/10 border border-white/20
                  hover:bg-white/20 transition
                "
                disabled={pagina >= totalPaginas}
                onClick={() => setPagina((p) => p + 1)}
              >
                Siguiente →
              </button>
            </div>

            <p className="text-white/60 text-sm mt-3">
              Mostrando {visibles.length} logs — Total: {logsOrdenados.length}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
