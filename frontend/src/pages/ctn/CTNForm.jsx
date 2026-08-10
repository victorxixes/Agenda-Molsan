import React, { useState, useEffect } from "react";
import { useCTNStore } from "../../store/ctnStore";
import { useParams, useNavigate } from "react-router-dom";

import GlassCard from "../../components/ui/GlassCard.jsx";
import GlassSectionTitle from "../../components/ui/GlassSectionTitle.jsx";
import IconIntranet from "../../components/icons/IconIntranet.jsx";

export default function CTNForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { notaria, cargarNotaria, crearNotaria, actualizarNotaria } =
    useCTNStore();

  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    apellidos: "",
    nif: "",
    telefono: "",
    departamento_cancelaciones: "",
    departamento_copias: "",
    otros_departamentos: "",
    cp: "",
    provincia: "",
    municipio: "",
    vc: "",
    apoderado: "",
    apoderado_s: "",
    observacion: ""
  });

  useEffect(() => {
    if (id) cargarNotaria(id);
  }, [id]);

  useEffect(() => {
    if (notaria && id) setForm(notaria);
  }, [notaria]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) await actualizarNotaria(id, form);
    else await crearNotaria(form);
    navigate("/ctn");
  };

  return (
    <div className="p-4 space-y-6">
      {/* Título */}
      <h2
        className="text-3xl font-bold flex items-center gap-3"
        style={{ color: "#1F3A5F" }}
      >
        <IconIntranet size={30} />
        {id ? "Editar Notaría" : "Nueva Notaría"}
      </h2>

      {/* Sección Glass */}
      <GlassSectionTitle
        icon={<IconIntranet size={26} />}
        title="Datos de la notaría"
      />

      <GlassCard className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              className="input"
              placeholder={key}
              value={form[key] || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ))}

          <button type="submit" className="btn-primary w-full">
            Guardar
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
