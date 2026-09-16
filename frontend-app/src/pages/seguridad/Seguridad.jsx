import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSeguridad } from "../../hooks/useSeguridad";
import SeguridadRoles from "./SeguridadRoles";
import SeguridadPermisos from "./SeguridadPermisos";
import SeguridadModulos from "./SeguridadModulos";

/**
 * Seguridad — SJ‑2026 Premium
 * - Panel principal de seguridad
 * - Roles, permisos, módulos
 * - Glass‑UI
 */

export default function Seguridad() {
  const { cargarTodo, loading } = useSeguridad();

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  if (loading)
    return (
      <div className="p-6 text-white/70 animate-pulse">
        Cargando seguridad…
      </div>
    );

  return (
    <div className="p-6 space-y-8 text-white animate-fade-in">

      {/* HEADER PREMIUM */}
      <h1 className="text-3xl font-bold drop-shadow mb-4">
        Seguridad del sistema — SJ‑2026
      </h1>

      {/* TARJETAS PREMIUM */}
      <div className="flex flex-wrap gap-6">

        <Link
          to="/seguridad/usuarios"
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            shadow-xl p-6 w-64 transition hover:bg-white/20 active:scale-[0.97]
          "
        >
          <h2 className="text-xl font-semibold text-white drop-shadow mb-1">
            Usuarios
          </h2>
          <p className="text-white/70 text-sm">
            Bloqueo, contraseña, rol, módulos, permisos.
          </p>
        </Link>

        <Link
          to="/seguridad/auditoria"
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            shadow-xl p-6 w-64 transition hover:bg-white/20 active:scale-[0.97]
          "
        >
          <h2 className="text-xl font-semibold text-white drop-shadow mb-1">
            Auditoría
          </h2>
          <p className="text-white/70 text-sm">
            Acciones registradas en el sistema.
          </p>
        </Link>

        <Link
          to="/seguridad/logs"
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            shadow-xl p-6 w-64 transition hover:bg-white/20 active:scale-[0.97]
          "
        >
          <h2 className="text-xl font-semibold text-white drop-shadow mb-1">
            Logs
          </h2>
          <p className="text-white/70 text-sm">
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
