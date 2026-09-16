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

      <h1 className="text-3xl font-bold text-white drop-shadow">
        Crear noticia
      </h1>

      <div className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        p-6 shadow-xl space-y-4
      ">
        <input
          type="text"
          placeholder="Título"
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400
          "
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <textarea
          placeholder="Descripción"
          rows={4}
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400
          "
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <button
          onClick={enviar}
          className="
            px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700
            text-white shadow-lg transition
          "
        >
          Crear noticia
        </button>

        {ok && (
          <div className="
            mt-4 p-4 bg-green-500/20 border border-green-500/30
            text-white rounded-xl shadow-md backdrop-blur-md
          ">
            Noticia creada correctamente.
          </div>
        )}
      </div>
    </div>
  );
}
