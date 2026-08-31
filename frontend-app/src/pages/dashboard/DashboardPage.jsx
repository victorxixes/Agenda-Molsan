import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("dashboard/full").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return <div>Cargando dashboard…</div>;

  const {
    kpis,
    citas_dia,
    por_apoderado,
  } = data;

  return (
    <div className="space-y-10 p-6">
      <h2 className="text-3xl font-bold" style={{ color: "#1F3A5F" }}>
        Dashboard de Firmas
      </h2>

      {/* 🔵 KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
          <div className="text-lg font-semibold">📅 Citas del día</div>
          <div className="text-4xl font-bold text-blue-700">
            {kpis.total_citas_hoy}
          </div>
        </div>

        <div className="p-6 bg-purple-50 border border-purple-200 rounded-xl shadow-sm">
          <div className="text-lg font-semibold">🎥 Videoconferencia</div>
          <div className="text-4xl font-bold text-purple-700">
            {kpis.vc_hoy}
          </div>
        </div>

        <div className="p-6 bg-green-50 border border-green-200 rounded-xl shadow-sm">
          <div className="text-lg font-semibold">📍 Presencial</div>
          <div className="text-4xl font-bold text-green-700">
            {kpis.presencial_hoy}
          </div>
        </div>
      </div>

      {/* 📅 Citas del día (tabla) */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-xl font-bold mb-4" style={{ color: "#1F3A5F" }}>
          Citas del día
        </h3>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Hora</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Notario</th>
              <th className="p-2 border">Apoderado</th>
              <th className="p-2 border">Firma</th>
            </tr>
          </thead>

          <tbody>
            {citas_dia.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No hay citas hoy
                </td>
              </tr>
            ) : (
              citas_dia.map((cita) => (
                <tr key={cita.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{cita.fecha}</td>
                  <td className="p-2 border">
                    {cita.hora_inicio} - {cita.hora_fin}
                  </td>
                  <td className="p-2 border">{cita.tipo_cita}</td>
                  <td className="p-2 border">
                    {cita.notario
                      ? `${cita.notario.nombre} ${cita.notario.apellidos}`
                      : "—"}
                  </td>
                  <td className="p-2 border">
                    {cita.apoderado
                      ? `${cita.apoderado.nombre} ${cita.apoderado.apellidos}`
                      : "—"}
                  </td>
                  <td className="p-2 border">
                    {cita.vc === "SI"
                      ? "🎥 Videoconferencia"
                      : "📍 Presencial"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
