import React from "react";
import GlassCard from "../ui/GlassCard.jsx";
import IconEmpleados from "../icons/IconEmpleados.jsx";

export default function ListaUsuariosConectados({ usuarios, seleccionar }) {
  // 🔥 Protección total
  const safe = Array.isArray(usuarios) ? usuarios : [];

  return (
    <GlassCard className="p-3 space-y-3">
      <h3
        className="font-bold text-lg flex items-center gap-2"
        style={{ color: "#1F3A5F" }}
      >
        <IconEmpleados size={22} />
        Usuarios conectados
      </h3>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {safe.length === 0 && (
          <p className="text-sm text-gray-500">No hay usuarios conectados.</p>
        )}

        {safe.map((u) => (
          <button
            key={u.id ?? u.usuario_id}
            onClick={() => seleccionar(u.id ?? u.usuario_id)}
            className="
              w-full text-left p-2 rounded-lg
              hover:bg-neutral-100 transition
            "
          >
            <p className="font-semibold" style={{ color: "#1F3A5F" }}>
              {u.nombre || `Usuario ${u.id ?? u.usuario_id}`}
            </p>

            {u.rol && (
              <p className="text-xs" style={{ color: "#6A7A8C" }}>
                {u.rol}
              </p>
            )}
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
