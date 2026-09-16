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

  if (loading)
    return (
      <div className="p-6 text-white/70 animate-pulse">
        Cargando seguridad…
      </div>
    );

  return (
    <div className="p-6 space-y-8">

      {/* HEADER PREMIUM */}
      <h1 className="text-3xl font-bold text-white drop-shadow mb-4">
        Seguridad del sistema — SJ‑2026
      </h1>

      {/* TARJETAS PREMIUM */}
      <div className="flex flex-wrap gap-6">

        <Link
          to="/seguridad/usuarios"
          className="
            seg-card bg-white/10 backdrop-blur-xl border border-white/20
            rounded-2xl shadow-xl p-6 w-64 transition hover:bg-white/20
          "
        >
          <h2 className="seg-title text-xl font-semibold text-white drop-shadow mb-1">
            Usuarios
          </h2>
          <p className="seg-desc text-white/70 text-sm">
            Bloqueo, contraseña, rol, módulos, permisos.
          </p>
        </Link>

        <Link
          to="/seguridad/auditoria"
          className="
            seg-card bg-white/10 backdrop-blur-xl border border-white/20
            rounded-2xl shadow-xl p-6 w-64 transition hover:bg-white/20
          "
        >
          <h2 className="seg-title text-xl font-semibold text-white drop-shadow mb-1">
            Auditoría
          </h2>
          <p className="seg-desc text-white/70 text-sm">
            Acciones registradas en el sistema.
          </p>
        </Link>

        <Link
          to="/seguridad/logs"
          className="
            seg-card bg-white/10 backdrop-blur-xl border border-white/20
            rounded-2xl shadow-xl p-6 w-64 transition hover:bg-white/20
          "
        >
          <h2 className="seg-title text-xl font-semibold text-white drop-shadow mb-1">
            Logs
          </h2>
          <p className="seg-desc text-white/70 text-sm">
            Eventos técnicos y de seguridad.
          </p>
        </Link>

      </div>

      {/* PANEL DOBLE PREMIUM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            shadow-xl p-6
          "
        >
          <h3 className="text-lg font-semibold text-white drop-shadow mb-4">
            Roles del sistema
          </h3>
          <SeguridadRoles />
        </div>

        <div
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            shadow-xl p-6
          "
        >
          <h3 className="text-lg font-semibold text-white drop-shadow mb-4">
            Permisos globales
          </h3>
          <SeguridadPermisos />
        </div>

        <div
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            shadow-xl p-6 md:col-span-2
          "
        >
          <h3 className="text-lg font-semibold text-white drop-shadow mb-4">
            Módulos visibles
          </h3>
          <SeguridadModulos />
        </div>

      </div>
    </div>
  );
}
