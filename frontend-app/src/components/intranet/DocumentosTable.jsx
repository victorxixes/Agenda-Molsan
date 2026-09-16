import { useCallback } from "react";
import { useIntranet } from "../../hooks/useIntranet";

/**
 * DocumentosTable — SJ‑2026 Premium
 * Tabla glass‑UI para documentos de la intranet.
 * - Eliminación optimizada
 * - Filas animadas
 * - Sin re‑renders innecesarios
 * - UI consistente con todo el ERP
 */

export default function DocumentosTable() {
  const { documentos, eliminarDocumento } = useIntranet();

  /**
   * Evita recrear la función en cada render
   */
  const handleEliminar = useCallback(
    (id) => eliminarDocumento(id),
    [eliminarDocumento]
  );

  return (
    <table
      className="
        w-full text-sm bg-white/5 backdrop-blur-xl border border-white/10
        rounded-2xl text-white shadow-xl overflow-hidden
      "
    >
      <thead>
        <tr className="bg-white/10 border-b border-white/20">
          <th className="p-3 text-left">ID</th>
          <th className="p-3 text-left">Título</th>
          <th className="p-3 text-left">Concepto</th>
          <th className="p-3 text-left">Fecha</th>
          <th className="p-3"></th>
        </tr>
      </thead>

      <tbody>
        {documentos.map((d) => (
          <tr
            key={d.id}
            className="
              border-b border-white/10 hover:bg-white/5 transition-all
              animate-[fadeIn_0.25s_ease]
            "
            style={{ animationFillMode: "both" }}
          >
            <td className="p-3">{d.id}</td>
            <td className="p-3">{d.titulo}</td>
            <td className="p-3">{d.concepto}</td>
            <td className="p-3">
              {new Date(d.fecha_publicacion).toLocaleString()}
            </td>

            <td className="p-3">
              <button
                className="
                  px-3 py-1 bg-red-600 hover:bg-red-700 text-white
                  rounded-xl text-sm shadow-lg transition
                "
                onClick={() => handleEliminar(d.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
