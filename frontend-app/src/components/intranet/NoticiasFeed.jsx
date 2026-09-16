import { useCallback } from "react";
import { useIntranet } from "../../hooks/useIntranet";

/**
 * NoticiasFeed — SJ‑2026 Premium
 * Lista de noticias en formato card glass‑UI.
 * - Eliminación optimizada
 * - Sin re‑renders innecesarios
 * - UI consistente con todo el ERP
 */

export default function NoticiasFeed() {
  const { noticias, eliminarNoticia } = useIntranet();

  /**
   * Evita recrear la función en cada render
   */
  const handleEliminar = useCallback(
    (id) => eliminarNoticia(id),
    [eliminarNoticia]
  );

  return (
    <div className="space-y-4">
      {noticias.map((n) => (
        <div
          key={n.id}
          className="
            bg-white/10 backdrop-blur-xl border border-white/20
            rounded-2xl p-5 shadow-xl text-white space-y-2
            animate-[fadeIn_0.3s_ease,slideUp_0.3s_ease]
          "
          style={{ animationFillMode: "both" }}
        >
          {/* TÍTULO */}
          <h3 className="text-lg font-semibold drop-shadow">
            {n.titulo}
          </h3>

          {/* DESCRIPCIÓN */}
          <p className="text-white/80">{n.descripcion}</p>

          {/* FECHA */}
          <small className="text-white/60 block">
            {new Date(n.fecha_publicacion).toLocaleString()}
          </small>

          {/* BOTÓN ELIMINAR */}
          <button
            className="
              mt-2 px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700
              text-white text-sm shadow-lg transition
            "
            onClick={() => handleEliminar(n.id)}
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
