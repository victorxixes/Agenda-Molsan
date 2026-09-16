import { useMemo } from "react";

/**
 * MensajesHeader — SJ‑2026 Premium
 * Cabecera del chat mostrando avatar, nombre y estado online.
 * - Glass‑UI consistente
 * - Normalización del usuario
 * - Sin re‑renders innecesarios
 */

export default function MensajesHeader({ otroId, conectados }) {
  /**
   * Memo para evitar buscar el usuario en cada render
   */
  const usuario = useMemo(
    () => conectados.find((x) => x.id === otroId),
    [conectados, otroId]
  );

  const fotoUrl = usuario?.foto
    ? `${import.meta.env.VITE_API_URL}${usuario.foto}`
    : "/no-foto.png";

  return (
    <div className="flex items-center gap-3 border-b pb-3 mb-3">
      {/* AVATAR */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden border bg-gray-200 shadow-md">
        <img src={fotoUrl} className="w-full h-full object-cover" />

        {usuario && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full"></span>
        )}
      </div>

      {/* NOMBRE + ESTADO */}
      <div>
        <div className="font-semibold text-gray-900 text-lg drop-shadow-sm">
          {usuario?.nombre} {usuario?.apellidos}
        </div>

        <div className="text-sm text-gray-500">
          {usuario ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
}
