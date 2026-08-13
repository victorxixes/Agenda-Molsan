import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { connectEmpleados } from "../realtime/empleados";
import { connectIntranet } from "../realtime/intranet";
import { connectNotificaciones } from "../realtime/notificaciones";

import { useEmpleadosStore } from "../store/empleadosStore";
import { useAuthStore } from "../store/authStore";
import { useMensajesStore } from "../store/mensajesStore";
import { useIntranetStore } from "../store/intranetStore";

import IconAgenda from "../components/icons/IconAgenda";
import IconIntranet from "../components/icons/IconIntranet";
import IconEmpleados from "../components/icons/IconEmpleados";
import IconMensajes from "../components/icons/IconMensajes";
import IconSeguridad from "../components/icons/IconSeguridad";
import IconLogs from "../components/icons/IconLogs";
import IconAuditoria from "../components/icons/IconAuditoria";
import IconBase from "../components/icons/IconBase";
import IconCTN from "../components/icons/IconCTN";

export default function Sidebar() {
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();
  const { noLeidos = 0, cargarNoLeidos } = useMensajesStore();
  const { notificaciones = [] } = useIntranetStore();

  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed(!collapsed);

  // ---------------------------------------------------------
  // Cargar no leídos cada 10s
  // ---------------------------------------------------------
  useEffect(() => {
    if (user?.id) {
      cargarNoLeidos(user.id);
      const interval = setInterval(() => cargarNoLeidos(user.id), 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // ---------------------------------------------------------
  // WebSockets: Empleados + Intranet + Notificaciones
  // ---------------------------------------------------------
  useEffect(() => {
    if (!user?.id) return;

    // WS Empleados
    const wsEmpleados = connectEmpleados(user.id, (msg) => {
      const store = useEmpleadosStore.getState();

      if (msg.tipo === "empleado_conectado") {
        store.marcarConectado(msg.empleado_id);
      }

      if (msg.tipo === "empleado_desconectado") {
        store.marcarDesconectado(msg.empleado_id);
      }
    });

    // WS Intranet
    const wsIntranet = connectIntranet(user.id, (msg) => {
      const store = useIntranetStore.getState();

      if (msg.tipo === "nueva_noticia") {
        store.nuevaNoticia(msg);
      }

      if (msg.tipo === "nuevo_documento") {
        store.nuevoDocumento(msg);
      }

      if (msg.tipo === "noticia_eliminada") {
        store.eliminarNoticia(msg.id);
      }
    });

    // WS Notificaciones
    const wsNotificaciones = connectNotificaciones(user.id, (msg) => {
      const store = useIntranetStore.getState();
      store.agregarNotificacion(msg);
    });

    // Cerrar conexiones al desmontar
    return () => {
      wsEmpleados.close();
      wsIntranet.close();
      wsNotificaciones.close();
    };
  }, [user]);

  // ---------------------------------------------------------
  // Secciones del sidebar
  // ---------------------------------------------------------
  const sections = [
    {
      title: "Dashboard",
      items: [{ name: "Inicio", icon: <IconAgenda size={22} />, path: "/" }],
    },
    {
      title: "Agenda",
      items: [{ name: "Agenda", icon: <IconAgenda size={22} />, path: "/agenda" }],
    },
    {
      title: "Intranet",
      items: [
        {
          name: "Intranet",
          icon: <IconIntranet size={22} />,
          path: "/intranet",
          badge: notificaciones?.length || 0,
          badgeColor: "bg-yellow-400 text-black",
        },
      ],
    },
    {
      title: "Empleados",
      items: [
        {
          name: "Empleados",
          icon: <IconEmpleados size={22} />,
          path: "/empleados",
        },
      ],
    },
    {
      title: "Mensajes",
      items: [
        {
          name: "Chat",
          icon: <IconMensajes size={22} />,
          path: "/mensajes/chat",
          badge: noLeidos || 0,
          badgeColor: "bg-blue-600 text-white",
        },
      ],
    },
    {
      title: "CTN",
      items: [
        { name: "Listado CTN", icon: <IconCTN size={22} />, path: "/ctn" },
      ],
    },
    {
      title: "Seguridad",
      items: [
        { name: "Seguridad", icon: <IconSeguridad size={22} />, path: "/seguridad" },
        { name: "Roles", icon: <IconSeguridad size={22} />, path: "/seguridad/roles" },
        { name: "Auditoría", icon: <IconAuditoria size={22} />, path: "/seguridad/auditoria" },
        { name: "Logs", icon: <IconLogs size={22} />, path: "/seguridad/logs" },
      ],
    },
    {
      title: "Utilidades",
      items: [
        { name: "Utilidades", icon: <IconSeguridad size={22} />, path: "/utilidades" },
      ],
    },
  ];

  return (
    <aside
      className={`
        h-screen p-4 flex flex-col transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        bg-white/70 backdrop-blur-md shadow-lg border-r border-neutral-200
      `}
    >
      {/* Avatar */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src={user?.avatar || "/avatar.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full border border-neutral-300"
        />
        {!collapsed && (
          <div>
            <p className="font-semibold" style={{ color: "#1F3A5F" }}>
              {user?.nombre}
            </p>
            <p className="text-xs" style={{ color: "#6A7A8C" }}>
              {user?.rol}
            </p>
          </div>
        )}
      </div>

      {/* Botón colapsar */}
      <button
        onClick={toggle}
        className="text-neutral-500 hover:text-neutral-700 mb-4"
      >
        {collapsed ? "»" : "«"}
      </button>

      {/* Secciones */}
      <nav className="flex-1 overflow-y-auto space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="uppercase text-xs mb-2 font-semibold" style={{ color: "#6A7A8C" }}>
                {section.title}
              </p>
            )}

            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                    ${isActive ? "bg-[#2D6CDF] text-white" : "hover:bg-neutral-100"}
                    ${collapsed ? "justify-center" : ""}
                  `
                  }
                  style={{ color: "#1F3A5F" }}
                >
                  <div className="relative flex items-center">
                    {item.icon}

                    {item.badge > 0 && (
                      <span
                        className={`
                          absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded-full
                          ${item.badgeColor}
                        `}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {!collapsed && item.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Menú usuario */}
      <div className="mt-4 border-t border-neutral-200 pt-4">
        <NavLink
          to="/perfil"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 ${
            collapsed ? "justify-center" : ""
          }`}
          style={{ color: "#1F3A5F" }}
        >
          <IconBase size={22}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#1F3A5F" strokeWidth="2"/>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="#2D6CDF" strokeWidth="2"/>
            </svg>
          </IconBase>
          {!collapsed && "Perfil"}
        </NavLink>

        <button
          onClick={logout}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full hover:bg-red-100 ${
            collapsed ? "justify-center" : ""
          }`}
          style={{ color: "#B00020" }}
        >
          <IconBase size={22}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M16 17l5-5-5-5" stroke="#B00020" strokeWidth="2"/>
              <path d="M3 12h17" stroke="#B00020" strokeWidth="2"/>
            </svg>
          </IconBase>
          {!collapsed && "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
}
