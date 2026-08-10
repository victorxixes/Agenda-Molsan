import React, { useState } from "react";
import { useIntranetStore } from "../../store/intranetStore";

export default function DocumentosForm() {
  const { crearDocumento } = useIntranetStore();

  const [titulo, setTitulo] = useState("");
  const [archivo, setArchivo] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("concepto", "");        // obligatorio aunque sea vacío
  formData.append("fichero", archivo);    // nombre correcto

  await crearDocumento(formData);

  setTitulo("");
  setArchivo(null);
};

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        className="border p-1 rounded"
        placeholder="Título del documento"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setArchivo(e.target.files[0])}
      />

      <button className="bg-green-600 text-white px-3 py-1 rounded">
        Subir documento
      </button>
    </form>
  );
}
