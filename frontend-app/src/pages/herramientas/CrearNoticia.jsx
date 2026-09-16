import { useState, useCallback, useMemo } from "react";
import { useUtilidades } from "../../hooks/useUtilidades";

/**
 * CrearNoticia — SJ‑2026 Premium
 * - Formulario glass‑UI
 * - Validación mínima
 * - Feedback visual
 * - Funciones estabilizadas
 */

export default function CrearNoticia() {
  const { crearNoticia } = useUtilidades();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ok, setOk] = useState(false);

  const puedeEnviar = useMemo(() => {
    return titulo.trim().length > 0 && descripcion.trim().length > 0;
  }, [titulo, descripcion]);

  const enviar = useCallback(async () => {
    if (!puedeEnviar) return;

    await crearNoticia(titulo, descripcion);
    setOk(true);

    // Reset opcional
    setTitulo("");
    setDescripcion("");
  }, [crearNoticia, titulo, descripcion, puedeEnviar]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      {/* TÍTULO PREMIUM */}
      <h1 className="text-3xl font-bold text-white drop-shadow">
        Crear noticia
      </h1>

      {/* FORMULARIO PREMIUM */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          p-6 shadow-xl space-y-4
        "
      >
        {/* TÍTULO */}
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

        {/* DESCRIPCIÓN */}
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

        {/* BOTÓN PREMIUM */}
        <button
          onClick={enviar}
          disabled={!puedeEnviar}
          className={`
            px-5 py-2 rounded-xl text-white shadow-lg transition active:scale-[0.97]
            ${
              puedeEnviar
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-600/40 cursor-not-allowed"
            }
          `}
        >
          Crear noticia
        </button>

        {/* MENSAJE OK */}
        {ok && (
          <div
            className="
              mt-4 p-4 bg-green-500/20 border border-green-500/30
              text-white rounded-xl shadow-md backdrop-blur-md animate-fade-in
            "
          >
            Noticia creada correctamente.
          </div>
        )}
      </div>
    </div>
  );
}
