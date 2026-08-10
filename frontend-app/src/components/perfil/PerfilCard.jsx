import React from "react";
import GlassCard from "../../components/ui/GlassCard.jsx";

export default function PerfilCard({ usuario }) {
  return (
    <GlassCard className="flex items-center gap-4">
      <img
        src={usuario.avatar || "/avatar.png"}
        className="w-14 h-14 rounded-full"
      />

      <div>
        <p className="font-bold text-lg" style={{ color: "#1F3A5F" }}>
          {usuario.nombre}
        </p>
        <p className="text-sm" style={{ color: "#6A7A8C" }}>
          {usuario.email}
        </p>
      </div>
    </GlassCard>
  );
}
