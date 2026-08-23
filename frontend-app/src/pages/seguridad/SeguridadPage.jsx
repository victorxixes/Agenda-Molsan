
import React, { useEffect } from "react";
import { useSeguridadStore } from "../../store/seguridadStore";
import { useSistemaStore } from "../../store/sistemaStore";

import GlassCard from "../../components/ui/GlassCard.jsx";
import GlassSectionTitle from "../../components/ui/GlassSectionTitle.jsx";
import IconSeguridad from "../../components/icons/IconSeguridad.jsx";
import IconSistema from "../../components/icons/IconSistema.jsx";
import SeguridadRealtime from "../../components/realtime/SeguridadRealtime.jsx";

export default function SeguridadPage() {
  const { eventos, cargarEventos, loading } = useSeguridadStore();
  const {
    estado,
    info,
    cargarEstado,
    cargarInfo,
    loading: loadingSistema,
  } = useSistemaStore();

  useEffect(() => {
    cargarEventos();
    cargarEstado();
    cargarInfo();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h2
        className="text-3xl font-bold flex items-center gap-3"
        style={{ color: "#1F3A5F" }}
      >
        <IconSeguridad size={30} />
        Seguridad del Sistema
      </h2>

      <GlassSectionTitle
        icon={<IconSistema size={26} />}
        title="Estado del Sistema"
      />

      {loadingSistema && (
        <GlassCard className="p-4 text-center">
          <p className="text-neutral-600">Cargando estado del sistema…</p>
        </GlassCard>
      )}

      {!loadingSistema && estado && (
        <GlassCard className="p-6 space-y-2">
          <p className="text-lg font-bold" style={{ color: "#1F3A5F" }}>
            {estado.message}
          </p>
          <p className="text-sm text-neutral-600">
            Última actualización: {new Date(estado.fecha).toLocaleString()}
          </p>
        </GlassCard>
      )}

      {info && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-4">
            <p className="text-xl font-bold" style={{ color: "#1F3A5F" }}>
              Versión del ERP
            </p>
            <p className="text-2xl">{info.version}</p>
          </GlassCard>

          <GlassCard className="p-4">
            <p className="text-xl font-bold" style={{ color: "#1F3A5F" }}>
              Servicios activos
            </p>
            <p className="text-2xl">{info.servicios_activos}</p>
          </GlassCard>

          <GlassCard className="p-4">
            <p className="text-xl font-bold" style={{ color: "#1F3A5F" }}>
              Módulos instalados
            </p>
            <p className="text-2xl">{info.modulos.length}</p>
          </GlassCard>

          <GlassCard className="p-4">
            <p className="text-xl font-bold" style={{ color: "#1F3A5F" }}>
              Último reinicio
            </p>
            <p className="text-2xl">
              {new Date(info.ultimo_reinicio).toLocaleString()}
            </p>
          </GlassCard>
        </div>
      )}

      <GlassSectionTitle
        icon={<IconSeguridad size={26} />}
        title="Eventos de seguridad"
      />

      <SeguridadRealtime />

      {loading && (
        <GlassCard className="p-4 text-center">
          <p className="text-neutral-600">Cargando eventos de seguridad…</p>
        </GlassCard>
      )}

      {!loading && eventos.length === 0 && (
        <GlassCard className="p-4 text-center">
          <p className="text-neutral-600">No hay eventos registrados.</p>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {eventos.map((e) => (
          <GlassCard key={e.id} className="p-4 space-y-2">
            <p className="text-xl font-bold" style={{ color: "#1F3A5F" }}>
              {e.tipo.toUpperCase()}
            </p>
            <p className="text-sm" style={{ color: "#6A7A8C" }}>
              {e.descripcion || "Sin descripción"}
            </p>
            <p className="text-xs text-neutral-500">
              {new Date(e.fecha).toLocaleString()}
            </p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
