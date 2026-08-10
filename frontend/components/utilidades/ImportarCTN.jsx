import React, { useState } from "react";
import { useUtilidadesStore } from "../../store/utilidadesStore";

export default function ImportarCTN() {
  const { importarCTN, loading } = useUtilidadesStore();
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    await importarCTN(file);
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded bg-white">
      <h3 className="font-semibold mb-2">Importar CTN (Excel)</h3>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />

      <button className="bg-blue-600 text-white px-3 py-1 rounded">
        {loading ? "Importando..." : "Importar"}
      </button>
    </form>
  );
}
