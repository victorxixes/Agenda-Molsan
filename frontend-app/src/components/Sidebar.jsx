import { NavLink } from "react-router-dom";
import { puedeVerModulo } from "../utils/permisos";

// Icono placeholder temporal
const PlaceholderIcon = () => (
  <div className="w-5 h-5 bg-gray-300 rounded" />
);

export default function Sidebar() {
  const item = (to, label) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition
        ${isActive ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`
      }
    >
      <PlaceholderIcon />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <aside className="w-64 bg-white border-r shadow-sm p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">ERP Molsan 2026</h2>

      <nav className="space-y-2">

        {item("/dashboard", "Dashboard")}

        {puedeVerModulo("agenda") && item("/agenda", "Agenda")}
        {puedeVerModulo("mis-visitas") && item("/agenda/mis-visitas", "Mis visitas")}

        {puedeVerModulo("empleados") && item("/panel/empleados", "Empleados")}

        {puedeVerModulo("ctn") && item("/ctn", "CTN")}

        {puedeVerModulo("intranet") && item("/intranet", "Intranet")}
        {puedeVerModulo("documentos") && item("/intranet/documentos", "Documentos")}
        {puedeVerModulo("noticias") && item("/intranet/noticias", "Noticias")}

        {puedeVerModulo("mensajes") && item("/mensajes", "Mensajes")}

        {puedeVerModulo("herramientas") && item("/herramientas", "Herramientas")}

        {puedeVerModulo("logs") && item("/logs", "Logs")}

        {puedeVerModulo("seguridad") && item("/seguridad", "Seguridad")}

        {puedeVerModulo("utilidades") && item("/utilidades", "Utilidades")}
        {puedeVerModulo("inicializacion") &&
          item("/utilidades/inicializacion", "Inicialización")}
      </nav>
    </aside>
  );
}
