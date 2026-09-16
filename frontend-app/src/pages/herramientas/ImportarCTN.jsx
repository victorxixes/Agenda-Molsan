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

      <h1 className="text-3xl font-bold text-white drop-shadow">
        Importar CTN
      </h1>

      <div className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        p-6 shadow-xl space-y-4
      ">
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-white"
        />

        <button
          onClick={enviar}
          disabled={loading}
          className="
            px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
            text-white shadow-lg transition disabled:opacity-50
          "
        >
          {loading ? "Importando..." : "Importar"}
        </button>

        {resultado && (
          <div className="
            mt-4 p-4 bg-green-500/20 border border-green-500/30
            text-white rounded-xl shadow-md backdrop-blur-md
          ">
            <strong>Importación completada:</strong> {resultado.importados} registros
          </div>
        )}
      </div>
    </div>
  );
}
