import { NavLink } from "react-router-dom";
import { puedeVerModulo } from "../utils/permisos";
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const item = (to, label, Icon) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition
        ${isActive ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`
      }
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <aside className="w-64 bg-white border-r shadow-sm p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">ERP Molsan 2026</h2>

      <nav className="space-y-2">

        {item("/dashboard", "Dashboard", HomeIcon)}

        {puedeVerModulo("agenda") && item("/agenda", "Agenda", CalendarIcon)}
        {puedeVerModulo("mis-visitas") && item("/agenda/mis-visitas", "Mis visitas", CalendarIcon)}

        {puedeVerModulo("empleados") && item("/panel/empleados", "Empleados", UserGroupIcon)}

        {puedeVerModulo("ctn") && item("/ctn", "CTN", GlobeAltIcon)}

        {puedeVerModulo("intranet") && item("/intranet", "Intranet", GlobeAltIcon)}
        {puedeVerModulo("documentos") && item("/intranet/documentos", "Documentos", DocumentIcon)}
        {puedeVerModulo("noticias") && item("/intranet/noticias", "Noticias", DocumentIcon)}

        {puedeVerModulo("mensajes") && item("/mensajes", "Mensajes", ChatBubbleLeftRightIcon)}

        {puedeVerModulo("herramientas") && item("/herramientas", "Herramientas", WrenchScrewdriverIcon)}

        {puedeVerModulo("logs") && item("/logs", "Logs", ClipboardDocumentListIcon)}

        {puedeVerModulo("seguridad") && item("/seguridad", "Seguridad", ShieldCheckIcon)}

        {puedeVerModulo("utilidades") && item("/utilidades", "Utilidades", Cog6ToothIcon)}
        {puedeVerModulo("inicializacion") &&
          item("/utilidades/inicializacion", "Inicialización", Cog6ToothIcon)}
      </nav>
    </aside>
  );
}
