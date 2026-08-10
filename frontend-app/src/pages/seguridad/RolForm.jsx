import React, { useState } from "react";
import { useSeguridadStore } from "../../store/seguridadStore";
import { useNavigate, useParams } from "react-router-dom";

import GlassCard from "../../components/ui/GlassCard.jsx";
import GlassSectionTitle from "../../components/ui/GlassSectionTitle.jsx";
import IconSeguridad from "../../components/icons/IconSeguridad.jsx";

export default function RolForm() {
  const navigate = useNavigate();
  const { crearRol } = useSeguridadStore();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await crearRol(form);
    navigate("/seguridad/roles");
  };

  return (
    <div className="p-4 space-y-6">
      {/* Título */}
      <h2
        className="text-3xl font-bold flex items-center gap-3"
        style={{ color: "#1F3A5F" }}
      >
        <IconSeguridad size={30} />
        Nuevo Rol
      </h2>

      {/* Sección Glass */}
      <GlassSectionTitle
        icon={<IconSeguridad size={26} />}
        title="Datos del rol"
      />

      <GlassCard className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <input
            className="input"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />

          <button type="submit" className="btn-primary w-full">
            Guardar
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
