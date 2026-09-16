import { NavLink } from "react-router-dom";
import { useState } from "react";
import { puedeVerModulo } from "../utils/permisos";
import { useAuthStore } from "../store/authStore";
import { useMensajesStore } from "../store/mensajesStore";

const IconRound = ({ name, active }) => (
  <div
    className={`
      w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300
      ${active
        ? "bg-blue-600 text-white shadow-lg scale-110"
        : "bg-gray-200 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 group-hover:scale-105"}
    `}
  >
    <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6">
      <use href={`/icons/icons.svg#${name}`} />
    </svg>
  </div>
);

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [fixed, setFixed] = useState(false);

  const empleado = useAuthStore((s) => s.empleado);
  const setPerfilModal = useAuthStore((s) => s.setPerfilModal);

  const mensajesNoLeidos = useMensajesStore((s) => s.noLeidosTotal || 0);

  const safeUser = empleado || {
    nombre: "Usuario",
    foto: "/icons/user-default.png",
    id: 0,
  };

  const item = (to, label, iconName, badge = 0) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        group flex items-center gap-4 px-3 py-2 rounded-xl transition-all duration-300
        ${isActive ? "bg-blue-100 text-blue-700 shadow-sm" : "text-gray-700 hover:bg-gray-100"}
        ${collapsed ? "justify-center" : ""}
        `
      }
    >
      {({ isActive }) => (
        <>
          <IconRound name={iconName} active={isActive} />

          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="font-medium">{label}</span>

              {badge > 0 && (
                <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full shadow animate-pulse">
                  {badge}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <aside
      className={`
        backdrop-blur-xl bg-white/70 border-r shadow-lg p-4 space-y-6 transition-all duration-300
        ${collapsed ? "w-24" : "w-72"}
      `}
      onMouseEnter={() => !fixed && setCollapsed(false)}
      onMouseLeave={() => !fixed && setCollapsed(true)}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        {!collapsed && (
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Agenda Molsan
          </h2>
        )}

        <button
          onClick={() => setFixed(!fixed)}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <svg className="w-5 h-5 text-gray-600">
            <use href={`/icons/icons.svg#${fixed ? "pin-off" : "pin"}`} />
          </svg>
        </button>
      </div>

      {/* MINI AVATAR CUANDO ESTÁ COLAPSADO */}
      {collapsed && (
        <div className="flex justify-center mb-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-300 shadow-md animate-[fadeIn_0.4s_ease]">
            <img
              src={safeUser.foto || "/icons/user-default.png"}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border border-white rounded-full"></span>
          </div>
        </div>
      )}

      {/* SECCIÓN: GENERAL */}
      {!collapsed && (
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
          General
        </h3>
      )}

      <nav className="space-y-2">
        {item("/dashboard", "Dashboard", "home")}
        {puedeVerModulo("agenda") && item("/agenda", "Agenda", "calendar")}
      </nav>

      {/* SECCIÓN: GESTIÓN */}
      {!collapsed && (
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mt-4">
          Gestión
        </h3>
      )}

      <nav className="space-y-2">
        {puedeVerModulo("empleados") &&
          item("/panel/empleados", "Empleados", "user-group")}
        {puedeVerModulo("intranet") &&
          item("/intranet", "Intranet", "globe")}
        {puedeVerModulo("mensajes") &&
          item("/mensajes", "Mensajes", "chat", mensajesNoLeidos)}
      </nav>

      {/* SECCIÓN: SISTEMA */}
      {!collapsed && (
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mt-4">
          Sistema
        </h3>
      )}

      <nav className="space-y-2">
        {puedeVerModulo("logs") && item("/logs", "Logs", "clipboard")}
        {puedeVerModulo("seguridad") && item("/seguridad", "Seguridad", "shield")}
      </nav>

      {/* PERFIL */}
      {!collapsed && (
        <div className="mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={() => setPerfilModal(safeUser.id)}
            className={`
              flex items-center gap-4 px-3 py-2 rounded-xl transition-all duration-300
              text-gray-700 hover:bg-gray-100 w-full
            `}
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-300 shadow-md">
              <img
                src={safeUser.foto || "/icons/user-default.png"}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border border-white rounded-full"></span>
            </div>

            <div className="flex flex-col">
              <span className="whitespace-nowrap font-semibold text-gray-800">
                {safeUser.nombre}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                Online
              </span>
            </div>
          </button>
        </div>
      )}
    </aside>
  );
}
