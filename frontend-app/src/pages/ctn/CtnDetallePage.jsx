import { useEffect, useCallback, useMemo } from "react";
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

  // ==========================================================
  // CARGAR
  // ==========================================================

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

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading || !datosNotaria) {
    return (
      <div className="erp-page min-h-screen p-6">

        <div className="erp-card p-10">

          <div className="flex flex-col items-center justify-center">

            <div
              className="
                w-10
                h-10
                rounded-full
                border-4
                border-[var(--erp-border)]
                border-t-[var(--erp-primary)]
                animate-spin
              "
            />

            <p
              className="
                mt-4
                text-sm
                text-[var(--erp-text-soft)]
              "
            >
              Cargando notaría…
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="erp-page min-h-screen p-6 space-y-6">

      {/* ======================================================
          CABECERA
         ====================================================== */}

      <div className="erp-card p-6">

        <div className="flex items-start gap-4">

          <div
            className="
              flex
              items-center
              justify-center
              w-12
              h-12
              rounded-2xl
              bg-[var(--erp-primary-soft)]
              text-[var(--erp-primary)]
              border border-[var(--erp-border)]
              shrink-0
            "
          >
            <span className="text-lg font-bold">
              CTN
            </span>
          </div>

          <div className="min-w-0">

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                gap-2
              "
            >

              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  font-bold
                  tracking-tight
                  text-[var(--erp-text)]
                "
              >
                {datosNotaria.nombre || "—"}{" "}
                {datosNotaria.apellidos || ""}
              </h1>

              <span
                className="
                  inline-flex
                  w-fit
                  items-center
                  rounded-full
                  bg-[var(--erp-primary-soft)]
                  border border-[var(--erp-border)]
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-[var(--erp-primary)]
                "
              >
                Notaría #{datosNotaria.id}
              </span>

            </div>

            <p
              className="
                mt-1
                text-sm
                text-[var(--erp-text-soft)]
              "
            >
              Ficha completa de la notaría.
            </p>

          </div>

        </div>

      </div>

      {/* ======================================================
          DATOS PRINCIPALES
         ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ----------------------------------------------------
            IDENTIFICACIÓN
           ---------------------------------------------------- */}

        <section className="erp-card p-6">

          <div className="mb-5">

            <h2
              className="
                text-lg
                font-bold
                text-[var(--erp-text)]
              "
            >
              Identificación
            </h2>

            <p
              className="
                text-sm
                text-[var(--erp-text-soft)]
                mt-1
              "
            >
              Datos básicos de la notaría.
            </p>

          </div>

          <div className="space-y-4">

            <Dato
              etiqueta="Código"
              valor={datosNotaria.codigo}
            />

            <Dato
              etiqueta="NIF"
              valor={datosNotaria.nif}
            />

            <Dato
              etiqueta="Teléfono"
              valor={datosNotaria.telefono}
            />

            <Dato
              etiqueta="VC"
              valor={datosNotaria.vc}
            />

          </div>

        </section>

        {/* ----------------------------------------------------
            UBICACIÓN
           ---------------------------------------------------- */}

        <section className="erp-card p-6">

          <div className="mb-5">

            <h2
              className="
                text-lg
                font-bold
                text-[var(--erp-text)]
              "
            >
              Ubicación
            </h2>

            <p
              className="
                text-sm
                text-[var(--erp-text-soft)]
                mt-1
              "
            >
              Localización y dirección.
            </p>

          </div>

          <div className="space-y-4">

            <Dato
              etiqueta="Provincia"
              valor={datosNotaria.provincia}
            />

            <Dato
              etiqueta="Municipio"
              valor={datosNotaria.municipio}
            />

            <Dato
              etiqueta="Código postal"
              valor={datosNotaria.cp}
            />

            <Dato
              etiqueta="Dirección"
              valor={datosNotaria.direccion}
            />

          </div>

        </section>

        {/* ----------------------------------------------------
            GESTIÓN
           ---------------------------------------------------- */}

        <section className="erp-card p-6">

          <div className="mb-5">

            <h2
              className="
                text-lg
                font-bold
                text-[var(--erp-text)]
              "
            >
              Gestión
            </h2>

            <p
              className="
                text-sm
                text-[var(--erp-text-soft)]
                mt-1
              "
            >
              Información de gestión asociada.
            </p>

          </div>

          <div className="space-y-4">

            <Dato
              etiqueta="Apoderado"
              valor={datosNotaria.apoderado}
            />

            <Dato
              etiqueta="Observación"
              valor={datosNotaria.observacion}
            />

          </div>

        </section>

      </div>

      {/* ======================================================
          FIRMAS
         ====================================================== */}

      {datosFirmas && (
        <section className="erp-card p-6">

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-4
              mb-6
            "
          >

            <div>

              <h2
                className="
                  text-xl
                  font-bold
                  text-[var(--erp-text)]
                "
              >
                Actividad de firmas
              </h2>

              <p
                className="
                  text-sm
                  text-[var(--erp-text-soft)]
                  mt-1
                "
              >
                Resumen de firmas asociadas a esta notaría.
              </p>

            </div>

            <div
              className="
                inline-flex
                items-center
                w-fit
                rounded-full
                bg-[var(--erp-primary-soft)]
                border border-[var(--erp-border)]
                px-3
                py-1.5
                text-xs
                font-semibold
                text-[var(--erp-primary)]
              "
            >
              {datosFirmas.total_firmas ?? 0} firmas
            </div>

          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-4
            "
          >

            {/* Total */}

            <ResumenFirma
              titulo="Total"
              valor={datosFirmas.total_firmas}
              descripcion="Firmas registradas"
              clase="text-[var(--erp-primary)] bg-[var(--erp-primary-soft)]"
            />

            {/* VC */}

            <ResumenFirma
              titulo="VC"
              valor={datosFirmas.total_vc}
              descripcion="Firmas por videoconferencia"
              clase="text-green-600 bg-green-50"
            />

            {/* Presencial */}

            <ResumenFirma
              titulo="Presencial"
              valor={datosFirmas.total_presencial}
              descripcion="Firmas presenciales"
              clase="text-purple-600 bg-purple-50"
            />

          </div>

        </section>
      )}

    </div>
  );
}

// ============================================================
// COMPONENTE DATO
// ============================================================

function Dato({ etiqueta, valor }) {
  return (
    <div
      className="
        border-b
        border-[var(--erp-border)]
        pb-3
        last:border-b-0
        last:pb-0
      "
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
        {etiqueta}
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
        {valor || "—"}
      </p>

    </div>
  );
}

// ============================================================
// COMPONENTE RESUMEN FIRMAS
// ============================================================

function ResumenFirma({
  titulo,
  valor,
  descripcion,
  clase,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[var(--erp-border)]
        bg-[var(--erp-surface-soft)]
        p-5
      "
    >

      <div className="flex items-start justify-between gap-3">

        <div>

          <p
            className="
              text-sm
              font-semibold
              text-[var(--erp-text)]
            "
          >
            {titulo}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-[var(--erp-text-soft)]
            "
          >
            {descripcion}
          </p>

        </div>

        <div
          className={`
            flex
            items-center
            justify-center
            w-10
            h-10
            rounded-xl
            font-bold
            ${clase}
          `}
        >
          {valor ?? 0}
        </div>

      </div>

      <p
        className="
          mt-5
          text-3xl
          font-bold
          text-[var(--erp-text)]
        "
      >
        {valor ?? 0}
      </p>

    </div>
  );
}
