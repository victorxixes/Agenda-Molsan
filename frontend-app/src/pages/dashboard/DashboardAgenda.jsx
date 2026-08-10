import React, { useEffect } from "react";
import { useDashboardAgendaStore } from "../../store/dashboardAgendaStore";

import KPICard from "../../components/dashboard/KPICard";
import GlassCard from "../../components/ui/GlassCard";
import CitasProvinciaChart from "../../components/dashboard/CitasProvinciaChart";
import CitasHoraChart from "../../components/dashboard/CitasHoraChart";

import IconAgenda from "../../components/icons/IconAgenda";
import IconClock from "../../components/icons/IconClock";
import IconFirma from "../../components/icons/IconFirma";
import IconFirmaPend from "../../components/icons/IconFirmaPend";

export default function DashboardAgenda() {
  const { kpi, cargarKPIs } = useDashboardAgendaStore();

  useEffect(() => {
    cargarKPIs();
  }, []);

  return (
    <div className="p-4 space-y-4">

      {/* KPIs principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard title="Citas del día" value={kpi.citasHoy} icon={<IconAgenda />} compact />
        <KPICard title="Citas pendientes" value={kpi.citasPendientes} icon={<IconClock />} compact />
        <KPICard title="Firmas hechas" value={kpi.firmasHechas} icon={<IconFirma />} compact />
        <KPICard title="Firmas pendientes" value={kpi.firmasPendientes} icon={<IconFirmaPend />} compact />
      </div>

      {/* Tipo de firma */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GlassCard className="p-3 min-h-[90px]">
          <h3 className="text-lg mb-2">Firmas Presenciales</h3>
          <p>Hechas: {kpi.presencialesHechas}</p>
          <p>Pendientes: {kpi.presencialesPendientes}</p>
        </GlassCard>

        <GlassCard className="p-3 min-h-[90px]">
          <h3 className="text-lg mb-2">Firmas VC</h3>
          <p>Hechas: {kpi.vcHechas}</p>
          <p>Pendientes: {kpi.vcPendientes}</p>
        </GlassCard>
      </div>

      {/* Citas por provincia */}
      <GlassCard className="p-3 min-h-[200px]">
        <h3 className="text-lg mb-2">Citas por provincia</h3>
        <CitasProvinciaChart data={kpi.citasPorProvincia} />
      </GlassCard>

      {/* Citas por hora */}
      <GlassCard className="p-3 min-h-[200px]">
        <h3 className="text-lg mb-2">Citas por hora</h3>
        <CitasHoraChart data={kpi.citasPorHora} />
      </GlassCard>

    </div>
  );
}
