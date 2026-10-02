import { useEffect } from "react";
import { useLogs } from "../../hooks/useLogs";
import TablaLogs from "../../components/logs/TablaLogs";

/**
 * LOGS — MOLSAN ERP SAAS PREMIUM 2027
 *
 * - Mantiene useLogs()
 * - Mantiene carga de logs
 * - Mantiene búsqueda
 * - Mantiene filtro por fecha
 * - Mantiene ordenación
 * - Mantiene paginación
 * - Mantiene exportación
 * - Diseño Glass Luxe claro
 * - Responsive
 */

export default function Logs() {
  const { logs, cargarLogs, loading } = useLogs();

  useEffect(() => {
    cargarLogs({});
  }, [cargarLogs]);

  const columnas = [
    {
      campo: "id",
      titulo: "ID",
    },
    {
      campo: "tipo",
      titulo: "Tipo",
      esEvento: true,
    },
    {
      campo: "mensaje",
      titulo: "Mensaje",
    },
    {
      campo: "fecha",
      titulo: "Fecha",
      esFecha: true,
    },
  ];

  const iconosTipo = {
    error: "⛔",
    security: "🔐",
    warning: "⚠️",
    info: "ℹ️",
    default: "•",
  };

  return (
    <div
      className="
        relative
        min-h-full

        space-y-6

        text-slate-800

        animate-fadeIn
      "
    >
      {/* =====================================================
          CABECERA
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden

          rounded-[24px]

          border
          border-white/80

          bg-white/80

          backdrop-blur-2xl

          shadow-[0_15px_45px_rgba(15,23,42,0.08)]

          p-6
          sm:p-7
        "
      >
        {/* Brillo superior */}

        <div
          className="
            absolute
            top-0
            left-0
            right-0

            h-px

            bg-gradient-to-r
            from-transparent
            via-blue-400/50
            to-transparent
          "
        />

        {/* Decoración */}

        <div
          className="
            absolute
            -top-20
            -right-20

            w-48
            h-48

            rounded-full

            bg-blue-400/10

            blur-3xl

            pointer-events-none
          "
        />

        <div
          className="
            relative
            z-10
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                items-center
                justify-center

                w-11
                h-11

                rounded-xl

                bg-blue-50

                border
                border-blue-100

                shadow-sm
              "
            >
              <span
                className="
                  text-xl
                "
                aria-hidden="true"
              >
                📋
              </span>
            </div>

            <div>
              <h1
                className="
                  text-2xl
                  sm:text-3xl

                  font-bold

                  tracking-tight

                  text-slate-800
                "
              >
                Logs del sistema
              </h1>

              <p
                className="
                  mt-1

                  text-sm

                  text-slate-500
                "
              >
                Monitorización avanzada de eventos, seguridad y actividad del ERP.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          CONTENIDO
      ===================================================== */}

      {loading ? (
        <div
          className="
            flex
            items-center
            justify-center

            rounded-[24px]

            border
            border-white/80

            bg-white/75

            backdrop-blur-xl

            shadow-[0_15px_45px_rgba(15,23,42,0.06)]

            p-10
          "
        >
          <div
            className="
              flex
              items-center
              gap-3

              text-sm
              font-medium

              text-slate-500
            "
          >
            <span
              className="
                h-5
                w-5

                rounded-full

                border-2
                border-slate-200
                border-t-blue-500

                animate-spin
              "
            />

            Cargando logs…
          </div>
        </div>
      ) : (
        <TablaLogs
          datos={logs || []}
          columnas={columnas}
          pageSize={50}
          titulo="Listado de logs"
          descripcion="Registros generales del sistema, ordenados por fecha y tipo."
          enableSearch={true}
          enableDateFilter={true}
          enableExport={true}
          exportFilename="logs_sistema"
          iconosEvento={iconosTipo}
        />
      )}
    </div>
  );
}
