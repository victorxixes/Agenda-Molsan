import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ExpedientesListado() {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtroNif, setFiltroNif] = useState("");
  const [filtroActividad, setFiltroActividad] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroNotario, setFiltroNotario] = useState("");
  const [filtroFinca, setFiltroFinca] = useState("");
  const [filtroImporteMin, setFiltroImporteMin] = useState("");
  const [filtroImporteMax, setFiltroImporteMax] = useState("");

  // Ordenación
  const [ordenColumna, setOrdenColumna] = useState("fecha_alta");
  const [ordenDireccion, setOrdenDireccion] = useState("desc");

  // Paginación
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const porPagina = 20;

  const cargarExpedientes = async () => {
    setLoading(true);

    const res = await axios.get(`/api/expedientes/listado`, {
      params: {
        pagina,
        porPagina,
        nif: filtroNif || undefined,
        actividad: filtroActividad || undefined,
        fecha: filtroFecha || undefined,
        notario: filtroNotario || undefined,
        finca: filtroFinca || undefined,
        importeMin: filtroImporteMin || undefined,
        importeMax: filtroImporteMax || undefined,
        ordenColumna,
        ordenDireccion,
      },
    });

    setExpedientes(res.data.items || []);
    setTotalPaginas(res.data.total_paginas || 1);
    setLoading(false);
  };

  useEffect(() => {
    cargarExpedientes();
  }, [pagina, ordenColumna, ordenDireccion]);

  const aplicarFiltros = () => {
    setPagina(1);
    cargarExpedientes();
  };

  const ordenar = (col) => {
    if (ordenColumna === col) {
      setOrdenDireccion(ordenDireccion === "asc" ? "desc" : "asc");
    } else {
      setOrdenColumna(col);
      setOrdenDireccion("asc");
    }
  };

  const iconoOrden = (col) => {
    if (ordenColumna !== col) return "↕";
    return ordenDireccion === "asc" ? "↑" : "↓";
  };

  return (
    <div className="p-6 text-white space-y-6 animate-fade-in">

      <h1 className="text-3xl font-bold drop-shadow">Expedientes</h1>

      {/* FILTROS AVANZADOS */}
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
            <label className="text-sm text-white/70">Fecha Alta</label>
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
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

          <div className="flex items-end">
            <button
              onClick={aplicarFiltros}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition active:scale-[0.97]"
            >
              Aplicar filtros
            </button>
          </div>

        </div>
      </section>

      {/* TABLA */}
      <section className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl overflow-auto">

        {loading ? (
          <div className="text-white/70 animate-pulse">Cargando expedientes…</div>
        ) : (
          <table className="min-w-full text-sm text-white/80">
            <thead>
              <tr className="text-left bg-white/5">
                {[
                  ["id_expediente", "Nº Expediente"],
                  ["fecha_alta", "Fecha Alta"],
                  ["actividad_actual", "Actividad"],
                  ["tipoprovision", "Tipo Provisión"],
                  ["importe", "Importe"],
                  ["finca", "Finca"],
                  ["nombrecliente", "Cliente"],
                  ["nifcliente", "NIF Cliente"],
                  ["nifnotario", "NIF Notario"],
                ].map(([col, label]) => (
                  <th
                    key={col}
                    className="px-3 py-2 cursor-pointer select-none"
                    onClick={() => ordenar(col)}
                  >
                    {label} <span className="text-white/40">{iconoOrden(col)}</span>
                  </th>
                ))}

                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {expedientes.map((exp) => (
                <tr key={exp.id_expediente} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-3 py-2">{exp.id_expediente}</td>
                  <td className="px-3 py-2">{exp.fecha_alta}</td>
                  <td className="px-3 py-2">{exp.actividad_actual}</td>
                  <td className="px-3 py-2">{exp.tipoprovision}</td>
                  <td className="px-3 py-2">{exp.importe}</td>
                  <td className="px-3 py-2">{exp.finca}</td>
                  <td className="px-3 py-2">{exp.nombrecliente}</td>
                  <td className="px-3 py-2">{exp.nifcliente}</td>
                  <td className="px-3 py-2">{exp.nifnotario}</td>

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

      {/* PAGINACIÓN */}
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

    </div>
  );
}
