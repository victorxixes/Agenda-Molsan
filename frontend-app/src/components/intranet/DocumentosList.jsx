import React from "react";
import { useIntranetStore } from "../../store/intranetStore";
import { useEmpleadosStore } from "../../store/empleadosStore";
import DocumentosForm from "./DocumentosForm";
import DocumentoCard from "./DocumentoCard";

export default function DocumentosList() {
  const { documentos, eliminarDocumento, descargarDocumento } = useIntranetStore();
  const { empleados } = useEmpleadosStore();

  const safeDocs = Array.isArray(documentos) ? documentos : [];

  const getNombre = (id) =>
    empleados.find((e) => e.id === id)?.nombre || `Usuario ${id}`;

  const handleDownload = async (id) => {
    const file = await descargarDocumento(id);
    const url = window.URL.createObjectURL(file.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "documento";
    a.click();
  };

  return (
    <div>
      <DocumentosForm />

      <div className="mt-4 grid grid-cols-1 gap-4">
        {safeDocs.map((d) => (
          <DocumentoCard
            key={d.id}
            documento={d}
            creador={getNombre(d.usuario_id)}
            onDelete={() => eliminarDocumento(d.id)}
            onDownload={() => handleDownload(d.id)}
          />
        ))}
      </div>
    </div>
  );
}
