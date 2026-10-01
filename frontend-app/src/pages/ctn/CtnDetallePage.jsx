import {
  useEffect,
  useCallback,
  useMemo,
} from "react";

import { useParams } from "react-router-dom";
import { useCtn } from "../../hooks/useCtn";

export default function CtnDetallePage() {
  const { id } = useParams();

  const {
    notaria,
    firmas,
    cargarNotaria,
    cargarFirmasNotaria,
    loading,
  } = useCtn();

  const cargar = useCallback(() => {
    cargarNotaria(id);
    cargarFirmasNotaria(id);
  }, [
    id,
    cargarNotaria,
    cargarFirmasNotaria,
  ]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const datosNotaria = useMemo(
    () => notaria,
    [notaria]
  );

  const datosFirmas = useMemo(
    () => firmas,
    [firmas]
  );

  if (loading) {
    return (
      <div className="erp-page min-h-full p-6">
        <div className="erp-card p-8 text-center">
          <p className="text-sm text-[var(--erp-text-soft)] animate-pulse">
            Cargando notaría…
          </p>
        </div>
      </div>
    );
  }

  if (!datosNotaria) {
    return (
      <div className="erp-page min-h-full p-6">
        <div
          className="
            max-w-[1200px]
            mx-auto
            bg-red-50
            border
            border-red-200
            rounded-xl
            p-5
            text-red-700
          "
        >
          No se ha encontrado la notaría solicitada.
        </div>
      </div>
    );
  }

  const nombreCompleto =
    [
      datosNotaria.nombre,
      datosNotaria.apellidos,
    ]
      .filter(Boolean)
      .join(" ") || "Notaría";

  return (
    <div
      className="
        erp-page
        min-h-full
        p-4
        sm:p-6
        lg:p-8
        text-[var(--erp-text)]
        animate-fade-in
      "
    >
      <div className="max-w-[1400px] mx-auto space-y-6">

        {/* ==================================================
            CABECERA
           ================================================== */}

        <div>
          <p className="text-sm text-[var(--erp-text-soft)] mb-1">
            CTN / Notarías / Detalle
          </p>

          <h1 className="text-3xl font-bold text-[var(--erp-text)]">
            {nombreCompleto}
          </h1>

          <p className="mt-1 text-sm text-[var(--erp-text-soft)]">
            Ficha completa de la notaría #{datosNotaria.id}
          </p>
        </div>

        {/* ==================================================
            DATOS PRINCIPALES
           ================================================== */}

        <section className="erp-card p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Datos de la notaría
            </h2>

            <p className="text-sm text-[var(--erp-text-soft)] mt-1">
              Información principal registrada en CTN.
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-x-8
              gap-y-5
            "
          >
            <Dato
              label="Código"
              value={datosNotaria.codigo}
            />

            <Dato
              label="NIF"
              value={datosNotaria.nif}
            />

            <Dato
              label="Teléfono"
              value={datosNotaria.telefono}
            />

            <Dato
              label="Provincia"
              value={datosNotaria.provincia}
            />

            <Dato
              label="Municipio"
              value={datosNotaria.municipio}
            />

            <Dato
              label="Código postal"
              value={datosNotaria.cp}
            />

            <Dato
              label="Dirección"
              value={datosNotaria.direccion}
              className="lg:col-span-2"
            />

            <Dato
              label="Videoconferencia"
              value={
                datosNotaria.vc
                  ? "Sí"
                  : "No"
              }
            />

            <Dato
              label="Apoderado"
              value={datosNotaria.apoderado}
            />

            <Dato
              label="Observación"
              value={
                datosNotaria.observacion
              }
              className="sm:col-span-2 lg:col-span-3"
            />
          </div>
        </section>

        {/* ==================================================
            FIRMAS
           ================================================== */}

        {datosFirmas && (
          <section className="erp-card p-6 shadow-sm">

            <div className="mb-5">
              <h2 className="text-xl font-semibold">
                Actividad de firmas
              </h2>

              <p className="text-sm text-[var(--erp-text-soft)] mt-1">
                Resumen de firmas asociadas a esta notaría.
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
                value={datosFirmas.total_firmas}
                color="blue"
              />

              <ResumenFirma
                label="Videoconferencia"
                value={datosFirmas.total_vc}
                color="green"
              />

              <ResumenFirma
                label="Presencial"
                value={datosFirmas.total_presencial}
                color="purple"
              />
            </div>

          </section>
        )}

      </div>
    </div>
  );
}


/* ============================================================
   COMPONENTES AUXILIARES
   ============================================================ */

function Dato({
  label,
  value,
  className = "",
}) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--erp-text-soft)]">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-[var(--erp-text)] break-words">
        {value || "—"}
      </p>
    </div>
  );
}


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

  const estilo =
    estilos[color] || estilos.blue;

  return (
    <div
      className={`
        ${estilo.bg}
        ${estilo.border}
        border
        rounded-2xl
        p-5
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
