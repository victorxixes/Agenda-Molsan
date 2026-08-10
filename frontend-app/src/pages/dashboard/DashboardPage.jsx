import React, { useEffect, useState } from "react";
import { useDashboardStore } from "../../store/dashboardStore";
import { useEmpleadosStore } from "../../store/empleadosStore";

// ICONOS GLASS PREMIUM SJ
import IconAgenda from "../../components/icons/IconAgenda.jsx";
import IconEmpleados from "../../components/icons/IconEmpleados.jsx";
import IconMensajes from "../../components/icons/IconMensajes.jsx";
import IconIntranet from "../../components/icons/IconIntranet.jsx";
import IconLogs from "../../components/icons/IconLogs.jsx";

// Nuevo componente KPI
import KpiCard from "../../components/dashboard/KpiCard.jsx";

import ChartFirmasMes from "../../components/dashboard/ChartFirmasMes.jsx";

export default function DashboardPage() {
  const { data, cargarDashboard } = useDashboardStore();
  const { empleados, cargarEmpleados } = useEmpleadosStore();

  const [empleadoId, setEmpleadoId] = useState("");

  useEffect(() => {
    cargarEmpleados();               // 🔥 CLAVE: carga empleados antes del dashboard
    cargarDashboard(empleadoId || null);
  }, [empleadoId]);

  // Si no hay datos aún → mostramos loading
  if (!data) return "Cargando dashboard...";

  // Protecciones para evitar errores
  const agenda = data.agenda || {};
  const empleadosData = data.empleados || {};
  const mensajes = data.mensajes || {};
  const actividad = data.actividad || {};
  const ctn = data.ctn || {};

  // Protección total para empleados (evita el error del selector)
  const safeEmpleados = Array.isArray(empleados) ? empleados : [];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold" style={{ color: "#1F3A5F" }}>
        Dashboard
      </h2>

      {/* SELECTOR DE EMPLEADO */}
      <div className="my-4">
        <label className="block mb-2 font-semibold" style={{ color: "#1F3A5F" }}>
          Filtrar por empleado:
        </label>

        <select
          className="border p-2 rounded mb-4"
          value={empleadoId}
          onChange={(e) => setEmpleadoId(e.target.value)}
        >
          <option value="">Todos los empleados</option>

          {safeEmpleados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* ============================
          AGENDA
      ============================ */}
      <h3 style={{ color: "#1F3A5F" }}>Agenda</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Citas hoy" value={agenda.citas_hoy ?? 0} icon={<IconAgenda size={28} />} />
        <KpiCard title="Citas semana" value={agenda.citas_semana ?? 0} icon={<IconAgenda size={28} />} />

        <KpiCard title="Firmas VC hoy" value={agenda.firmas_hoy?.vc ?? 0} icon={<IconAgenda size={28} />} />
        <KpiCard title="Firmas Presenciales hoy" value={agenda.firmas_hoy?.p ?? 0} icon={<IconAgenda size={28} />} />

        <KpiCard title="Firmas VC semana" value={agenda.firmas_semana?.vc ?? 0} icon={<IconAgenda size={28} />} />
        <KpiCard title="Firmas Presenciales semana" value={agenda.firmas_semana?.p ?? 0} icon={<IconAgenda size={28} />} />
      </div>

      <ChartFirmasMes data={Array.isArray(agenda.firmas_por_mes) ? agenda.firmas_por_mes : []} />

      {/* ============================
          EMPLEADOS
      ============================ */}
      <h3 style={{ color: "#1F3A5F" }}>Empleados</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Total empleados" value={empleadosData.total ?? 0} icon={<IconEmpleados size={28} />} />
        <KpiCard title="Activos" value={empleadosData.activos ?? 0} icon={<IconEmpleados size={28} />} />
      </div>

      {/* ============================
          MENSAJES
      ============================ */}
      <h3 style={{ color: "#1F3A5F" }}>Mensajes</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Mensajes hoy" value={mensajes.hoy ?? 0} icon={<IconMensajes size={28} />} />
        <KpiCard title="No leídos" value={mensajes.no_leidos ?? 0} icon={<IconMensajes size={28} />} />
      </div>

      {/* ============================
          ACTIVIDAD (LOGS)
      ============================ */}
      <h3 style={{ color: "#1F3A5F" }}>Actividad del sistema</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Actividad hoy" value={actividad.hoy ?? 0} icon={<IconLogs size={28} />} />
        <KpiCard title="Actividad semana" value={actividad.semana ?? 0} icon={<IconLogs size={28} />} />
      </div>

      {/* ============================
          CTN
      ============================ */}
      <h3 style={{ color: "#1F3A5F" }}>CTN</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Notarios" value={ctn.notarios ?? 0} icon={<IconIntranet size={28} />} />
        <KpiCard title="Zonas" value={ctn.zonas ?? 0} icon={<IconIntranet size={28} />} />
        <KpiCard title="Firmas CTN" value={ctn.firmas ?? 0} icon={<IconIntranet size={28} />} />
      </div>
    </div>
  );
}
