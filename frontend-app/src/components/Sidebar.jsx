import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { puedeVerModulo } from "../utils/permisos";
import { useAuthStore } from "../store/authStore";

// Iconos desde sprite SVG
const Icon = ({ name }) => (
  <svg className="w-5 h-5 min-w-[20px]">
    <use href={`/icons/icons.svg#${name}`} />
  </svg>
);

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [fixed, setFixed] = useState(false);

  const navigate = useNavigate();
  const { usuario } = useAuthStore();

  // Protección: si usuario aún no está cargado
  const safeUser = usuario || {
    nombre: "Usuario",
    foto: "/icons/user-default.png",
    online: false,
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
      {/* Botón fijar */}
      <div className="flex items-center justify-between mb-4">
        {!collapsed && (
          <h2 className="text-xl font-bold">Agenda Molsan</h2>
        )}

        <button
          onClick={() => setFixed(!fixed)}
          className="p-2 rounded hover:bg-gray-200 transition"
          title={fixed ? "Desfijar sidebar" : "Fijar sidebar"}
        >
          <Icon name={fixed ? "pin-off" : "pin"} />
        </button>
      </div>

      <nav className="space-y-2">

        {/* ⭐ SECCIÓN: General */}
        {!collapsed && (
          <p className="text-xs text-gray-400 uppercase tracking-wide px-2">
            General
          </p>
        )}

        {item("/dashboard", "Dashboard", "home")}

        {/* ⭐ SECCIÓN: Agenda */}
        {!collapsed && (
          <p className="text-xs text-gray-400 uppercase tracking-wide px-2 mt-4">
            Agenda
          </p>
        )}

        {puedeVerModulo("agenda") && item("/agenda", "Agenda", "calendar")}
        {puedeVerModulo("mis-visitas") && item("/agenda/mis-visitas", "Mis visitas", "visit")}

        {/* ⭐ SECCIÓN: Gestión */}
        {!collapsed && (
          <p className="text-xs text-gray-400 uppercase tracking-wide px-2 mt-4">
            Gestión
          </p>
        )}

        {puedeVerModulo("empleados") && item("/panel/empleados", "Empleados", "user-group")}
        {puedeVerModulo("ctn") && item("/ctn", "CTN", "globe")}

        {/* ⭐ SOLO INTRANET */}
        {puedeVerModulo("intranet") && item("/intranet", "Intranet", "globe")}

        {/* ⭐ SECCIÓN: Comunicación */}
        {!collapsed && (
          <p className="text-xs text-gray-400 uppercase tracking-wide px-2 mt-4">
            Comunicación
          </p>
        )}

        {puedeVerModulo("mensajes") && item("/mensajes", "Mensajes", "chat")}

        {/* ⭐ SECCIÓN: Sistema */}
        {!collapsed && (
          <p className="text-xs text-gray-400 uppercase tracking-wide px-2 mt-4">
            Sistema
          </p>
        )}

        {puedeVerModulo("logs") && item("/logs", "Logs", "clipboard")}
        {puedeVerModulo("seguridad") && item("/seguridad", "Seguridad", "shield")}
        {puedeVerModulo("utilidades") && item("/herramientas/utilidades", "Utilidades", "cog")}
        {puedeVerModulo("inicializacion") &&
          item("/utilidades/inicializacion", "Inicialización", "refresh")}
      </nav>

      {/* ⭐ PERFIL DEL USUARIO */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate(`/panel/empleados/${safeUser.id}`)}
          className={`
            flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
            text-gray-700 hover:bg-gray-100 w-full
            ${collapsed ? "justify-center" : ""}
          `}
        >
          {/* FOTO DEL USUARIO */}
          <img
            src={safeUser.foto || "/icons/user-default.png"}
            alt="Foto usuario"
            className="w-8 h-8 rounded-full object-cover border border-gray-300"
          />

          {/* TEXTO + ESTADO SOLO SI NO ESTÁ COLAPSADO */}
          {!collapsed && (
            <div className="flex flex-col">
              <span className="whitespace-nowrap font-medium">
                {safeUser.nombre}
              </span>

              {/* ESTADO ONLINE/OFFLINE */}
              <span className="text-xs flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    safeUser.online ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
                {safeUser.online ? "Online" : "Offline"}
              </span>
            </div>
          )}
        </button>
      </div>

    </aside>
  );
}
