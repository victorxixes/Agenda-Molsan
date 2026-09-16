import { useState, useCallback, useMemo } from "react";
import { useUtilidades } from "../../hooks/useUtilidades";

/**
 * SubirDocumento — SJ‑2026 Premium
 * - Validación mínima
 * - Glass‑UI
 * - Feedback visual
 */

export default function SubirDocumento() {
  const { subirDocumento } = useUtilidades();

  const [titulo, setTitulo] = useState("");
  const [concepto, setConcepto] = useState("");
  const [file, setFile] = useState(null);
  const [ok, setOk] = useState(false);

  const puedeEnviar = useMemo(() => {
    return titulo.trim() && concepto.trim() && file;
  }, [titulo, concepto, file]);

  const enviar = useCallback(async () => {
    if (!puedeEnviar) return;

    await subirDocumento(titulo, concepto, file);
    setOk(true);

    setTitulo("");
    setConcepto("");
    setFile(null);
  }, [puedeEnviar, subirDocumento, titulo, concepto, file]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      <h1 className="text-3xl font-bold text-white drop-shadow">
        Subir documento
      </h1>

      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          p-6 shadow-xl space-y-4
        "
      >
        <input
          type="text"
          placeholder="Título"
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-green-400
          "
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <input
          type="text"
          placeholder="Concepto"
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-green-400
          "
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
        />

        <input
          type="file"
          className="text-white"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={enviar}
          disabled={!puedeEnviar}
          className={`
            px-5 py-2 rounded-xl text-white shadow-lg transition active:scale-[0.97]
            ${
              puedeEnviar
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-600/40 cursor-not-allowed"
            }
          `}
        >
          Subir documento
        </button>

        {ok && (
          <div
            className="
              mt-4 p-4 bg-green-500/20 border border-green-500/30
              text-white rounded-xl shadow-md backdrop-blur-md animate-fade-in
            "
          >
            Documento subido correctamente.
          </div>
        )}
      </div>
    </div>
  );
}
