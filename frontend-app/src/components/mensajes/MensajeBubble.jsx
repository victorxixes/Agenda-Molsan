import { useMemo } from "react";

/**
 * MensajeBubble — SJ‑2026 Premium
 * - Texto / imágenes / PDFs / adjuntos
 * - Avatar + estado online
 * - Animación suave
 * - Fecha normalizada
 */

export default function MensajeBubble({ mensaje, usuarioId, avatarUrl, online }) {
  const propio = mensaje.remitente_id === usuarioId;

  // URL completa del archivo
  const archivoFullUrl = useMemo(() => {
    if (!mensaje.archivo_url) return null;
    return `${import.meta.env.VITE_API_URL}${mensaje.archivo_url}`;
  }, [mensaje.archivo_url]);

  // Tipo de archivo
  const tipoArchivo = useMemo(() => {
    const url = mensaje.archivo_url;
    if (!url) return null;

    if (/\.(jpg|jpeg|png|gif)$/i.test(url)) return "imagen";
    if (/\.pdf$/i.test(url)) return "pdf";
    return "otro";
  }, [mensaje.archivo_url]);

  // Fecha normalizada
  const fecha = useMemo(() => {
    try {
      const d = new Date(mensaje.fecha);
      return d.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return mensaje.fecha || "";
    }
  }, [mensaje.fecha]);

  return (
    <div
      className={`
        flex items-start gap-2 my-2 animate-fadeIn
        ${propio ? "justify-end" : ""}
      `}
    >
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
          <p className="text-gray-800 whitespace-pre-wrap">{mensaje.contenido}</p>
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
          {fecha}
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
