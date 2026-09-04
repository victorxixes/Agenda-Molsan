import { useState } from "react";
import { useHerramientas } from "../../hooks/useHerramientas";

export default function ImportarCTN() {
  const [file, setFile] = useState(null);
  const { importarCTN, resultado, loading } = useHerramientas();

  const subir = () => {
    if (!file) return;
    importarCTN(file);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Importar CTN</h1>

      <input
        type="file"
        className="border p-2"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={subir}
        disabled={loading}
      >
        {loading ? "Importando…" : "Importar"}
      </button>

      {resultado && (
        <pre className="border p-4 bg-gray-100 rounded text-sm">
          {JSON.stringify(resultado, null, 2)}
        </pre>
      )}
    </div>
  );
}
