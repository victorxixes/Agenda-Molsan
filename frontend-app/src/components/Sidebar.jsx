import { NavLink } from "react-router-dom";
import { useState } from "react";
import { puedeVerModulo } from "../utils/permisos";

// Iconos desde sprite SVG
const Icon = ({ name }) => (
  <svg className="w-5 h-5 min-w-[20px]">
    <use href={`/icons/icons.svg#${name}`} />
  </svg>
);

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  const item = (to, label, iconName) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
        ${isActive ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}
        ${collapsed ? "justify-center" : ""}
        `
      }
    >
      <Icon name={iconName} />

      {/* Ocultar texto cuando está colapsado */}
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </NavLink>
  );

  return (
    <aside
      className={`
        bg-white border-r shadow-sm p-4 space-y-4 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      {/* Título */}
      <h2
        className={`
          text-xl font-bold mb-4 transition-opacity duration-300
          ${collapsed ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        Agenda Molsan
      </h2>

      <nav className="space-y-2">

        {item("/dashboard", "Dashboard", "home")}

        {puedeVerModulo("agenda") && item("/agenda", "Agenda", "calendar")}
        {puedeVerModulo("mis-visitas") && item("/agenda/mis-visitas", "Mis visitas", "visit")}

        {puedeVerModulo("empleados") && item("/panel/empleados", "Empleados", "user-group")}

        {puedeVerModulo("ctn") && item("/ctn", "CTN", "globe")}

        {/* ⭐ SOLO INTRANET */}
        {puedeVerModulo("intranet") && item("/intranet", "Intranet", "globe")}

        {/* ❌ Documentos y Noticias eliminados del sidebar */}
        {/* Se gestionan dentro del módulo Intranet */}

        {puedeVerModulo("mensajes") && item("/mensajes", "Mensajes", "chat")}

        {puedeVerModulo("herramientas") && item("/herramientas", "Herramientas", "tools")}

        {puedeVerModulo("logs") && item("/logs", "Logs", "clipboard")}

        {puedeVerModulo("seguridad") && item("/seguridad", "Seguridad", "shield")}

        {puedeVerModulo("utilidades") && item("/utilidades", "Utilidades", "cog")}
        {puedeVerModulo("inicializacion") &&
          item("/utilidades/inicializacion", "Inicialización", "refresh")}
      </nav>
    </aside>
  );
}
