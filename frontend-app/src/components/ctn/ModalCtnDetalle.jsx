import {
  useEffect,
  useMemo,
  useCallback,
} from "react";

/**
 * ModalCtnDetalle
 *
 * Ficha completa de una notaría.
 *
 * Incluye:
 * - Datos principales
 * - Ubicación
 * - Google Maps
 * - Resumen de firmas
 * - Cierre con ESC
 * - Cierre haciendo click fuera
 * - Diseño ERP claro y profesional
 * - Responsive
 */

export default function ModalCtnDetalle({
  open,
  onClose,
  notaria,
  firmas,
}) {
  // ============================================================
  // CERRAR CON ESC
  // ============================================================

  useEffect(() => {
    if (!open) return;

    const handler = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  // ============================================================
  // DIRECCIÓN COMPLETA
  // ============================================================

  const direccionTexto = useMemo(() => {
    return [
      notaria?.direccion,
      notaria?.cp,
      notaria?.municipio,
      notaria?.provincia,
    ]
      .filter(Boolean)
      .join(", ");
  }, [notaria]);

  // ============================================================
  // GOOGLE MAPS
  // ============================================================

  const mapaUrl = useMemo(() => {
    if (!direccionTexto) {
      return "";
    }

    return (
      "https://www.google.com/maps" +
      "?q=" +
      encodeURIComponent(direccionTexto) +
      "&output=embed"
    );
  }, [direccionTexto]);

  // ============================================================
  // CLICK INTERNO
  // ============================================================

  const stopPropagation = useCallback((event) => {
    event.stopPropagation();
  }, []);

  // ============================================================
  // NORMALIZAR VC
  // ============================================================

  const esVideoconferencia = useMemo(() => {
    const valor = String(notaria?.vc || "")
      .trim()
      .toUpperCase();

    return (
      valor === "SI" ||
      valor === "SÍ" ||
      valor === "VC" ||
      valor === "VIDEOCONFERENCIA" ||
      valor === "TRUE" ||
      valor === "1"
    );
  }, [notaria?.vc]);

  // ============================================================
  // NOMBRE COMPLETO
  // ============================================================

  const nombreCompleto = useMemo(() => {
    return [
      notaria?.nombre,
      notaria?.apellidos,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || "Notaría";
  }, [notaria]);

  // ============================================================
  // NO MOSTRAR
  // ============================================================

  if (!open || !notaria) {
    return null;
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-900/40
        backdrop-blur-sm
        p-3
        sm:p-6
      "
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ctn-modal-title"
    >
      <div
        className="
          w-full
          max-w-4xl
          max-h-[92vh]
          overflow-hidden
          bg-white
          border
          border-[var(--erp-border)]
          rounded-2xl
          shadow-2xl
          animate-fade-in
          flex
          flex-col
        "
        onClick={stopPropagation}
      >
        {/* ==================================================
            CABECERA
           ================================================== */}

        <div
          className="
            shrink-0
            bg-white
            border-b
            border-[var(--erp-border)]
            px-5
            py-4
            sm:px-6
            sm:py-5
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-[var(--erp-primary)]
              "
            >
              CTN · Notaría
            </p>

            <h2
              id="ctn-modal-title"
              className="
                mt-1
                text-xl
                sm:text-2xl
                font-bold
                text-[var(--erp-text)]
                truncate
              "
            >
              {nombreCompleto}
            </h2>

            <p className="text-sm text-[var(--erp-text-soft)] mt-1">
              Ficha #{notaria.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ficha de notaría"
            className="
              shrink-0
              w-9
              h-9
              rounded-xl
              bg-slate-50
              border
              border-[var(--erp-border)]
              text-slate-500
              hover:bg-slate-100
              hover:text-slate-800
              hover:border-slate-300
              transition-all
              duration-200
            "
          >
            ✕
          </button>
        </div>

        {/* ==================================================
            CONTENIDO
           ================================================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            p-4
            sm:p-6
            space-y-6
          "
        >
          {/* ==================================================
              DATOS PRINCIPALES
             ================================================== */}

          <section>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[var(--erp-text)]">
                Datos principales
              </h3>

              <p className="text-sm text-[var(--erp-text-soft)] mt-1">
                Información registrada de la notaría.
              </p>
            </div>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
              "
            >
              <Dato
                label="Código"
                value={notaria.codigo}
              />

              <Dato
                label="NIF"
                value={notaria.nif}
              />

              <Dato
                label="Teléfono"
                value={notaria.telefono}
              />

              <Dato
                label="Provincia"
                value={notaria.provincia}
              />

              <Dato
                label="Municipio"
                value={notaria.municipio}
              />

              <Dato
                label="Código postal"
                value={notaria.cp}
              />

              <Dato
                label="Dirección"
                value={notaria.direccion}
                className="sm:col-span-2"
              />

              <Dato
                label="Videoconferencia"
                value={esVideoconferencia ? "Sí" : "No"}
              />

              <Dato
                label="Apoderado"
                value={notaria.apoderado}
              />

              <Dato
                label="Observación"
                value={notaria.observacion}
                className="sm:col-span-2 lg:col-span-3"
              />
            </div>
          </section>

          {/* ==================================================
              MAPA
             ================================================== */}

          <section>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[var(--erp-text)]">
                Ubicación
              </h3>

              <p className="text-sm text-[var(--erp-text-soft)] mt-1 break-words">
                {direccionTexto || "Dirección no disponible"}
              </p>
            </div>

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-surface-soft)]
              "
            >
              {mapaUrl ? (
                <iframe
                  src={mapaUrl}
                  title={`Ubicación de ${nombreCompleto}`}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div
                  className="
                    h-[300px]
                    flex
                    items-center
                    justify-center
                    px-6
                    text-center
                    text-sm
                    text-[var(--erp-text-soft)]
                  "
                >
                  No hay dirección disponible
                  para mostrar el mapa.
                </div>
              )}
            </div>
          </section>

          {/* ==================================================
              FIRMAS
             ================================================== */}

          {firmas && (
            <section>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[var(--erp-text)]">
                  Actividad de firmas
                </h3>

                <p className="text-sm text-[var(--erp-text-soft)] mt-1">
                  Resumen de actividad asociada a la notaría.
                </p>
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-3
                  gap-4
                "
              >
                <ResumenFirma
                  label="Total firmas"
                  value={firmas.total_firmas}
                  color="blue"
                />

                <ResumenFirma
                  label="Videoconferencia"
                  value={firmas.total_vc}
                  color="green"
                />

                <ResumenFirma
                  label="Presencial"
                  value={firmas.total_presencial}
                  color="purple"
                />
              </div>
            </section>
          )}
        </div>

        {/* ==================================================
            FOOTER
           ================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-[var(--erp-border)]
            bg-[var(--erp-surface-soft)]
            px-5
            py-4
            sm:px-6
            flex
            justify-end
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              px-4
              py-2.5
              rounded-xl
              bg-[var(--erp-primary)]
              hover:bg-[var(--erp-primary-dark)]
              text-white
              font-medium
              shadow-sm
              hover:shadow-md
              transition-all
              duration-200
              active:scale-[0.98]
            "
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}


/* ============================================================
   DATO
   ============================================================ */

function Dato({
  label,
  value,
  className = "",
}) {
  return (
    <div
      className={`
        rounded-xl
        bg-[var(--erp-surface-soft)]
        border
        border-[var(--erp-border)]
        p-4
        transition-colors
        duration-200
        hover:bg-slate-50
        ${className}
      `}
    >
      <p
        className="
          text-xs
          font-semibold
          uppercase
          tracking-wide
          text-[var(--erp-text-soft)]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-sm
          font-medium
          text-[var(--erp-text)]
          break-words
        "
      >
        {value || "—"}
      </p>
    </div>
  );
}


/* ============================================================
   RESUMEN FIRMA
   ============================================================ */

function ResumenFirma({
  label,
  value,
  color,
}) {
  const estilos = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700",
    },

    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-700",
    },

    purple: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-700",
    },
  };

  const estilo = estilos[color] || estilos.blue;

  return (
    <div
      className={`
        ${estilo.bg}
        ${estilo.border}
        border
        rounded-2xl
        p-5
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-sm
      `}
    >
      <p className="text-sm text-[var(--erp-text-soft)]">
        {label}
      </p>

      <p
        className={`
          mt-2
          text-3xl
          font-bold
          ${estilo.text}
        `}
      >
        {value ?? 0}
      </p>
    </div>
  );
}
