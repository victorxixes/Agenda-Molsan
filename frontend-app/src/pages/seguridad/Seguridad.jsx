import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSeguridad } from "../../hooks/useSeguridad";
import SeguridadRoles from "./SeguridadRoles";
import SeguridadPermisos from "./SeguridadPermisos";
import SeguridadModulos from "./SeguridadModulos";

export default function Seguridad() {
  const { cargarTodo, loading } = useSeguridad();

  useEffect(() => {
    cargarTodo();
  }, []);

  if (loading) return <p className="p-6">Cargando seguridad…</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Seguridad del sistema</h1>

      <div className="flex gap-4 mb-6">
        <Link to="/seguridad/usuarios" className="seg-card">
          <h2 className="seg-title">Usuarios</h2>
          <p className="seg-desc">Bloqueo, contraseña, rol, módulos, permisos.</p>
        </Link>

        <Link to="/seguridad/auditoria" className="seg-card">
          <h2 className="seg-title">Auditoría</h2>
          <p className="seg-desc">Acciones registradas en el sistema.</p>
        </Link>

        <Link to="/seguridad/logs" className="seg-card">
          <h2 className="seg-title">Logs</h2>
          <p className="seg-desc">Eventos técnicos y de seguridad.</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SeguridadRoles />
        <SeguridadPermisos />
        <SeguridadModulos />
      </div>
    </div>
  );
}
