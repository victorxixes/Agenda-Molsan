import React, { useState } from "react";
import { useIntranetStore } from "../../store/intranetStore";

export default function SubirDocumentoUtil() {
  const { subirDocumento, loading } = useIntranetStore();

  const [titulo, setTitulo] = useState("");
  const [concepto, setConcepto] = useState("");
  const [archivo, setArchivo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!archivo) return;

    await subirDocumento(titulo, concepto, archivo);

    setTitulo("");
    setConcepto("");
    setArchivo(null);
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded bg-white">
      <h3 className="font-semibold mb-2">Subir documento</h3>

      <input
        className="border p-2 rounded w-full mb-2"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <input
        className="border p-2 rounded w-full mb-2"
        placeholder="Concepto"
        value={concepto}
        onChange={(e) => setConcepto(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setArchivo(e.target.files[0])}
        className="mb-2"
      />

      <button className="bg-purple-600 text-white px-3 py-1 rounded">
        {loading ? "Subiendo..." : "Subir documento"}
      </button>
    </form>
  );
}
