import { useState } from "react";
import { useUtilidades } from "../../hooks/useUtilidades";

export default function CrearNoticia() {
  const { crearNoticia } = useUtilidades();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ok, setOk] = useState(false);

  const enviar = async () => {
    await crearNoticia(titulo, descripcion);
    setOk(true);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Crear noticia</h1>

      <div className="border rounded bg-white p-4 shadow">
        <input
          type="text"
          placeholder="Título"
          className="border rounded px-3 py-2 w-full mb-3"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <textarea
          placeholder="Descripción"
          className="border rounded px-3 py-2 w-full mb-3"
          rows={4}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <button
          onClick={enviar}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Crear noticia
        </button>

        {ok && (
          <div className="mt-4 p-3 bg-green-100 border rounded">
            Noticia creada correctamente.
          </div>
        )}
      </div>
    </div>
  );
}
