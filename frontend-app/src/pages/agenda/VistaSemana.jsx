import React, { useMemo, useCallback } from "react";
import { useAgendaStore } from "../../store/agendaStore";

/**
 * VistaSemana — SJ-2026
 *
 * Vista semanal del calendario.
 *
 * La lógica de citas se mantiene intacta.
 * El componente utiliza el tema ERP claro.
 */

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie"];

const HORAS = Array.from(
  { length: 12 },
  (_, i) => `${9 + i}:00`
);

/**
 * Color visual según el tipo de cita.
 *
 * Se utilizan fondos suaves para mantener
 * buena legibilidad sobre el fondo claro.
 */
const colorPorTipo = (tipo) => {
  switch (tipo) {
    case "Firma notarial":
      return `
        bg-blue-50
        border-blue-200
        text-blue-800
      `;

    case "Reunión":
      return `
        bg-green-50
        border-green-200
        text-green-800
      `;

    default:
      return `
        bg-slate-50
        border-slate-200
        text-slate-800
      `;
  }
};

export default function VistaSemana({
  fechaBase,
  citas = [],
  onCitaClick,
  onCrearCita,
}) {
  const resaltadaId = useAgendaStore(
    (s) => s.resaltadaId
  );

  // ============================================================
  // CITAS SEGURAS
  // ============================================================

  const citasSeguras = useMemo(
    () => (Array.isArray(citas) ? citas : []),
    [citas]
  );

  // ============================================================
  // OBTENER FECHA DEL DÍA
  // ============================================================

  const obtenerFechaDia = useCallback(
    (idx) => {
      const fecha = new Date(fechaBase);

      fecha.setDate(
        fecha.getDate() + idx
      );

      return fecha.toLocaleDateString("sv-SE");
    },
    [fechaBase]
  );

  // ============================================================
  // AGRUPAR CITAS POR DÍA Y HORA
  // ============================================================

  const citasPorDiaHora = useMemo(() => {
    const mapa = {};

    citasSeguras.forEach((c) => {
      const fechaCita = new Date(
        `${c.fecha}T12:00:00`
      );

      const diaSemana = fechaCita.getDay();

      const idxDia = diaSemana - 1;

      if (
        idxDia < 0 ||
        idxDia > 4
      ) {
        return;
      }

      const hora =
        c.hora_inicio.split(":")[0];

      const clave =
        `${idxDia}-${hora}`;

      if (!mapa[clave]) {
        mapa[clave] = [];
      }

      mapa[clave].push(c);
    });

    return mapa;
  }, [citasSeguras]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="
        grid
        grid-cols-[70px,repeat(5,minmax(0,1fr))]
        gap-2
        text-xs
        bg-slate-50
        border
        border-slate-200
        rounded-2xl
        p-4
        shadow-sm
        animate-fade-in
        overflow-x-auto
      "
    >
      {/* ======================================================
          CABECERA VACÍA
          ====================================================== */}

      <div />

      {/* ======================================================
          CABECERA DE DÍAS
          ====================================================== */}

      {DIAS.map((d) => (
        <div
          key={d}
          className="
            text-center
            font-semibold
            text-slate-700
            tracking-wide
            py-2
            bg-white
            border
            border-slate-200
            rounded-xl
          "
        >
          {d}
        </div>
      ))}

      {/* ======================================================
          FILAS DE HORAS
          ====================================================== */}

      {HORAS.map((h) => {
        const horaBloque =
          h.split(":")[0];

        return (
          <React.Fragment key={h}>
            {/* ------------------------------------------------
                HORA
                ------------------------------------------------ */}

            <div
              className="
                h-20
                flex
                items-start
                justify-end
                pr-3
                pt-2
                text-slate-500
                font-medium
              "
            >
              {h}
            </div>

            {/* ------------------------------------------------
                DÍAS
                ------------------------------------------------ */}

            {DIAS.map((_, idx) => {
              const clave =
                `${idx}-${horaBloque}`;

              const citasEnCelda =
                citasPorDiaHora[clave] || [];

              return (
                <div
                  key={`${h}-${idx}`}
                  className="
                    h-20
                    border
                    border-slate-200
                    rounded-xl
                    bg-white
                    hover:bg-blue-50/50
                    hover:border-blue-200
                    transition-all
                    duration-200
                    cursor-pointer
                    relative
                  "
                  onDoubleClick={() =>
                    onCrearCita(
                      obtenerFechaDia(idx)
                    )
                  }
                >
                  {/* ==================================================
                      CITAS
                      ================================================== */}

                  {citasEnCelda.map((c) => (
                    <div
                      key={c.id}
                      className={`
                        absolute
                        inset-0
                        m-0.5
                        p-2
                        rounded-lg
                        border
                        shadow-sm
                        cursor-pointer
                        truncate
                        transition-all
                        duration-200

                        ${colorPorTipo(
                          c.tipo_cita
                        )}

                        ${
                          resaltadaId === c.id
                            ? `
                              ring-2
                              ring-amber-400
                              bg-amber-50
                              scale-[1.02]
                              z-10
                            `
                            : `
                              hover:scale-[1.01]
                              hover:shadow-md
                            `
                        }
                      `}
                      onClick={() =>
                        onCitaClick(c)
                      }
                    >
                      {/* ------------------------------------------------
                          TIPO + HORA
                          ------------------------------------------------ */}

                      <div
                        className="
                          font-semibold
                          truncate
                        "
                      >
                        {c.tipo_cita} —{" "}
                        {c.hora_inicio}
                      </div>

                      {/* ------------------------------------------------
                          NOTARIO
                          ------------------------------------------------ */}

                      <div
                        className="
                          truncate
                          text-slate-600
                          mt-0.5
                        "
                      >
                        <span className="font-medium">
                          Notario:
                        </span>{" "}
                        {c.notario_nombre ||
                          "—"}
                      </div>

                      {/* ------------------------------------------------
                          FIRMA
                          ------------------------------------------------ */}

                      <div
                        className="
                          truncate
                          text-slate-600
                        "
                      >
                        <span className="font-medium">
                          Firma:
                        </span>{" "}
                        {c.tipo_firma ||
                          "—"}
                      </div>

                      {/* ------------------------------------------------
                          APODERADO
                          ------------------------------------------------ */}

                      <div
                        className="
                          truncate
                          text-slate-600
                        "
                      >
                        <span className="font-medium">
                          Apoderado:
                        </span>{" "}
                        {c.apoderado ||
                          "—"}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}
