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
          CABECERA DEL DASHBOARD
         ====================================================== */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--erp-text)]">
          Panel de actividad
        </h1>

        <p className="mt-1 text-sm text-[var(--erp-text-soft)]">
          Resumen de actividad de la agenda.
        </p>
      </div>

      {/* ======================================================
          CARGANDO
         ====================================================== */}

      {loading && (
        <div className="erp-card p-6">
          <p className="text-sm text-[var(--erp-text-soft)]">
            Cargando…
          </p>
        </div>
      )}

      {/* ======================================================
          CONTENIDO
         ====================================================== */}

      {!loading && data && (
        <>
          {/* ==================================================
              BLOQUES RESUMEN
             ================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

            {/* ----------------------------------------------
                PRÓXIMAS CITAS
               ---------------------------------------------- */}

            <div
              className="
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
              <div className="flex items-center gap-3 mb-2">
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
                  "
                >
                  <IconCalendar className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--erp-text)]">
                    Próximas
                  </h3>

                  <p className="text-xs text-[var(--erp-text-soft)]">
                    Citas pendientes
                  </p>
                </div>
              </div>

              <p className="text-3xl font-bold text-[var(--erp-primary)]">
                {data.proximas.length}
              </p>
            </div>

            {/* ----------------------------------------------
                VC REALIZADAS
               ---------------------------------------------- */}

            <div
              className="
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
              <div className="flex items-center gap-3 mb-2">
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
                  "
                >
                  <IconWeek className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--erp-text)]">
                    VC realizadas
                  </h3>

                  <p className="text-xs text-[var(--erp-text-soft)]">
                    Videoconferencias
                  </p>
                </div>
              </div>

              <p className="text-3xl font-bold text-[var(--erp-success)]">
                {data.realizadasVC.length}
              </p>
            </div>

            {/* ----------------------------------------------
                PRESENCIAL REALIZADAS
               ---------------------------------------------- */}

            <div
              className="
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
              <div className="flex items-center gap-3 mb-2">
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
                  "
                >
                  <IconMonth className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--erp-text)]">
                    Presencial realizadas
                  </h3>

                  <p className="text-xs text-[var(--erp-text-soft)]">
                    Citas presenciales
                  </p>
                </div>
              </div>

              <p className="text-3xl font-bold text-purple-600">
                {data.realizadasPresencial.length}
              </p>
            </div>

            {/* ----------------------------------------------
                TOTAL MES
               ---------------------------------------------- */}

            <div
              className="
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
              <div className="flex items-center gap-3 mb-2">
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
                  "
                >
                  <IconMonth className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--erp-text)]">
                    Total mes
                  </h3>

                  <p className="text-xs text-[var(--erp-text-soft)]">
                    Actividad mensual
                  </p>
                </div>
              </div>

              <p className="text-3xl font-bold text-[var(--erp-text)]">
                {data.totalMes}
              </p>
            </div>
          </div>

          {/* ==================================================
              PRÓXIMAS CITAS
             ================================================== */}

          <div className="erp-card p-6">

            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-[var(--erp-text)]">
                  Próximas citas
                </h2>

                <p className="text-sm text-[var(--erp-text-soft)] mt-1">
                  Citas pendientes de la agenda.
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
                "
              >
                <IconCalendar className="w-5 h-5" />
              </div>
            </div>

            {/* ----------------------------------------------
                SIN CITAS
               ---------------------------------------------- */}

            {data.proximas.length === 0 && (
              <div
                className="
                  rounded-xl
                  border border-dashed
                  border-[var(--erp-border)]
                  bg-[var(--erp-surface-soft)]
                  p-8
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
                    mb-3
                    flex
                    items-center
                    justify-center
                    w-12
                    h-12
                    rounded-full
                    bg-white
                    border border-[var(--erp-border)]
                    text-[var(--erp-text-soft)]
                  "
                >
                  <IconCalendar className="w-5 h-5" />
                </div>

                <p className="font-medium text-[var(--erp-text)]">
                  No hay citas próximas.
                </p>

                <p className="text-sm text-[var(--erp-text-soft)] mt-1">
                  No existen citas pendientes para mostrar.
                </p>
              </div>
            )}

            {/* ----------------------------------------------
                LISTADO DE CITAS
               ---------------------------------------------- */}

            {data.proximas.length > 0 && (
              <ul className="space-y-3">
                {data.proximas.map((c, i) => (
                  <li
                    key={i}
                    className="
                      bg-[var(--erp-surface-soft)]
                      border border-[var(--erp-border)]
                      rounded-xl
                      p-4
                      transition-all
                      duration-200
                      hover:bg-[var(--erp-primary-soft)]
                      hover:border-blue-200
                      hover:shadow-sm
                    "
                  >
                    {/* Cabecera de la cita */}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">

                      <span
                        className="
                          font-semibold
                          text-[var(--erp-text)]
                        "
                      >
                        {c.tipo_firma || "—"}
                      </span>

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
                        mb-2
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

                      <span>
                        {c.hora_inicio} → {c.hora_fin}
                      </span>
                    </div>

                    {/* Notario */}

                    <p className="text-sm text-[var(--erp-text-soft)]">
                      <span className="font-semibold text-[var(--erp-text)]">
                        Notario:
                      </span>{" "}
                      {c.notario || "—"}
                    </p>

                    {/* Apoderado */}

                    <p className="text-sm text-[var(--erp-text-soft)] mt-1">
                      <span className="font-semibold text-[var(--erp-text)]">
                        Apoderado:
                      </span>{" "}
                      {c.apoderado || "—"}
                    </p>
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
