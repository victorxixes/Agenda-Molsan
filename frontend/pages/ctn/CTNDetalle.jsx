import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCTNStore } from "../../store/ctnStore";

import GlassCard from "../../components/ui/GlassCard.jsx";
import GlassSectionTitle from "../../components/ui/GlassSectionTitle.jsx";
import IconIntranet from "../../components/icons/IconIntranet.jsx";

export default function CTNDetalle() {
  const { id } = useParams();
  const { notaria, cargarNotaria } = useCTNStore();

  useEffect(() => {
    cargarNotaria(id);
  }, [id]);

  if (!notaria) return "Cargando...";

  return (
    <div className="p-4 space-y-6">
      {/* Título principal */}
      <h2
        className="text-3xl font-bold flex items-center gap-3"
        style={{ color: "#1F3A5F" }}
      >
        <IconIntranet size={30} />
        Notaría #{notaria.id}
      </h2>

      {/* Sección Glass */}
      <GlassSectionTitle
        icon={<IconIntranet size={26} />}
        title="Información de la notaría"
      />

      <GlassCard className="p-6 space-y-4">
        <p>
          <strong style={{ color: "#1F3A5F" }}>Código:</strong> {notaria.codigo}
        </p>

        <p>
          <strong style={{ color: "#1F3A5F" }}>Nombre:</strong>{" "}
          {notaria.nombre} {notaria.apellidos}
        </p>

        <p>
          <strong style={{ color: "#1F3A5F" }}>NIF:</strong> {notaria.nif}
        </p>

        <p>
          <strong style={{ color: "#1F3A5F" }}>Teléfono:</strong>{" "}
          {notaria.telefono || "No disponible"}
        </p>

        <p>
          <strong style={{ color: "#1F3A5F" }}>Provincia:</strong>{" "}
          {notaria.provincia}
        </p>

        <p>
          <strong style={{ color: "#1F3A5F" }}>Municipio:</strong>{" "}
          {notaria.municipio}
        </p>

        <p>
          <strong style={{ color: "#1F3A5F" }}>CP:</strong> {notaria.cp}
        </p>

        <p>
          <strong style={{ color: "#1F3A5F" }}>Videoconferencia (VC):</strong>{" "}
          {notaria.vc ? "Sí" : "No"}
        </p>

        <p>
          <strong style={{ color: "#1F3A5F" }}>Apoderado:</strong>{" "}
          {notaria.apoderado || "No asignado"}
        </p>

        <p>
          <strong style={{ color: "#1F3A5F" }}>Apoderado S:</strong>{" "}
          {notaria.apoderado_s || "No asignado"}
        </p>

        <p>
          <strong style={{ color: "#1F3A5F" }}>Observación:</strong>{" "}
          {notaria.observacion || "Sin observaciones"}
        </p>

        <div className="pt-4">
          <Link
            to={`/ctn/${id}/editar`}
            className="btn-primary px-4 py-2 rounded-lg"
          >
            Editar notaría
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
