import { useState } from "react";
import { NavLink } from "react-router-dom";
import { puedeVerModulo } from "../utils/permisos"; // si lo tienes en otro sitio, ajusta la ruta

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <aside
      className={`
        sidebar
        ${open ? "sidebar-open" : "sidebar-closed"}
      `}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <nav className="sidebar-nav">

        {/* EMPLEADOS */}
        {puedeVerModulo("empleados") && (
          <NavLink
            to="/panel/empleados"
            className="sidebar-item"
          >
            <span className="sidebar-icon">👤</span>
            <span className="sidebar-label">Empleados 2026</span>
          </NavLink>
        )}

        {/* CTN */}
        {puedeVerModulo("ctn") && (
          <NavLink
            to="/ctn"
            className="sidebar-item"
          >
            <span className="sidebar-icon">📦</span>
            <span className="sidebar-label">CTN</span>
          </NavLink>
        )}

        {/* HERRAMIENTAS */}
        {puedeVerModulo("herramientas") && (
          <NavLink
            to="/herramientas"
            className="sidebar-item"
          >
            <span className="sidebar-icon">🛠️</span>
            <span className="sidebar-label">Herramientas</span>
          </NavLink>
        )}

        {/* SEGURIDAD */}
        {puedeVerModulo("seguridad") && (
          <NavLink
            to="/seguridad"
            className="sidebar-item"
          >
            <span className="sidebar-icon">🔐</span>
            <span className="sidebar-label">Seguridad</span>
          </NavLink>
        )}

        {/* LOGS */}
        {puedeVerModulo("logs") && (
          <NavLink
            to="/logs"
            className="sidebar-item"
          >
            <span className="sidebar-icon">📜</span>
            <span className="sidebar-label">Logs</span>
          </NavLink>
        )}

      </nav>
    </aside>
  );
}
