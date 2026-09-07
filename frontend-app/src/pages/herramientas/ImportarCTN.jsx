import { useState } from "react";
import { useUtilidades } from "../../hooks/useUtilidades";

export default function ImportarCTN() {
  const { importarCTN, loading, resultado } = useUtilidades();
  const [file, setFile] = useState(null);

  const enviar = async () => {
    if (!file) return;
    await importarCTN(file);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Importar CTN</h1>

      <div className="border rounded bg-white p-4 shadow">
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={enviar}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Importando..." : "Importar"}
        </button>

        {resultado && (
          <div className="mt-4 p-3 bg-green-100 border rounded">
            <strong>Importación completada:</strong> {resultado.importados} registros
          </div>
        )}
      </div>
    </div>
  );
}
