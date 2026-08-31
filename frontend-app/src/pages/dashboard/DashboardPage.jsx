import React, { useEffect } from "react";
import { useDashboardStore } from "../../store/dashboardStore";

import CitasHoyList from "../../components/dashboard/CitasHoyList.jsx";
import AgendaSection from "../../components/agenda/AgendaSection.jsx";

export default function DashboardPage() {
  const { resumen, cargarResumen } = useDashboardStore();

  useEffect(() => {
    cargarResumen();
  }, []);

  if (!resumen) return "Cargando dashboard...";

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold" style={{ color: "#1F3A5F" }}>
        Dashboard de Firmas
      </h2>

      {/* 🔥 Solo dejamos la tabla de citas del día */}
      <AgendaSection title="Citas del día">
        <CitasHoyList />
      </AgendaSection>

      {/* Si en el futuro quieres añadir más secciones del dashboard,
          puedes hacerlo aquí sin afectar la tabla */}
    </div>
  );
}
