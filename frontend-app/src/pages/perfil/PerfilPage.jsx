import React from "react";
import { useAuthStore } from "../../store/authStore";

import PerfilCard from "../../components/perfil/PerfilCard.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import GlassSectionTitle from "../../components/ui/GlassSectionTitle.jsx";
import IconEmpleados from "../../components/icons/IconEmpleados.jsx";

export default function PerfilPage() {
  const { user } = useAuthStore();

  if (!user) return "Cargando...";

  return (
    <div className="p-4 space-y-6">
      {/* Título principal */}
      <h2
        className="text-3xl font-bold flex items-center gap-3"
        style={{ color: "#1F3A5F" }}
      >
        <IconEmpleados size={30} />
        Mi Perfil
      </h2>

      {/* Sección Glass */}
      <GlassSectionTitle
        icon={<IconEmpleados size={26} />}
        title="Información personal"
      />

      {/* Card principal del perfil */}
      <PerfilCard usuario={user} />

      {/* Información adicional */}
      <GlassSectionTitle
        icon={<IconEmpleados size={26} />}
        title="Datos de acceso"
      />

      <GlassCard className="p-6 space-y-3">
        <p>
          <strong style={{ color: "#1F3A5F" }}>Usuario:</strong> {user.usuario}
        </p>

        <p>
          <strong style={{ color: "#1F3A5F" }}>Email:</strong>{" "}
          {user.email_empresa || "No asignado"}
        </p>

        <p>
          <strong style={{ color: "#1F3A5F" }}>Rol:</strong>{" "}
          {user.rol || "Sin rol asignado"}
        </p>
      </GlassCard>
    </div>
  );
}
