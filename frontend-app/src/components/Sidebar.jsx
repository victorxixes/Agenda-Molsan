import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { puedeVerModulo } from "../utils/permisos";
import { useAuthStore } from "../store/authStore";

const Icon = ({ name }) => (
  <svg className="w-5 h-5 min-w-[20px]">
    <use href={`/icons/icons.svg#${name}`} />
  </svg>
);

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [fixed, setFixed] = useState(false);

  const navigate = useNavigate();

  const empleado = useAuthStore((s) => s.empleado);

  const safeUser = empleado || {
    nombre: "Usuario",
    foto: "/icons/user-default.png",
    id: 0,
  };

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
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
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
      <div className="flex items-center justify-between mb-4">
        {!collapsed && <h2 className="text-xl font-bold">Agenda Molsan</h2>}

        <button
          onClick={() => setFixed(!fixed)}
          className="p-2 rounded hover:bg-gray-200 transition"
        >
          <Icon name={fixed ? "pin-off" : "pin"} />
        </button>
      </div>

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
          onClick={() => navigate(`/panel/empleados/${safeUser.id}`)}
          className={`
            flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
            text-gray-700 hover:bg-gray-100 w-full
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <img
            src={safeUser.foto || "/icons/user-default.png"}
            className="w-8 h-8 rounded-full object-cover border border-gray-300"
          />

          {!collapsed && (
            <div className="flex flex-col">
              <span className="whitespace-nowrap font-medium">{safeUser.nombre}</span>
              <span className="text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Online
              </span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
