
import React, { useEffect } from "react";
import { useSeguridadStore } from "../../store/seguridadStore";
import { Link } from "react-router-dom";

import GlassCard from "../../components/ui/GlassCard.jsx";
import GlassSectionTitle from "../../components/ui/GlassSectionTitle.jsx";
import IconSeguridad from "../../components/icons/IconSeguridad.jsx";

export default function RolesList() {
  const { roles, cargarRoles } = useSeguridadStore();

  useEffect(() => {
    cargarRoles();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2
          className="text-3xl font-bold flex items-center gap-3"
          style={{ color: "#1F3A5F" }}
        >
          <IconSeguridad size={30} />
          Roles del sistema
        </h2>

        <Link to="/seguridad/roles/nuevo" className="btn-primary px-4 py-2 rounded-lg">
          + Nuevo rol
        </Link>
      </div>

      <GlassSectionTitle
        icon={<IconSeguridad size={26} />}
        title="Listado de roles"
      />

      {roles.length === 0 && (
        <GlassCard className="p-4 text-center">
          <p className="text-neutral-600">No hay roles registrados.</p>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((r) => (
          <GlassCard key={r.id} className="p-4 space-y-2">
            <p className="text-xl font-bold" style={{ color: "#1F3A5F" }}>
              {r.nombre}
            </p>

            <p className="text-sm" style={{ color: "#6A7A8C" }}>
              {r.descripcion || "Sin descripción"}
            </p>

            <p className="text-xs text-neutral-500">
              {r.permisos?.length > 0
                ? `${r.permisos.length} permisos`
                : "Sin permisos"}
            </p>

            <div className="pt-2">
              <Link
                to={`/seguridad/roles/${r.id}`}
                className="btn-outline px-3 py-1 rounded-lg"
              >
                Ver permisos
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
