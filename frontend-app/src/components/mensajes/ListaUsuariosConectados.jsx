import React from "react";
import GlassCard from "../ui/GlassCard.jsx";
import IconEmpleados from "../icons/IconEmpleados.jsx";
import { useMensajesStore } from "../../store/mensajesStore";

export default function ListaUsuariosConectados({ usuarios, seleccionar }) {
  const { typingEstados } = useMensajesStore();

  // Protección total
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
            key={u.usuario_id}
            onClick={() => seleccionar(u.usuario_id)}
            className="
              w-full text-left p-2 rounded-lg flex items-center gap-3
              hover:bg-neutral-100 transition
            "
          >
            {/* FOTO */}
            <img
              src={u.foto || `${import.meta.env.VITE_API_URL}/fotos/default-avatar.png`}
              alt={u.nombre}
              className="w-10 h-10 rounded-full object-cover border border-white/20"
            />

            {/* INFO */}
            <div className="flex flex-col">
              <span className="font-semibold" style={{ color: "#1F3A5F" }}>
                {u.nombre} {u.apellidos}
              </span>

              {/* ROL */}
              {u.rol && (
                <span className="text-xs" style={{ color: "#6A7A8C" }}>
                  {u.rol}
                </span>
              )}

              {/* ESTADO: escribiendo / online */}
              {typingEstados[u.usuario_id] ? (
                <span className="text-green-600 text-xs">escribiendo…</span>
              ) : (
                <span className="text-gray-500 text-xs">online</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
