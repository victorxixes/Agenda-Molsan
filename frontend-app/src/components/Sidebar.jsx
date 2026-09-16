import { NavLink } from "react-router-dom";
import { useState } from "react";
import { puedeVerModulo } from "../utils/permisos";
import { useAuthStore } from "../store/authStore";

const Icon = ({ name, active }) => (
  <svg
    className={`
      w-5 h-5 min-w-[20px] transition-colors
      ${active ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}
    `}
  >
    <use href={`/icons/icons.svg#${name}`} />
  </svg>
);

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [fixed, setFixed] = useState(false);

  const empleado = useAuthStore((s) => s.empleado);
  const setPerfilModal = useAuthStore((s) => s.setPerfilModal);

  const safeUser = empleado || {
    nombre: "Usuario",
    foto: "/icons/user-default.png",
    id: 0,
  };

  const item = (to, label, iconName) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
        ${isActive ? "bg-blue-100 text-blue-700 shadow-sm" : "text-gray-700 hover:bg-gray-100"}
        ${collapsed ? "justify-center" : ""}
        `
      }
    >
      <Icon name={iconName} active={isActive} />
      {!collapsed && <span className="whitespace-nowrap font-medium">{label}</span>}
    </NavLink>
  );

  return (
    <aside
      className={`
        bg-white border-r shadow-sm p-4 space-y-4 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
      onMouseEnter={() => !fixed && setCollapsed(false)}
      onMouseLeave={() => !fixed && setCollapsed(true)}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        {!collapsed && <h2 className="text-xl font-bold text-gray-800">Agenda Molsan</h2>}

        <button
          onClick={() => setFixed(!fixed)}
          className="p-2 rounded hover:bg-gray-200 transition"
        >
          <Icon name={fixed ? "pin-off" : "pin"} active={false} />
        </button>
      </div>

      {/* NAV */}
      <nav className="space-y-2">
        {item("/dashboard", "Dashboard", "home")}
        {puedeVerModulo("agenda") && item("/agenda", "Agenda", "calendar")}
        {puedeVerModulo("empleados") && item("/panel/empleados", "Empleados", "user-group")}
        {puedeVerModulo("intranet") && item("/intranet", "Intranet", "globe")}
        {puedeVerModulo("mensajes") && item("/mensajes", "Mensajes", "chat")}
        {puedeVerModulo("logs") && item("/logs", "Logs", "clipboard")}
        {puedeVerModulo("seguridad") && item("/seguridad", "Seguridad", "shield")}
      </nav>

      {/* PERFIL */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
          onClick={() => setPerfilModal(safeUser.id)}
          className={`
            flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
            text-gray-700 hover:bg-gray-100 w-full
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-300 shadow-sm">
            <img
              src={safeUser.foto || "/icons/user-default.png"}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full"></span>
          </div>

          {!collapsed && (
            <div className="flex flex-col">
              <span className="whitespace-nowrap font-semibold text-gray-800">
                {safeUser.nombre}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                Online
              </span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
