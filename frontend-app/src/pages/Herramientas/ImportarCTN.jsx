import { useState } from "react";
import axios from "../../api/axios";

export default function ImportarCTN() {
  const [file, setFile] = useState(null);
  const [log, setLog] = useState("");

  const subir = async () => {
    if (!file) return;

    const form = new FormData();
    form.append("fichero", file);

    const res = await axios.post("/ctn/importar", form);
    setLog(JSON.stringify(res.data, null, 2));
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
      >
        Importar
      </button>

      {log && (
        <pre className="border p-4 bg-gray-100 rounded">{log}</pre>
      )}
    </div>
  );
}
