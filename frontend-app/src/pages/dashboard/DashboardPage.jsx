import React, { useEffect } from "react";
import { useDashboardStore } from "../../store/dashboardStore";

// ICONOS
import IconAgenda from "../../components/icons/IconAgenda.jsx";
import IconEmpleados from "../../components/icons/IconEmpleados.jsx";
import IconMensajes from "../../components/icons/IconMensajes.jsx";
import IconLogs from "../../components/icons/IconLogs.jsx";

// COMPONENTES
import KpiCard from "../../components/dashboard/KpiCard.jsx";
import CitasHoyList from "../../components/dashboard/CitasHoyList.jsx";
import AgendaSection from "../../components/agenda/AgendaSection.jsx";

export default function DashboardPage() {
  const { resumen, cargarResumen } = useDashboardStore();

  useEffect(() => {
    cargarResumen();   // 🔥 carga /dashboard/resumen
  }, []);

  if (!resumen) return "Cargando dashboard...";

  const realizadas = resumen.firmas_realizadas;
  const pendientes = resumen.firmas_pendientes;
  const apoderados = resumen.por_apoderado;
  const citasHoy = resumen.citas_dia || [];

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold" style={{ color: "#1F3A5F" }}>
        Dashboard de Firmas
      </h2>

      {/* ============================
          CITAS DEL DÍA
      ============================ */}
      <AgendaSection title="Citas del día">
        <CitasHoyList
          citas={citasHoy}
          onEditar={(id) => console.log("Editar desde dashboard", id)}
        />
      </AgendaSection>

      {/* ============================
          FIRMAS REALIZADAS
      ============================ */}
      <h3 className="text-xl font-semibold" style={{ color: "#1F3A5F" }}>
        Firmas realizadas
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KpiCard
          title="Videoconferencia"
          value={realizadas.videoconferencia}
          icon={<IconAgenda size={28} />}
        />

        <KpiCard
          title="Presencial"
          value={realizadas.presencial}
          icon={<IconAgenda size={28} />}
        />
      </div>

      {/* ============================
          FIRMAS PENDIENTES
      ============================ */}
      <h3 className="text-xl font-semibold" style={{ color: "#1F3A5F" }}>
        Firmas pendientes
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KpiCard
          title="Videoconferencia"
          value={pendientes.videoconferencia}
          icon={<IconMensajes size={28} />}
        />

        <KpiCard
          title="Presencial"
          value={pendientes.presencial}
          icon={<IconMensajes size={28} />}
        />
      </div>

      {/* ============================
          FIRMAS POR APODERADO
      ============================ */}
      <h3 className="text-xl font-semibold" style={{ color: "#1F3A5F" }}>
        Firmas por apoderado
      </h3>

      <div className="space-y-6">
        {apoderados.map((apo) => (
          <div key={apo.apoderado_id} className="border p-4 rounded-lg shadow-sm">
            <h4 className="text-lg font-bold mb-3" style={{ color: "#1F3A5F" }}>
              {apo.nombre}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KpiCard
                title="Total firmadas"
                value={
                  apo.videoconferencia.firmadas +
                  apo.presencial.firmadas
                }
                icon={<IconEmpleados size={28} />}
              />

              <KpiCard
                title="VC (firmadas)"
                value={apo.videoconferencia.firmadas}
                icon={<IconAgenda size={28} />}
              />

              <KpiCard
                title="Presencial (firmadas)"
                value={apo.presencial.firmadas}
                icon={<IconAgenda size={28} />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <KpiCard
                title="VC (pendientes)"
                value={apo.videoconferencia.pendientes}
                icon={<IconMensajes size={28} />}
              />

              <KpiCard
                title="Presencial (pendientes)"
                value={apo.presencial.pendientes}
                icon={<IconMensajes size={28} />}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
