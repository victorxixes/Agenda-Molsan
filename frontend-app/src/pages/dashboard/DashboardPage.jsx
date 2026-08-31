import React, { useEffect } from "react";
import { useDashboardStore } from "../../store/dashboardStore";

import CitasHoyList from "../../components/dashboard/CitasHoyList.jsx";

export default function DashboardPage() {
  const { resumen, cargarResumen } = useDashboardStore();

  useEffect(() => {
    cargarResumen();
  }, []);

  if (!resumen) return "Cargando dashboard...";

  const citasHoy = resumen.citas_dia || [];

  // KPIs calculados automáticamente
  const totalVC = citasHoy.filter((c) => c.vc === "SI").length;
  const totalPresencial = citasHoy.filter((c) => c.vc === "NO").length;

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold" style={{ color: "#1F3A5F" }}>
        Dashboard de Firmas
      </h2>

      {/* 🔥 Tarjetas KPI arriba del dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
          <div className="text-lg font-semibold">🎥 Videoconferencia</div>
          <div className="text-4xl font-bold text-blue-700">{totalVC}</div>
        </div>

        <div className="p-6 bg-green-50 border border-green-200 rounded-xl shadow-sm">
          <div className="text-lg font-semibold">📍 Presencial</div>
          <div className="text-4xl font-bold text-green-700">{totalPresencial}</div>
        </div>
      </div>

      {/* 🔥 Tabla de citas del día */}
      <CitasHoyList />
    </div>
  );
}
