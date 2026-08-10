import React, { useState } from "react";
import { useCTNStore } from "../../store/ctnStore";

import GlassCard from "../../components/ui/GlassCard.jsx";
import GlassSectionTitle from "../../components/ui/GlassSectionTitle.jsx";
import IconIntranet from "../../components/icons/IconIntranet.jsx";

export default function CTNImportarExcel() {
  const { importarExcel, resultadoImportacion } = useCTNStore();
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) await importarExcel(file);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Título */}
      <h2
        className="text-3xl font-bold flex items-center gap-3"
        style={{ color: "#1F3A5F" }}
      >
        <IconIntranet size={30} />
        Importar Excel CTN
      </h2>

      {/* Sección Glass */}
      <GlassSectionTitle
        icon={<IconIntranet size={26} />}
        title="Carga de datos desde Excel"
      />

      <GlassCard className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            className="input"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit" className="btn-primary w-full">
            Importar
          </button>
        </form>
      </GlassCard>

      {resultadoImportacion && (
        <GlassCard className="p-4 space-y-2">
          <h3 className="text-xl font-bold" style={{ color: "#1F3A5F" }}>
            Resultado de la importación
          </h3>

          <p>{resultadoImportacion.message}</p>
          <p>
            <strong>Total importadas:</strong>{" "}
            {resultadoImportacion.total_importadas}
          </p>
        </GlassCard>
      )}
    </div>
  );
}
