import React, { useEffect } from "react";
import { useLogsStore } from "../../store/logsStore";

import LogsFilters from "../../components/logs/LogsFilters.jsx";
import LogsTable from "../../components/logs/LogsTable.jsx";

import GlassCard from "../../components/ui/GlassCard.jsx";
import GlassSectionTitle from "../../components/ui/GlassSectionTitle.jsx";
import IconSeguridad from "../../components/icons/IconSeguridad.jsx";

export default function LogsPage() {
  const { cargarLogs, loading } = useLogsStore();

  useEffect(() => {
    cargarLogs();
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Título principal */}
      <h1
        className="text-3xl font-bold flex items-center gap-3"
        style={{ color: "#1F3A5F" }}
      >
        <IconSeguridad size={30} />
        Actividad del sistema (Logs)
      </h1>

      {/* Sección filtros */}
      <GlassSectionTitle
        icon={<IconSeguridad size={26} />}
        title="Filtros de búsqueda"
      />

      <GlassCard className="p-4">
        <LogsFilters />
      </GlassCard>

      {/* Sección resultados */}
      <GlassSectionTitle
        icon={<IconSeguridad size={26} />}
        title="Resultados"
      />

      {loading && (
        <GlassCard className="p-4 text-center">
          <p className="text-neutral-600">Cargando logs…</p>
        </GlassCard>
      )}

      {!loading && (
        <GlassCard className="p-4">
          <LogsTable />
        </GlassCard>
      )}
    </div>
  );
}
