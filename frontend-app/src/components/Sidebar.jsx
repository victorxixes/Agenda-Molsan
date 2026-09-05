import { NavLink } from "react-router-dom";
import { puedeVerModulo } from "../utils/permisos";

// Componente Icon que usa el sprite icons.svg
const Icon = ({ name }) => (
  <svg className="w-5 h-5">
    <use href={`/icons/icons.svg#${name}`} />
  </svg>
);

export default function Sidebar() {
  const item = (to, label, iconName) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition
        ${isActive ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`
      }
    >
      <Icon name={iconName} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <aside className="w-64 bg-white border-r shadow-sm p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">ERP Molsan 2026</h2>

      <nav className="space-y-2">

        {item("/dashboard", "Dashboard", "home")}

        {puedeVerModulo("agenda") && item("/agenda", "Agenda", "calendar")}
        {puedeVerModulo("mis-visitas") && item("/agenda/mis-visitas", "Mis visitas", "visit")}

        {puedeVerModulo("empleados") && item("/panel/empleados", "Empleados", "user-group")}

        {puedeVerModulo("ctn") && item("/ctn", "CTN", "globe")}

        {puedeVerModulo("intranet") && item("/intranet", "Intranet", "globe")}
        {puedeVerModulo("documentos") && item("/intranet/documentos", "Documentos", "document")}
        {puedeVerModulo("noticias") && item("/intranet/noticias", "Noticias", "news")}

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
