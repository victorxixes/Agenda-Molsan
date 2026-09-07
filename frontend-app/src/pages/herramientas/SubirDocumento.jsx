import { useState } from "react";
import { useUtilidades } from "../../hooks/useUtilidades";

export default function SubirDocumento() {
  const { subirDocumento } = useUtilidades();

  const [titulo, setTitulo] = useState("");
  const [concepto, setConcepto] = useState("");
  const [file, setFile] = useState(null);
  const [ok, setOk] = useState(false);

  const enviar = async () => {
    if (!file) return;
    await subirDocumento(titulo, concepto, file);
    setOk(true);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Subir documento</h1>

      <div className="border rounded bg-white p-4 shadow">
        <input
          type="text"
          placeholder="Título"
          className="border rounded px-3 py-2 w-full mb-3"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <input
          type="text"
          placeholder="Concepto"
          className="border rounded px-3 py-2 w-full mb-3"
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
        />

        <input
          type="file"
          className="mb-3"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={enviar}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Subir documento
        </button>

        {ok && (
          <div className="mt-4 p-3 bg-green-100 border rounded">
            Documento subido correctamente.
          </div>
        )}
      </div>
    </div>
  );
}
