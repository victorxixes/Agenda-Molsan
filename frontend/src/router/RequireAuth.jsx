import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { usePermisosStore } from "../store/permisosStore";

export default function RequireAuth({ modulo }) {
  const { user } = useAuthStore();
  const { modulos, loading } = usePermisosStore();
  const location = useLocation();

  // Si no hay usuario → login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Esperar a que carguen permisos
  if (loading) return null;

  // Si modulos todavía no está definido → evitar crash
  if (!modulos || !Array.isArray(modulos)) {
    return <Outlet />;
  }

  // ADMIN → acceso total
  if (user?.rol === "admin") {
    return <Outlet />;
  }

  // Comprobar acceso
  if (modulo && !modulos.includes(modulo)) {
    return (
      <div className="p-4 text-red-600">
        No tienes acceso al módulo: {modulo}
      </div>
    );
  }

  return <Outlet />;
}
