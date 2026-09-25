import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../../api/config";

export default function ExpedientesListado() {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtroNif, setFiltroNif] = useState("");
  const [filtroActividad, setFiltroActividad] = useState("");

  // Paginación
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const porPagina = 20;

  const cargarExpedientes = async () => {
    setLoading(true);

    const res = await axios.get(`${API_BASE}/expedientes/listado`, {
      params: {
        pagina,
        porPagina,
        nif: filtroNif || undefined,
        actividad: filtroActividad || undefined,
      },
    });

    setExpedientes(res.data.items || []);
    setTotalPaginas(res.data.total_paginas || 1);
    setLoading(false);
  };

  useEffect(() => {
    cargarExpedientes();
  }, [pagina]);

  const aplicarFiltros = () => {
    setPagina(1);
    cargarExpedientes();
  };

  return (
    <div className="p-6 text-white space-y-6 animate-fade-in">

      <h1 className="text-3xl font-bold drop-shadow">Expedientes</h1>

      {/* FILTROS */}
      <section className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>

        <div className="grid grid-cols-3 gap-4">

          <div>
            <label className="text-sm text-white/70">NIF Cliente</label>
            <input
              type="text"
              value={filtroNif}
              onChange={(e) => setFiltroNif(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
              placeholder="Ej: 12345678A"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Actividad</label>
            <input
              type="text"
              value={filtroActividad}
              onChange={(e) => setFiltroActividad(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
              placeholder="Ej: FIRMA, INSCRIPCIÓN…"
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
                <th className="px-3 py-2">Nº Expediente</th>
                <th className="px-3 py-2">Fecha Alta</th>
                <th className="px-3 py-2">Actividad</th>
                <th className="px-3 py-2">Tipo Provisión</th>
                <th className="px-3 py-2">Importe</th>
                <th className="px-3 py-2">Finca</th>
                <th className="px-3 py-2">Cliente</th>
                <th className="px-3 py-2">NIF Cliente</th>
                <th className="px-3 py-2">NIF Notario</th>
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
