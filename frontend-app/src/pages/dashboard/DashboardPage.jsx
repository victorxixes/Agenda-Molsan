import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function DashboardPage() {
  const [data, setData] = useState(null);

  // FILTROS
  const [search, setSearch] = useState("");
  const [filtroFirma, setFiltroFirma] = useState("TODAS");
  const [filtroNotario, setFiltroNotario] = useState("TODOS");
  const [filtroApoderado, setFiltroApoderado] = useState("TODOS");

  // ORDENACIÓN + PAGINACIÓN
  const [sortBy, setSortBy] = useState("fecha");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    axios.get("dashboard/full").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return <div>Cargando dashboard…</div>;

  const { kpis, citas_dia, por_apoderado, actividad_semanal } = data;

  // -----------------------------
  // FILTROS
  // -----------------------------
  const citasFiltradas = citas_dia.filter((c) => {
    const texto = search.toLowerCase();

    const coincideTexto =
      c.fecha.toLowerCase().includes(texto) ||
      c.tipo_cita.toLowerCase().includes(texto) ||
      (c.notario && `${c.notario.nombre} ${c.notario.apellidos}`.toLowerCase().includes(texto)) ||
      (c.apoderado && `${c.apoderado.nombre} ${c.apoderado.apellidos}`.toLowerCase().includes(texto));

    const coincideFirma =
      filtroFirma === "TODAS" ||
      (filtroFirma === "VC" && c.vc === "SI") ||
      (filtroFirma === "PRESENCIAL" && c.vc === "NO");

    const coincideNotario =
      filtroNotario === "TODOS" ||
      (c.notario && c.notario.id === Number(filtroNotario));

    const coincideApoderado =
      filtroApoderado === "TODOS" ||
      (c.apoderado && c.apoderado.id === Number(filtroApoderado));

    return coincideTexto && coincideFirma && coincideNotario && coincideApoderado;
  });

  // -----------------------------
  // ORDENACIÓN
  // -----------------------------
  const ordenar = (campo) => {
    if (sortBy === campo) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(campo);
      setSortDirection("asc");
    }
  };

  const citasOrdenadas = [...citasFiltradas].sort((a, b) => {
    const A = a[sortBy] || "";
    const B = b[sortBy] || "";

    if (A < B) return sortDirection === "asc" ? -1 : 1;
    if (A > B) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPaginas = Math.ceil(citasOrdenadas.length / pageSize);
  const citasPagina = citasOrdenadas.slice((page - 1) * pageSize, page * pageSize);

  const iconoOrden = (campo) => {
    if (sortBy !== campo) return "↕️";
    return sortDirection === "asc" ? "⬆️" : "⬇️";
  };

  // -----------------------------
  // EXPORTAR A EXCEL
  // -----------------------------
  const exportarExcel = () => {
  let csv = "Fecha,Hora Inicio,Hora Fin,Tipo,Notario,Apoderado,Firma\n";

  citasOrdenadas.forEach((c) => {
    csv += `${c.fecha},${c.hora_inicio},${c.hora_fin},${c.tipo_cita},${c.notario ? c.notario.nombre : ""},${c.apoderado ? c.apoderado.nombre : ""},${c.vc}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "citas_dashboard.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  // -----------------------------
  // GRÁFICO DE ACTIVIDAD SEMANAL
  // -----------------------------
  useEffect(() => {
    const ctx = document.getElementById("graficoActividad");

    if (!ctx) return;

    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Citas", "VC", "Presencial"],
        datasets: [
          {
            label: "Actividad semanal",
            data: [
              actividad_semanal.citas,
              actividad_semanal.vc,
              actividad_semanal.presencial,
            ],
            borderColor: "#1F3A5F",
            backgroundColor: "rgba(31,58,95,0.3)",
            tension: 0.3,
          },
        ],
      },
    });
  }, [actividad_semanal]);

  return (
    <div className="space-y-10 p-6">
      <h2 className="text-3xl font-bold" style={{ color: "#1F3A5F" }}>
        Dashboard de Firmas
      </h2>

      {/* 🔵 KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
          <div className="text-lg font-semibold">📅 Citas del día</div>
          <div className="text-4xl font-bold text-blue-700">{kpis.total_citas_hoy}</div>
        </div>

        <div className="p-6 bg-purple-50 border border-purple-200 rounded-xl shadow-sm">
          <div className="text-lg font-semibold">🎥 Videoconferencia</div>
          <div className="text-4xl font-bold text-purple-700">{kpis.vc_hoy}</div>
        </div>

        <div className="p-6 bg-green-50 border border-green-200 rounded-xl shadow-sm">
          <div className="text-lg font-semibold">📍 Presencial</div>
          <div className="text-4xl font-bold text-green-700">{kpis.presencial_hoy}</div>
        </div>
      </div>

      {/* 🔍 FILTROS */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h3 className="text-xl font-bold" style={{ color: "#1F3A5F" }}>Filtros</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Buscar…"
            className="border p-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={filtroFirma}
            onChange={(e) => setFiltroFirma(e.target.value)}
          >
            <option value="TODAS">Todas las firmas</option>
            <option value="VC">Videoconferencia</option>
            <option value="PRESENCIAL">Presencial</option>
          </select>

          <select
            className="border p-2 rounded"
            value={filtroNotario}
            onChange={(e) => setFiltroNotario(e.target.value)}
          >
            <option value="TODOS">Todos los notarios</option>
            {citas_dia.map((c) =>
              c.notario ? (
                <option key={c.notario.id} value={c.notario.id}>
                  {c.notario.nombre} {c.notario.apellidos}
                </option>
              ) : null
            )}
          </select>

          <select
            className="border p-2 rounded"
            value={filtroApoderado}
            onChange={(e) => setFiltroApoderado(e.target.value)}
          >
            <option value="TODOS">Todos los apoderados</option>
            {citas_dia.map((c) =>
              c.apoderado ? (
                <option key={c.apoderado.id} value={c.apoderado.id}>
                  {c.apoderado.nombre} {c.apoderado.apellidos}
                </option>
              ) : null
            )}
          </select>
        </div>

        <button
          onClick={exportarExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          📄 Exportar a Excel
        </button>
      </div>

      {/* 📅 TABLA */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-xl font-bold mb-4" style={{ color: "#1F3A5F" }}>
          Citas del día
        </h3>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border cursor-pointer" onClick={() => ordenar("fecha")}>
                Fecha {iconoOrden("fecha")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => ordenar("hora_inicio")}>
                Hora {iconoOrden("hora_inicio")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => ordenar("tipo_cita")}>
                Tipo {iconoOrden("tipo_cita")}
              </th>
              <th className="p-2 border">Notario</th>
              <th className="p-2 border">Apoderado</th>
              <th className="p-2 border cursor-pointer" onClick={() => ordenar("vc")}>
                Firma {iconoOrden("vc")}
              </th>
            </tr>
          </thead>

          <tbody>
            {citasPagina.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No hay citas hoy
                </td>
              </tr>
            ) : (
              citasPagina.map((cita) => (
                <tr key={cita.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{cita.fecha}</td>
                  <td className="p-2 border">
                    {cita.hora_inicio} - {cita.hora_fin}
                  </td>
                  <td className="p-2 border">{cita.tipo_cita}</td>
                  <td className="p-2 border">
                    {cita.notario ? `${cita.notario.nombre} ${cita.notario.apellidos}` : "—"}
                  </td>
                  <td className="p-2 border">
                    {cita.apoderado ? `${cita.apoderado.nombre} ${cita.apoderado.apellidos}` : "—"}
                  </td>
                  <td className="p-2 border">
                    {cita.vc === "SI" ? "🎥 Videoconferencia" : "📍 Presencial"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <span>Página {page} de {totalPaginas}</span>

          <button
            disabled={page === totalPaginas}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* 📊 GRÁFICO ACTIVIDAD */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-xl font-bold mb-4" style={{ color: "#1F3A5F" }}>
          Actividad semanal
        </h3>
        <canvas id="graficoActividad" height="120"></canvas>
      </div>

      {/* 👤 Firmas por apoderado */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-xl font-bold mb-4" style={{ color: "#1F3A5F" }}>
          Firmas por apoderado
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {por_apoderado.map((apo) => (
            <div
              key={apo.apoderado_id}
              className="p-4 border rounded-lg bg-gray-50 shadow-sm"
            >
              <div className="text-lg font-semibold mb-2">
                👤 {apo.nombre}
              </div>

              <div className="flex justify-between">
                <div>
                  <div className="font-bold">🎥 VC</div>
                  <div>Firmadas: {apo.videoconferencia.firmadas}</div>
                  <div>Pendientes: {apo.videoconferencia.pendientes}</div>
                </div>

                <div>
                  <div className="font-bold">📍 Presencial</div>
                  <div>Firmadas: {apo.presencial.firmadas}</div>
                  <div>Pendientes: {apo.presencial.pendientes}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
