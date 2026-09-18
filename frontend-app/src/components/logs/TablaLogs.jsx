import { useMemo, useCallback, useState } from "react";

export default function TablaLogs({
  datos = [],
  columnas = [],
  pageSize = 20,
  titulo = "Logs",
  descripcion = "",
  enableSearch = true,
  enableDateFilter = true,
  enableExport = true,
  exportFilename = "logs_sistema",
  iconosEvento = {},
}) {
  const [pagina, setPagina] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [orden, setOrden] = useState({ campo: columnas[0]?.campo || "fecha", asc: false });

  const ordenar = useCallback((campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true,
    }));
  }, []);

  const datosSeguros = useMemo(() => {
    if (!Array.isArray(datos)) return [];
    return datos.filter((d) => d && typeof d === "object");
  }, [datos]);

  const datosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return datosSeguros.filter((d) => {
      const coincideBusqueda = !enableSearch
        ? true
        : columnas.some((col) => {
            const v = d[col.campo];
            return (
              typeof v === "string" &&
              v.toLowerCase().includes(texto)
            );
          });

      const coincideFecha = !enableDateFilter
        ? true
        : (() => {
            const colFecha = columnas.find((c) => c.esFecha);
            if (!colFecha) return true;
            const v = d[colFecha.campo];
            if (typeof v !== "string") return true;
            if (!filtroFecha) return true;
            return v.startsWith(filtroFecha);
          })();

      return coincideBusqueda && coincideFecha;
    });
  }, [datosSeguros, busqueda, filtroFecha, columnas, enableSearch, enableDateFilter]);

  const datosOrdenados = useMemo(() => {
    const { campo, asc } = orden;
    const dir = asc ? 1 : -1;

    return [...datosFiltrados].sort((a, b) => {
      const va = a[campo];
      const vb = b[campo];

      if (va == null && vb == null) return 0;
      if (va == null) return 1 * dir;
      if (vb == null) return -1 * dir;

      if (typeof va === "string" && typeof vb === "string") {
        return va.localeCompare(vb) * dir;
      }

      if (campo.toLowerCase().includes("fecha")) {
        const da = new Date(va);
        const db = new Date(vb);
        return (da - db) * dir;
      }

      return (va > vb ? 1 : va < vb ? -1 : 0) * dir;
    });
  }, [datosFiltrados, orden]);

  const datosPaginados = useMemo(() => {
    return datosOrdenados.slice(
      pagina * pageSize,
      pagina * pageSize + pageSize
    );
  }, [datosOrdenados, pagina, pageSize]);

  const descargarExcel = useCallback(() => {
    if (!enableExport) return;

    const encabezados = columnas.map((c) => c.titulo);
    const filas = datosOrdenados.map((d) =>
      columnas.map((c) => {
        const v = d[c.campo];
        return v == null ? "-" : String(v).replace(/\t/g, " ");
      })
    );

    const contenido = [encabezados, ...filas]
      .map((fila) => fila.join("\t"))
      .join("\n");

    const blob = new Blob([contenido], {
      type: "application/vnd.ms-excel",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportFilename}.xls`;
    a.click();

    URL.revokeObjectURL(url);
  }, [datosOrdenados, columnas, enableExport, exportFilename]);

  return (
    <div className="space-y-4 text-white">

      {/* Título / descripción */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl">
        <h2 className="text-2xl font-bold drop-shadow">{titulo}</h2>
        {descripcion && (
          <p className="text-white/70 text-sm mt-1">{descripcion}</p>
        )}
      </div>

      {/* Filtros */}
      {(enableSearch || enableDateFilter || enableExport) && (
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {enableSearch && (
            <input
              type="text"
              className="
                w-full md:flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2
                text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
              "
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPagina(0);
              }}
            />
          )}

          {enableDateFilter && (
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
          )}

          {enableExport && (
            <button
              onClick={descargarExcel}
              className="
                px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700
                text-white shadow-lg transition active:scale-[0.97]
              "
            >
              Descargar Excel
            </button>
          )}
        </div>
      )}

      {/* Tabla */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-xl overflow-hidden
        "
      >
        <table className="w-full text-sm text-white">
          <thead className="bg-white/10 border-b border-white/20">
            <tr>
              {columnas.map((col) => (
                <th
                  key={col.campo}
                  className="p-3 cursor-pointer"
                  onClick={() => ordenar(col.campo)}
                >
                  {col.titulo}{" "}
                  {orden.campo === col.campo ? (orden.asc ? "▲" : "▼") : ""}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {datosPaginados.map((d, idx) => (
              <tr
                key={String(d.id ?? idx)}
                className="border-b border-white/10 hover:bg-white/5 transition"
              >
                {columnas.map((col) => {
                  const valor = d[col.campo];
                  let contenido = valor == null ? "-" : String(valor);

                  if (col.esFecha && valor) {
                    try {
                      contenido = new Date(valor).toLocaleString("es-ES");
                    } catch {
                      contenido = String(valor);
                    }
                  }

                  if (col.esEvento && valor) {
                    const icono =
                      iconosEvento[valor] || iconosEvento.default || "📄";
                    return (
                      <td key={col.campo} className="p-3">
                        {icono} {contenido}
                      </td>
                    );
                  }

                  return (
                    <td key={col.campo} className="p-3">
                      {contenido}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center gap-3 mt-2 text-white">
        <button
          disabled={pagina === 0}
          onClick={() => setPagina((p) => p - 1)}
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
          disabled={(pagina + 1) * pageSize >= datosOrdenados.length}
          onClick={() => setPagina((p) => p + 1)}
          className="
            px-3 py-1 bg-white/10 border border-white/20 rounded-xl
            disabled:opacity-40 hover:bg-white/20 transition active:scale-[0.97]
          "
        >
          Siguiente →
        </button>

        <span className="text-xs text-white/50 ml-auto">
          Mostrando {datosPaginados.length} de {datosOrdenados.length} registros
        </span>
      </div>
    </div>
  );
}
