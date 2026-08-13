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

  // Mostrar todos los campos en consola (útil para debug)
  useEffect(() => {
    console.log("CAMPOS DE LA NOTARIA:", notaria);
  }, [notaria]);

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

        {/* Código */}
        <p>
          <strong style={{ color: "#1F3A5F" }}>Código:</strong> {notaria.codigo}
        </p>

        {/* Nombre */}
        <p>
          <strong style={{ color: "#1F3A5F" }}>Nombre:</strong>{" "}
          {notaria.nombre} {notaria.apellidos}
        </p>

        {/* NIF */}
        <p>
          <strong style={{ color: "#1F3A5F" }}>NIF:</strong> {notaria.nif}
        </p>

        {/* Teléfono */}
        <p>
          <strong style={{ color: "#1F3A5F" }}>Teléfono:</strong>{" "}
          {notaria.telefono || "No disponible"}
        </p>

        {/* Provincia */}
        <p>
          <strong style={{ color: "#1F3A5F" }}>Provincia:</strong>{" "}
          {notaria.provincia}
        </p>

        {/* Municipio */}
        <p>
          <strong style={{ color: "#1F3A5F" }}>Municipio:</strong>{" "}
          {notaria.municipio}
        </p>

        {/* CP */}
        <p>
          <strong style={{ color: "#1F3A5F" }}>CP:</strong> {notaria.cp}
        </p>

        {/* Videoconferencia */}
        <p>
          <strong style={{ color: "#1F3A5F" }}>Videoconferencia (VC):</strong>{" "}
          {notaria.vc ? "Sí" : "No"}
        </p>

        {/* Apoderado */}
        <p>
          <strong style={{ color: "#1F3A5F" }}>Apoderado:</strong>{" "}
          {notaria.apoderado || "No asignado"}
        </p>

        {/* Apoderado S */}
        <p>
          <strong style={{ color: "#1F3A5F" }}>Apoderado S:</strong>{" "}
          {notaria.apoderado_s || "No asignado"}
        </p>

        {/* Observación */}
        <p>
          <strong style={{ color: "#1F3A5F" }}>Observación:</strong>{" "}
          {notaria.observacion || "Sin observaciones"}
        </p>

        {/* Departamento Cancelaciones */}
        <p>
          <strong style={{ color: "#1F3A5F" }}>Dept. Cancelaciones:</strong>{" "}
          {notaria.departamento_cancelaciones || "—"}
        </p>

        {/* Departamento Copias */}
        <p>
          <strong style={{ color: "#1F3A5F" }}>Dept. Copias:</strong>{" "}
          {notaria.departamento_copias || "—"}
        </p>

        {/* Otros Departamentos */}
        <p>
          <strong style={{ color: "#1F3A5F" }}>Otros Departamentos:</strong>{" "}
          {notaria.otros_departamentos || "—"}
        </p>

        {/* Botón editar */}
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
