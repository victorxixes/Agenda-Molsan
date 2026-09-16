import { useMemo } from "react";

/**
 * MensajeBubble — SJ‑2026 Premium
 * Burbuja de mensaje con soporte para:
 * - Texto
 * - Imágenes
 * - PDFs
 * - Archivos adjuntos
 * - Avatar + estado online
 * - Estética consistente con el módulo de Mensajes
 */

export default function MensajeBubble({ mensaje, usuarioId, avatarUrl, online }) {
  const propio = mensaje.remitente_id === usuarioId;

  /**
   * Normalización de URL completa del archivo
   */
  const archivoFullUrl = useMemo(() => {
    if (!mensaje.archivo_url) return null;
    return `${import.meta.env.VITE_API_URL}${mensaje.archivo_url}`;
  }, [mensaje.archivo_url]);

  /**
   * Detección de tipo de archivo
   */
  const tipoArchivo = useMemo(() => {
    if (!mensaje.archivo_url) return null;

    if (/\.(jpg|jpeg|png|gif)$/i.test(mensaje.archivo_url)) return "imagen";
    if (/\.pdf$/i.test(mensaje.archivo_url)) return "pdf";
    return "otro";
  }, [mensaje.archivo_url]);

  return (
    <div className={`flex items-start gap-2 my-2 ${propio ? "justify-end" : ""}`}>
      
      {/* AVATAR DEL OTRO */}
      {!propio && (
        <div className="relative w-8 h-8 rounded-full overflow-hidden border bg-gray-200 shadow">
          <img
            src={avatarUrl || "/no-foto.png"}
            className="w-full h-full object-cover"
          />
          {online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span>
          )}
        </div>
      )}

      {/* BURBUJA */}
      <div
        className={`
          p-2 rounded-xl max-w-[70%] shadow-sm
          ${propio ? "bg-blue-100 text-right" : "bg-gray-100"}
        `}
      >
        {/* TEXTO */}
        {mensaje.contenido && (
          <p className="text-gray-800">{mensaje.contenido}</p>
        )}

        {/* IMAGEN */}
        {tipoArchivo === "imagen" && archivoFullUrl && (
          <img
            src={archivoFullUrl}
            className="mt-2 rounded max-h-48 border shadow"
          />
        )}

        {/* PDF */}
        {tipoArchivo === "pdf" && archivoFullUrl && (
          <a
            href={archivoFullUrl}
            target="_blank"
            className="text-blue-600 underline block mt-2 font-medium"
          >
            Ver PDF
          </a>
        )}

        {/* OTRO ARCHIVO */}
        {tipoArchivo === "otro" && archivoFullUrl && (
          <a
            href={archivoFullUrl}
            target="_blank"
            className="text-blue-600 underline block mt-2 font-medium"
          >
            Archivo adjunto
          </a>
        )}

        {/* FECHA */}
        <small className="text-gray-500 text-xs block mt-1">
          {mensaje.fecha}
        </small>
      </div>

      {/* AVATAR PROPIO */}
      {propio && (
        <div className="w-8 h-8 rounded-full overflow-hidden border bg-blue-200 shadow">
          <img
            src={avatarUrl || "/no-foto.png"}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
