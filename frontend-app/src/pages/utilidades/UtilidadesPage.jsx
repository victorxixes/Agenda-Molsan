import React from "react";
import ImportarCTN from "../../components/utilidades/ImportarCTN.jsx";
import SubirDocumentoUtil from "../../components/utilidades/SubirDocumentoUtil.jsx";
import CrearEmpleadoUtil from "../../components/utilidades/CrearEmpleadoUtil.jsx";
import CrearNoticiaUtil from "../../components/utilidades/CrearNoticiaUtil.jsx";

import { useUtilidadesStore } from "../../store/utilidadesStore";

import GlassCard from "../../components/ui/GlassCard.jsx";
import GlassSectionTitle from "../../components/ui/GlassSectionTitle.jsx";
import IconUtilidades from "../../components/icons/IconUtilidades.jsx";

export default function UtilidadesPage() {
  const { resultado } = useUtilidadesStore();

  return (
    <div className="p-4 space-y-6">

      {/* Título principal */}
      <h1
        className="text-3xl font-bold flex items-center gap-3"
        style={{ color: "#1F3A5F" }}
      >
        <IconUtilidades size={30} />
        Panel de Utilidades
      </h1>

      {/* Sección Glass */}
      <GlassSectionTitle
        icon={<IconUtilidades size={26} />}
        title="Herramientas disponibles"
      />

      {/* Grid de utilidades */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <GlassCard className="p-4">
          <ImportarCTN />
        </GlassCard>

        <GlassCard className="p-4">
          <CrearNoticiaUtil />
        </GlassCard>

        <GlassCard className="p-4">
          <SubirDocumentoUtil />
        </GlassCard>

        <GlassCard className="p-4">
          <CrearEmpleadoUtil />
        </GlassCard>

      </div>

      {/* Resultado */}
      {resultado && (
        <>
          <GlassSectionTitle
            icon={<IconUtilidades size={26} />}
            title="Resultado de la operación"
          />

          <GlassCard className="p-4 space-y-2">
            <h3 className="font-semibold text-lg" style={{ color: "#1F3A5F" }}>
              Resultado
            </h3>

            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(resultado, null, 2)}
            </pre>
          </GlassCard>
        </>
      )}
    </div>
  );
}
