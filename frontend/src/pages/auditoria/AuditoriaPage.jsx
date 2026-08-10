import React, { useEffect } from "react";
import { useAuditoriaStore } from "../../store/auditoriaStore";

import GlassCard from "../../components/ui/GlassCard.jsx";
import GlassSectionTitle from "../../components/ui/GlassSectionTitle.jsx";
import IconAuditoria from "../../components/icons/IconAuditoria.jsx";

export default function AuditoriaPage() {
  const { estado, metricas, cargarEstado, cargarMetricas } = useAuditoriaStore();

  useEffect(() => {
    cargarEstado();
    cargarMetricas();
  }, []);

  if (!estado || !metricas) {
    return (
      <div className="p-4">
        <GlassCard className="p-4 text-center">
          <p className="text-neutral-600">Cargando auditoría…</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Título principal */}
      <h2
        className="text-3xl font-bold flex items-center gap-3"
        style={{ color: "#1F3A5F" }}
      >
        <IconAuditoria size={30} />
        Auditoría del Sistema
      </h2>

      {/* Estado del sistema */}
      <GlassSectionTitle
        icon={<IconAuditoria size={26} />}
        title="Estado general"
      />

      <GlassCard className="p-6">
        <p className="text-lg" style={{ color: "#1F3A5F" }}>
          {estado.message}
        </p>
      </GlassCard>

      {/* Métricas */}
      <GlassSectionTitle
        icon={<IconAuditoria size={26} />}
        title="Métricas de auditoría"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-4">
          <p className="text-xl font-bold" style={{ color: "#1F3A5F" }}>
            Total registros
          </p>
          <p className="text-2xl">{metricas.total_registros}</p>
        </GlassCard>

        <GlassCard className="p-4">
          <p className="text-xl font-bold" style={{ color: "#1F3A5F" }}>
            Módulos con actividad
          </p>
          <p className="text-2xl">{metricas.por_modulo.length}</p>
        </GlassCard>

        <GlassCard className="p-4">
          <p className="text-xl font-bold" style={{ color: "#1F3A5F" }}>
            Tipos de acción
          </p>
          <p className="text-2xl">{metricas.por_accion.length}</p>
        </GlassCard>

        <GlassCard className="p-4">
          <p className="text-xl font-bold" style={{ color: "#1F3A5F" }}>
            Últimos logins
          </p>
          <p className="text-2xl">{metricas.ultimos_logins.length}</p>
        </GlassCard>
      </div>
    </div>
  );
}

