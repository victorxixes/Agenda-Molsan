import React from "react";
import { useAuthStore } from "../../store/authStore";
import EmpleadoDetalle from "../empleados/EmpleadoDetalle";

export default function MiPerfil() {
  const { user } = useAuthStore();

  if (!user) {
    return <div className="p-4 text-blue-600">Cargando perfil…</div>;
  }

  return (
    <div className="p-4">
      <EmpleadoDetalle empleadoId={user.id} />
    </div>
  );
}
