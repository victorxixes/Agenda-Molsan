import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const COLUMNAS = [
  { key: "id_expediente", label: "Nº Expediente" },
  { key: "fecha_alta", label: "Fecha Alta" },
  { key: "actividad_actual", label: "Actividad" },
  { key: "tipoprovision", label: "Tipo Provisión" },
  { key: "importe", label: "Importe" },
  { key: "finca", label: "Finca" },
  { key: "nombrecliente", label: "Cliente" },
  { key: "nifcliente", label: "NIF Cliente" },
  { key: "nifnotario", label: "NIF Notario" },
];

export default function ExpedientesListado() {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtroNif, setFiltroNif] = useState("");
  const [filtroActividad, setFiltroActividad] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");
  const [filtroNotario, setFiltroNotario] = useState("");
  const [filtroFinca, setFiltroFinca] = useState("");
  const [filtroImporteMin, setFiltroImporteMin] = useState("");
  const [filtroImporteMax, setFiltroImporteMax] = useState("");

  // Ordenación múltiple
  const [ordenMultiple, setOrdenMultiple] = useState([]);

  // Paginación
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const porPagina = 20;

  // Columnas visibles
  const [columnasVisibles, setColumnasVisibles] = useState(
    COLUMNAS.map((c) => c.key)
  );

  // Resumen para gráficos
  const [resumen, setResumen] = useState({
    pendientes: 0,
    enCurso: 0,
    finalizados: 0,
  });

  const cargarExpedientes = async () => {
    setLoading(true);

    const res = await axios.get("/api/expedientes/listado", {
      params: {
        pagina,
        porPagina,
        nif: filtroNif || undefined,
        actividad: filtroActividad || undefined,
        fechaInicio: filtroFechaInicio || undefined,
        fechaFin: filtroFechaFin || undefined,
        notario: filtroNotario || undefined,
        finca: filtroFinca || undefined,
        importeMin: filtroImporteMin || undefined,
        importeMax: filtroImporteMax || undefined,
        ordenMultiple: ordenMultiple.length ? JSON.stringify(ordenMultiple) : undefined,
      },
    });

    setExpedientes(res.data.items || []);
    setTotalPaginas(res.data.total_paginas || 1);
    setLoading(false);
  };

  const cargarResumen = async () => {
    const res = await axios.get("/api/expedientes/resumen");
    setResumen(res.data || { pendientes: 0, enCurso: 0, finalizados: 0 });
  };

  useEffect(() => {
    cargarExpedientes();
    cargarResumen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, ordenMultiple]);

  const aplicarFiltros = () => {
    setPagina(1);
    cargarExpedientes();
  };

  const ordenar = (col, shiftKey) => {
    if (!shiftKey) {
      // Orden simple: solo una columna
      const actual = ordenMultiple[0];
      if (actual && actual.columna === col) {
        setOrdenMultiple([
          {
            columna: col,
            direccion: actual.direccion === "asc" ? "desc" : "asc",
          },
        ]);
      } else {
        setOrdenMultiple([{ columna: col, direccion: "asc" }]);
      }
      return;
    }

    // Orden múltiple: Shift + click
    const existe = ordenMultiple.find((o) => o.columna === col);
    if (existe) {
      setOrdenMultiple(
        ordenMultiple.map((o) =>
          o.columna === col
            ? { ...o, direccion: o.direccion === "asc" ? "desc" : "asc" }
            : o
        )
      );
    } else {
      setOrdenMultiple([...ordenMultiple, { columna: col, direccion: "asc" }]);
    }
  };

  const iconoOrden = (col) => {
    const o = ordenMultiple.find((x) => x.columna === col);
    if (!o) return "↕";
    return o.direccion === "asc" ? "↑" : "↓";
  };

  const exportarExcel = async () => {
    const res = await axios.get("/api/expedientes/exportar-excel", {
      params: {
        nif: filtroNif || undefined,
        actividad: filtroActividad || undefined,
        fechaInicio: filtroFechaInicio || undefined,
        fechaFin: filtroFechaFin || undefined,
        notario: filtroNotario || undefined,
        finca: filtroFinca || undefined,
        importeMin: filtroImporteMin || undefined,
        importeMax: filtroImporteMax || undefined,
      },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "expedientes.xlsx";
    a.click();
  };

  return (
    <div className="p-6 text-white space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold drop-shadow">Expedientes</h1>

      {/* Filtros avanzados */}
      <section className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Filtros avanzados</h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-white/70">NIF Cliente</label>
            <input
              type="text"
              value={filtroNif}
              onChange={(e) => setFiltroNif(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Actividad</label>
            <input
              type="text"
              value={filtroActividad}
              onChange={(e) => setFiltroActividad(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Fecha inicio</label>
            <input
              type="date"
              value={filtroFechaInicio}
              onChange={(e) => setFiltroFechaInicio(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Fecha fin</label>
            <input
              type="date"
              value={filtroFechaFin}
              onChange={(e) => setFiltroFechaFin(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">NIF Notario</label>
            <input
              type="text"
              value={filtroNotario}
              onChange={(e) => setFiltroNotario(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Finca</label>
            <input
              type="text"
              value={filtroFinca}
              onChange={(e) => setFiltroFinca(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Importe mínimo</label>
            <input
              type="number"
              value={filtroImporteMin}
              onChange={(e) => setFiltroImporteMin(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Importe máximo</label>
            <input
              type="number"
              value={filtroImporteMax}
              onChange={(e) => setFiltroImporteMax(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
            />
          </div>

          <div className="flex items-end gap-3">
            <button
              onClick={aplicarFiltros}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition active:scale-[0.97]"
            >
              Aplicar filtros
            </button>

            <button
              onClick={exportarExcel}
              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg transition active:scale-[0.97]"
            >
              Exportar a Excel
            </button>
          </div>
        </div>
      </section>

      {/* Selector de columnas */}
      <section className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Columnas visibles</h2>
        <div className="grid grid-cols-3 gap-2">
          {COLUMNAS.map((c) => (
            <label
              key={c.key}
              className="flex items-center gap-2 text-sm text-white/80"
            >
              <input
                type="checkbox"
                checked={columnasVisibles.includes(c.key)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setColumnasVisibles([...columnasVisibles, c.key]);
                  } else {
                    setColumnasVisibles(
                      columnasVisibles.filter((x) => x !== c.key)
                    );
                  }
                }}
              />
              {c.label}
            </label>
          ))}
        </div>
      </section>

      {/* Tabla */}
      <section className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl overflow-auto">
        {loading ? (
          <div className="text-white/70 animate-pulse">
            Cargando expedientes…
          </div>
        ) : (
          <table className="min-w-full text-sm text-white/80">
            <thead>
              <tr className="text-left bg-white/5">
                {COLUMNAS.filter((c) =>
                  columnasVisibles.includes(c.key)
                ).map((c) => (
                  <th
                    key={c.key}
                    className="px-3 py-2 cursor-pointer select-none"
                    onClick={(e) => ordenar(c.key, e.shiftKey)}
                  >
                    {c.label}{" "}
                    <span className="text-white/40">{iconoOrden(c.key)}</span>
                  </th>
                ))}
                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {expedientes.map((exp) => (
                <tr
                  key={exp.id_expediente}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  {COLUMNAS.filter((c) =>
                    columnasVisibles.includes(c.key)
                  ).map((c) => (
                    <td key={c.key} className="px-3 py-2">
                      {exp[c.key]}
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <Link
                      to={`/expedientes/${exp.id_expediente}`}
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Ver ficha
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Paginación */}
      <div className="flex items-center justify-center gap-4">
        <button
          disabled={pagina <= 1}
          onClick={() => setPagina(pagina - 1)}
          className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition disabled:opacity-40"
        >
          Anterior
        </button>

        <span className="text-white/70">
          Página {pagina} de {totalPaginas}
        </span>

        <button
          disabled={pagina >= totalPaginas}
          onClick={() => setPagina(pagina + 1)}
          className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>

      {/* Resumen simple para gráficos (puedes luego meter Chart.js) */}
      <section className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Estado de expedientes</h2>
        <div className="grid grid-cols-3 gap-4 text-sm text-white/80">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <p className="text-white/60">Pendientes</p>
            <p className="text-white font-semibold">{resumen.pendientes}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <p className="text-white/60">En curso</p>
            <p className="text-white font-semibold">{resumen.enCurso}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <p className="text-white/60">Finalizados</p>
            <p className="text-white font-semibold">{resumen.finalizados}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
