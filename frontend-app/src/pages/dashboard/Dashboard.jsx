import { useEffect, useCallback } from "react";
import { useDashboard } from "../../hooks/useDashboard";

import IconCalendar from "../../icons/IconCalendar.jsx";
import IconWeek from "../../icons/IconWeek.jsx";
import IconMonth from "../../icons/IconMonth.jsx";
import IconClock from "../../icons/IconClock.jsx";

export default function Dashboard() {
  const { data, loading, cargarDashboard } = useDashboard();

  const cargar = useCallback(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div className="erp-page min-h-screen p-6">

      {/* ======================================================
          CABECERA
         ====================================================== */}

      <div className="mb-7">
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
            <IconCalendar className="w-6 h-6" />
          </div>

          <div>
            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-[var(--erp-text)]
              "
            >
              Panel de actividad
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-[var(--erp-text-soft)]
              "
            >
              Resumen de actividad de la agenda.
            </p>
          </div>

        </div>
      </div>

      {/* ======================================================
          CARGANDO
         ====================================================== */}

      {loading && (
        <div className="space-y-6">

          {/* Skeleton tarjetas */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  bg-white
                  border border-[var(--erp-border)]
                  rounded-2xl
                  p-5
                  shadow-sm
                  animate-pulse
                "
              >
                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-[var(--erp-surface-soft)]
                    "
                  />

                  <div className="flex-1 space-y-2">
                    <div
                      className="
                        h-3
                        w-24
                        rounded
                        bg-[var(--erp-surface-soft)]
                      "
                    />

                    <div
                      className="
                        h-3
                        w-32
                        rounded
                        bg-[var(--erp-surface-soft)]
                      "
                    />
                  </div>

                </div>

                <div
                  className="
                    mt-5
                    h-8
                    w-16
                    rounded
                    bg-[var(--erp-surface-soft)]
                  "
                />
              </div>
            ))}

          </div>

          {/* Skeleton panel */}

          <div className="erp-card p-6 animate-pulse">

            <div className="flex items-center justify-between mb-6">

              <div className="space-y-2">
                <div
                  className="
                    h-5
                    w-40
                    rounded
                    bg-[var(--erp-surface-soft)]
                  "
                />

                <div
                  className="
                    h-3
                    w-64
                    rounded
                    bg-[var(--erp-surface-soft)]
                  "
                />
              </div>

              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-[var(--erp-surface-soft)]
                "
              />

            </div>

            <div
              className="
                h-20
                rounded-xl
                bg-[var(--erp-surface-soft)]
              "
            />

          </div>

        </div>
      )}

      {/* ======================================================
          CONTENIDO
         ====================================================== */}

      {!loading && data && (
        <>

          {/* ==================================================
              RESUMEN
             ================================================== */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-4
              gap-4
              mb-6
            "
          >

            {/* ==================================================
                PRÓXIMAS
               ================================================== */}

            <div
              className="
                group
                relative
                overflow-hidden
                bg-white
                border border-blue-200
                rounded-2xl
                p-5
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-md
              "
            >

              {/* Línea lateral */}

              <div
                className="
                  absolute
                  left-0
                  top-0
                  bottom-0
                  w-1
                  bg-blue-500
                "
              />

              <div className="flex items-start justify-between gap-3">

                <div>

                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-blue-600
                    "
                  >
                    Próximas
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-[var(--erp-text-soft)]
                    "
                  >
                    Citas pendientes
                  </p>

                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    rounded-xl
                    bg-blue-50
                    text-[var(--erp-primary)]
                    shrink-0
                  "
                >
                  <IconCalendar className="w-5 h-5" />
                </div>

              </div>

              <div className="mt-5 flex items-end gap-2">

                <span
                  className="
                    text-4xl
                    leading-none
                    font-bold
                    tracking-tight
                    text-[var(--erp-primary)]
                  "
                >
                  {data.proximas.length}
                </span>

                <span
                  className="
                    mb-1
                    text-xs
                    text-[var(--erp-text-soft)]
                  "
                >
                  citas
                </span>

              </div>

            </div>

            {/* ==================================================
                VC
               ================================================== */}

            <div
              className="
                group
                relative
                overflow-hidden
                bg-white
                border border-green-200
                rounded-2xl
                p-5
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-md
              "
            >

              <div
                className="
                  absolute
                  left-0
                  top-0
                  bottom-0
                  w-1
                  bg-green-500
                "
              />

              <div className="flex items-start justify-between gap-3">

                <div>

                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-green-600
                    "
                  >
                    VC realizadas
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-[var(--erp-text-soft)]
                    "
                  >
                    Videoconferencias
                  </p>

                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    rounded-xl
                    bg-green-50
                    text-[var(--erp-success)]
                    shrink-0
                  "
                >
                  <IconWeek className="w-5 h-5" />
                </div>

              </div>

              <div className="mt-5 flex items-end gap-2">

                <span
                  className="
                    text-4xl
                    leading-none
                    font-bold
                    tracking-tight
                    text-[var(--erp-success)]
                  "
                >
                  {data.realizadasVC.length}
                </span>

                <span
                  className="
                    mb-1
                    text-xs
                    text-[var(--erp-text-soft)]
                  "
                >
                  realizadas
                </span>

              </div>

            </div>

            {/* ==================================================
                PRESENCIAL
               ================================================== */}

            <div
              className="
                group
                relative
                overflow-hidden
                bg-white
                border border-purple-200
                rounded-2xl
                p-5
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-md
              "
            >

              <div
                className="
                  absolute
                  left-0
                  top-0
                  bottom-0
                  w-1
                  bg-purple-500
                "
              />

              <div className="flex items-start justify-between gap-3">

                <div>

                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-purple-600
                    "
                  >
                    Presencial
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-[var(--erp-text-soft)]
                    "
                  >
                    Citas presenciales
                  </p>

                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    rounded-xl
                    bg-purple-50
                    text-purple-600
                    shrink-0
                  "
                >
                  <IconMonth className="w-5 h-5" />
                </div>

              </div>

              <div className="mt-5 flex items-end gap-2">

                <span
                  className="
                    text-4xl
                    leading-none
                    font-bold
                    tracking-tight
                    text-purple-600
                  "
                >
                  {data.realizadasPresencial.length}
                </span>

                <span
                  className="
                    mb-1
                    text-xs
                    text-[var(--erp-text-soft)]
                  "
                >
                  realizadas
                </span>

              </div>

            </div>

            {/* ==================================================
                TOTAL MES
               ================================================== */}

            <div
              className="
                group
                relative
                overflow-hidden
                bg-white
                border border-[var(--erp-border)]
                rounded-2xl
                p-5
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-md
              "
            >

              <div
                className="
                  absolute
                  left-0
                  top-0
                  bottom-0
                  w-1
                  bg-[var(--erp-primary)]
                "
              />

              <div className="flex items-start justify-between gap-3">

                <div>

                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-[var(--erp-primary)]
                    "
                  >
                    Total mes
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-[var(--erp-text-soft)]
                    "
                  >
                    Actividad mensual
                  </p>

                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    rounded-xl
                    bg-[var(--erp-primary-soft)]
                    text-[var(--erp-primary)]
                    shrink-0
                  "
                >
                  <IconMonth className="w-5 h-5" />
                </div>

              </div>

              <div className="mt-5 flex items-end gap-2">

                <span
                  className="
                    text-4xl
                    leading-none
                    font-bold
                    tracking-tight
                    text-[var(--erp-text)]
                  "
                >
                  {data.totalMes}
                </span>

                <span
                  className="
                    mb-1
                    text-xs
                    text-[var(--erp-text-soft)]
                  "
                >
                  citas
                </span>

              </div>

            </div>

          </div>

          {/* ==================================================
              PRÓXIMAS CITAS
             ================================================== */}

          <div className="erp-card p-6">

            {/* Cabecera */}

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

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-11
                    h-11
                    rounded-xl
                    bg-[var(--erp-primary-soft)]
                    text-[var(--erp-primary)]
                    shrink-0
                  "
                >
                  <IconCalendar className="w-5 h-5" />
                </div>

                <div>

                  <h2
                    className="
                      text-xl
                      font-bold
                      text-[var(--erp-text)]
                    "
                  >
                    Próximas citas
                  </h2>

                  <p
                    className="
                      text-sm
                      text-[var(--erp-text-soft)]
                      mt-1
                    "
                  >
                    Citas pendientes de la agenda.
                  </p>

                </div>

              </div>

              {data.proximas.length > 0 && (
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
                  {data.proximas.length}{" "}
                  {data.proximas.length === 1 ? "cita" : "citas"}
                </div>
              )}

            </div>

            {/* ==================================================
                SIN CITAS
               ================================================== */}

            {data.proximas.length === 0 && (
              <div
                className="
                  rounded-2xl
                  border border-dashed
                  border-[var(--erp-border)]
                  bg-[var(--erp-surface-soft)]
                  p-10
                  text-center
                "
              >

                <div
                  className="
                    mx-auto
                    mb-4
                    flex
                    items-center
                    justify-center
                    w-14
                    h-14
                    rounded-2xl
                    bg-white
                    border border-[var(--erp-border)]
                    text-[var(--erp-text-soft)]
                  "
                >
                  <IconCalendar className="w-6 h-6" />
                </div>

                <p
                  className="
                    font-semibold
                    text-[var(--erp-text)]
                  "
                >
                  No hay citas próximas
                </p>

                <p
                  className="
                    text-sm
                    text-[var(--erp-text-soft)]
                    mt-1
                  "
                >
                  No existen citas pendientes para mostrar.
                </p>

              </div>
            )}

            {/* ==================================================
                LISTADO
               ================================================== */}

            {data.proximas.length > 0 && (
              <ul className="space-y-3">

                {data.proximas.map((c, i) => (
                  <li
                    key={i}
                    className="
                      relative
                      overflow-hidden
                      bg-[var(--erp-surface-soft)]
                      border border-[var(--erp-border)]
                      rounded-2xl
                      p-4
                      transition-all
                      duration-200
                      hover:bg-[var(--erp-primary-soft)]
                      hover:border-blue-200
                      hover:shadow-sm
                    "
                  >

                    {/* Línea de estado */}

                    <div
                      className="
                        absolute
                        left-0
                        top-0
                        bottom-0
                        w-1
                        bg-[var(--erp-primary)]
                      "
                    />

                    <div className="pl-2">

                      {/* Cabecera */}

                      <div
                        className="
                          flex
                          flex-col
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                          gap-2
                          mb-3
                        "
                      >

                        <div className="flex items-center gap-2">

                          <span
                            className="
                              inline-flex
                              items-center
                              justify-center
                              w-2
                              h-2
                              rounded-full
                              bg-[var(--erp-primary)]
                              shrink-0
                            "
                          />

                          <span
                            className="
                              font-semibold
                              text-[var(--erp-text)]
                            "
                          >
                            {c.tipo_firma || "—"}
                          </span>

                        </div>

                        <span
                          className="
                            inline-flex
                            items-center
                            w-fit
                            rounded-full
                            bg-white
                            border border-[var(--erp-border)]
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-[var(--erp-text-soft)]
                          "
                        >
                          {c.fecha}
                        </span>

                      </div>

                      {/* Hora */}

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-sm
                          text-[var(--erp-text-soft)]
                          mb-3
                        "
                      >

                        <IconClock
                          className="
                            w-4
                            h-4
                            text-[var(--erp-primary)]
                            shrink-0
                          "
                        />

                        <span className="font-medium">
                          {c.hora_inicio} → {c.hora_fin}
                        </span>

                      </div>

                      {/* Información */}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">

                        <p
                          className="
                            text-sm
                            text-[var(--erp-text-soft)]
                          "
                        >
                          <span
                            className="
                              font-semibold
                              text-[var(--erp-text)]
                            "
                          >
                            Notario:
                          </span>{" "}
                          {c.notario || "—"}
                        </p>

                        <p
                          className="
                            text-sm
                            text-[var(--erp-text-soft)]
                          "
                        >
                          <span
                            className="
                              font-semibold
                              text-[var(--erp-text)]
                            "
                          >
                            Apoderado:
                          </span>{" "}
                          {c.apoderado || "—"}
                        </p>

                      </div>

                    </div>

                  </li>
                ))}

              </ul>
            )}

          </div>

        </>
      )}

    </div>
  );
}
