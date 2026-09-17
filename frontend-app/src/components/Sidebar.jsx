import { NavLink } from "react-router-dom";
import { useState, useMemo } from "react";
import { puedeVerModulo } from "../utils/permisos";
import { useAuthStore } from "../store/authStore";
import { useMensajesStore } from "../store/mensajesStore";

/**
 * Icono redondo SJ‑2026
 */
const IconRound = ({ name, active }) => (
  <div
    className={`
      w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300
      ${active
        ? "bg-blue-600 text-white shadow-lg scale-110"
        : "bg-white/10 text-white/70 backdrop-blur-sm border border-white/10 hover:bg-white/20 hover:text-white hover:scale-105"}
    `}
  >
    <svg className="w-5 h-5 transition-transform duration-300 hover:rotate-6">
      <use href={`/icons/icons.svg#${name}`} />
    </svg>
  </div>
);

/**
 * Item de navegación SJ‑2026
 */
const SidebarItem = ({ to, label, icon, collapsed, badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `
      group flex items-center gap-4 px-3 py-2 rounded-xl transition-all duration-300
      ${isActive ? "bg-white/20 text-white shadow-sm" : "text-white/80 hover:bg-white/10"}
      ${collapsed ? "justify-center" : ""}
      `
    }
  >
    {({ isActive }) => (
      <>
        <IconRound name={icon} active={isActive} />

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

/**
 * Sidebar SJ‑2026 Premium — Oculto + Glass + Hover Expand + Glow + Hotspot
 */
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [fixed, setFixed] = useState(false);

  const empleado = useAuthStore((s) => s.empleado);
  const logout = useAuthStore((s) => s.logout);
  const setPerfilModal = useAuthStore((s) => s.setPerfilModal);

  const mensajesNoLeidos = useMensajesStore((s) => s.noLeidosTotal || 0);

  const safeUser = useMemo(
    () =>
      empleado || {
        nombre: "Usuario",
        foto: "/icons/user-default.png",
        id: 0,
      },
    [empleado]
  );

  return (
    <>
      {/* ⭐ HOTSPOT — área invisible que activa el sidebar */}
      <div
        className="
          fixed left-0 top-0 h-full w-3 z-50
          cursor-pointer
        "
        onMouseEnter={() => !fixed && setCollapsed(false)}
      ></div>

      {/* ⭐ Glow lateral cuando está oculto */}
      {collapsed && (
        <div
          className="
            fixed left-0 top-0 h-full w-2 z-40
            bg-gradient-to-r from-blue-500/40 to-transparent
            animate-pulse
          "
        ></div>
      )}

      <aside
        className={`
          fixed left-0 top-0 h-full z-50
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-0 overflow-hidden" : "w-72 backdrop-blur-xl bg-white/10 border-r border-white/10 shadow-xl p-4 space-y-6"}
        `}
        onMouseLeave={() => !fixed && setCollapsed(true)}
      >

        {/* HEADER */}
        {!collapsed && (
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white tracking-tight drop-shadow">
              Agenda Molsan
            </h2>

            <button
              onClick={() => setFixed(!fixed)}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <svg className="w-5 h-5 text-white">
                <use href={`/icons/icons.svg#${fixed ? "pin-off" : "pin"}`} />
              </svg>
            </button>
          </div>
        )}

        {/* GENERAL */}
        {!collapsed && (
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider px-2">
            General
          </h3>
        )}

        <nav className="space-y-2">
          <SidebarItem to="/dashboard" label="Dashboard" icon="home" collapsed={collapsed} />
          {puedeVerModulo("agenda") && (
            <SidebarItem to="/agenda" label="Agenda" icon="calendar" collapsed={collapsed} />
          )}
        </nav>

        {/* GESTIÓN */}
        {!collapsed && (
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider px-2 mt-4">
            Gestión
          </h3>
        )}

        <nav className="space-y-2">
          {puedeVerModulo("empleados") && (
            <SidebarItem
              to="/panel/empleados"
              label="Empleados"
              icon="user-group"
              collapsed={collapsed}
            />
          )}

          {puedeVerModulo("ctn") && (
            <SidebarItem to="/ctn" label="CTN — Notarios" icon="globe" collapsed={collapsed} />
          )}

          {puedeVerModulo("intranet") && (
            <SidebarItem to="/intranet" label="Intranet" icon="globe" collapsed={collapsed} />
          )}

          {puedeVerModulo("mensajes") && (
            <SidebarItem
              to="/mensajes"
              label="Mensajes"
              icon="chat"
              collapsed={collapsed}
              badge={mensajesNoLeidos}
            />
          )}
        </nav>

        {/* SISTEMA */}
        {!collapsed && (
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider px-2 mt-4">
            Sistema
          </h3>
        )}

        <nav className="space-y-2">
          {puedeVerModulo("logs") && (
            <SidebarItem to="/logs" label="Logs" icon="clipboard" collapsed={collapsed} />
          )}

          {puedeVerModulo("seguridad") && (
            <SidebarItem to="/seguridad" label="Seguridad" icon="shield" collapsed={collapsed} />
          )}

          {puedeVerModulo("utilidades") && (
            <SidebarItem
              to="/herramientas/utilidades"
              label="Utilidades"
              icon="cog"
              collapsed={collapsed}
            />
          )}
        </nav>

        {/* PERFIL EXPANDIDO */}
        {!collapsed && (
          <div className="mt-auto pt-4 border-t border-white/10">
            <button
              onClick={() => setPerfilModal(safeUser.id)}
              className="
                flex items-center gap-4 px-3 py-2 rounded-xl transition-all duration-300
                text-white/80 hover:bg-white/10 w-full
              "
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20 shadow-lg">
                <img src={safeUser.foto} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border border-white rounded-full"></span>
              </div>

              <div className="flex flex-col">
                <span className="whitespace-nowrap font-semibold text-white">
                  {safeUser.nombre}
                </span>
                <span className="text-xs text-white/60 flex items-center gap-1">
                  Online
                </span>
              </div>
            </button>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="
                mt-3 flex items-center gap-3 px-3 py-2 rounded-xl w-full
                text-red-300 hover:bg-red-500/20 transition-all duration-300
                group
              "
            >
              <div
                className="
                  w-10 h-10 flex items-center justify-center rounded-xl
                  bg-red-500/20 text-red-300
                  group-hover:bg-red-500/30 group-hover:scale-105
                  transition-all duration-300
                "
              >
                <svg className="w-5 h-5">
                  <use href="/icons/icons.svg#logout" />
                </svg>
              </div>

              <span className="font-medium">Cerrar sesión</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
