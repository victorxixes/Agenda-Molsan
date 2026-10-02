import { useMemo } from "react";

/**
 * MENSAJE BUBBLE — MOLSAN ERP SAAS PREMIUM 2027
 *
 * Soporta:
 * - Texto
 * - Imágenes
 * - PDFs
 * - Otros adjuntos
 * - Avatar
 * - Estado online
 * - Hora
 * - Diseño claro Glass Luxe
 */

export default function MensajeBubble({
  mensaje,
  usuarioId,
  avatarUrl,
  online,
}) {
  const propio =
    mensaje.remitente_id ===
    usuarioId;

  // =========================================================
  // URL ARCHIVO
  // =========================================================

  const archivoFullUrl =
    useMemo(() => {
      if (!mensaje.archivo_url) {
        return null;
      }

      return `${import.meta.env.VITE_API_URL}${mensaje.archivo_url}`;
    }, [mensaje.archivo_url]);

  // =========================================================
  // TIPO ARCHIVO
  // =========================================================

  const tipoArchivo =
    useMemo(() => {
      const url =
        mensaje.archivo_url;

      if (!url) {
        return null;
      }

      if (
        /\.(jpg|jpeg|png|gif|webp)$/i.test(
          url
        )
      ) {
        return "imagen";
      }

      if (/\.pdf$/i.test(url)) {
        return "pdf";
      }

      return "otro";
    }, [mensaje.archivo_url]);

  // =========================================================
  // FECHA
  // =========================================================

  const fecha = useMemo(() => {
    try {
      const d = new Date(
        mensaje.fecha
      );

      if (
        isNaN(d.getTime())
      ) {
        return mensaje.fecha || "";
      }

      return d.toLocaleTimeString(
        "es-ES",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return mensaje.fecha || "";
    }
  }, [mensaje.fecha]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className={`
        flex
        items-end
        gap-2
        my-2
        animate-fadeIn
        ${
          propio
            ? "justify-end"
            : "justify-start"
        }
      `}
    >
      {/* =====================================================
          AVATAR OTRO USUARIO
      ===================================================== */}

      {!propio && (
        <div
          className="
            relative
            h-8
            w-8
            shrink-0
          "
        >
          <img
            src={
              avatarUrl ||
              "/no-foto.png"
            }
            alt=""
            className="
              h-8
              w-8
              rounded-full
              border
              border-slate-200
              bg-white
              object-cover
              shadow-sm
            "
          />

          {online && (
            <span
              className="
                absolute
                bottom-0
                right-0
                h-2.5
                w-2.5
                rounded-full
                border
                border-white
                bg-emerald-500
              "
            />
          )}
        </div>
      )}

      {/* =====================================================
          BURBUJA
      ===================================================== */}

      <div
        className={`
          max-w-[78%]
          rounded-2xl
          px-4
          py-2.5
          shadow-sm
          ${
            propio
              ? `
                rounded-br-md
                border
                border-blue-200
                bg-blue-50
                text-slate-700
              `
              : `
                rounded-bl-md
                border
                border-slate-200
                bg-white
                text-slate-700
              `
          }
        `}
      >
        {/* =================================================
            TEXTO
        ================================================= */}

        {mensaje.contenido && (
          <p
            className="
              whitespace-pre-wrap
              text-sm
              leading-6
              text-slate-700
            "
          >
            {mensaje.contenido}
          </p>
        )}

        {/* =================================================
            IMAGEN
        ================================================= */}

        {tipoArchivo ===
          "imagen" &&
          archivoFullUrl && (
            <a
              href={archivoFullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={
                  archivoFullUrl
                }
                alt="Archivo adjunto"
                className="
                  mt-2
                  max-h-64
                  max-w-full
                  rounded-xl
                  border
                  border-slate-200
                  object-contain
                  shadow-sm
                "
              />
            </a>
          )}

        {/* =================================================
            PDF
        ================================================= */}

        {tipoArchivo ===
          "pdf" &&
          archivoFullUrl && (
            <a
              href={archivoFullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-2
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-red-100
                bg-red-50
                px-3
                py-2.5
                text-sm
                font-medium
                text-red-600
                transition-all
                hover:bg-red-100
              "
            >
              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-white
                  text-sm
                  shadow-sm
                "
              >
                PDF
              </span>

              <span>
                Ver documento PDF
              </span>
            </a>
          )}

        {/* =================================================
            OTRO ARCHIVO
        ================================================= */}

        {tipoArchivo ===
          "otro" &&
          archivoFullUrl && (
            <a
              href={archivoFullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-2
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-blue-100
                bg-blue-50
                px-3
                py-2.5
                text-sm
                font-medium
                text-blue-600
                transition-all
                hover:bg-blue-100
              "
            >
              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-white
                  text-base
                  shadow-sm
                "
              >
                📎
              </span>

              <span>
                Archivo adjunto
              </span>
            </a>
          )}

        {/* =================================================
            HORA
        ================================================= */}

        <div
          className={`
            mt-1.5
            text-[10px]
            ${
              propio
                ? "text-blue-400"
                : "text-slate-400"
            }
          `}
        >
          {fecha}
        </div>
      </div>

      {/* =====================================================
          AVATAR PROPIO
      ===================================================== */}

      {propio && (
        <div
          className="
            h-8
            w-8
            shrink-0
            overflow-hidden
            rounded-full
            border
            border-blue-100
            bg-blue-50
            shadow-sm
          "
        >
          <img
            src={
              avatarUrl ||
              "/no-foto.png"
            }
            alt=""
            className="
              h-full
              w-full
              object-cover
            "
          />
        </div>
      )}
    </div>
  );
}
