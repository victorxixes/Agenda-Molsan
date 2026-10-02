import { useEffect } from "react";

import { useSeguridad } from "../../hooks/useSeguridad";

import TablaLogs from "../../components/logs/TablaLogs";


/* ============================================================
   SEGURIDAD — LOGS
   MOLSAN ERP SAAS PREMIUM 2027
============================================================ */

export default function SeguridadLogs() {

  const {
    logs = [],
    cargarTodo,
  } = useSeguridad();


  /* ==========================================================
     CARGAR LOGS
  ========================================================== */

  useEffect(() => {

    cargarTodo();

  }, [cargarTodo]);


  /* ==========================================================
     COLUMNAS
  ========================================================== */

  const columnas = [

    {
      campo: "fecha",
      titulo: "Fecha",
      esFecha: true,
    },

    {
      campo: "evento",
      titulo: "Evento",
      esEvento: true,
    },

    {
      campo: "detalle",
      titulo: "Detalle",
    },

    {
      campo: "ip",
      titulo: "IP",
    },

  ];


  /* ==========================================================
     ICONOS DE EVENTOS
  ========================================================== */

  const iconosEvento = {

    login: "🔐",

    login_error: "⚠️",

    acceso: "📥",

    update: "✏️",

    delete: "🗑️",

    default: "📄",

  };


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <div
      className="
        erp-page
        space-y-6
        animate-fade-in
      "
    >

      {/* ======================================================
          CABECERA
      ====================================================== */}

      <section
        className="
          erp-card
          p-6
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-5
          "
        >

          {/* --------------------------------------------------
             TÍTULO
          -------------------------------------------------- */}

          <div>

            <div
              className="
                flex
                items-center
                gap-3
                mb-2
              "
            >

              <div
                className="
                  w-11
                  h-11
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  bg-[var(--erp-primary-soft)]
                  border
                  border-[var(--erp-border)]
                  text-xl
                "
              >
                🛡️
              </div>

              <div>

                <div
                  className="
                    text-xs
                    uppercase
                    tracking-[0.16em]
                    font-semibold
                    text-[var(--erp-primary)]
                  "
                >
                  Seguridad
                </div>

                <h1
                  className="
                    text-2xl
                    lg:text-3xl
                    font-semibold
                    text-[var(--erp-text)]
                    mt-0.5
                  "
                >
                  Logs de seguridad
                </h1>

              </div>

            </div>


            <p
              className="
                text-sm
                text-[var(--erp-text-soft)]
                max-w-3xl
                leading-relaxed
              "
            >
              Registro de actividad de seguridad del sistema,
              incluyendo accesos, intentos de autenticación,
              modificaciones y operaciones sensibles.
            </p>

          </div>


          {/* --------------------------------------------------
             INDICADOR
          -------------------------------------------------- */}

          <div
            className="
              shrink-0
              rounded-2xl
              border
              border-[var(--erp-border)]
              bg-[var(--erp-surface-soft)]
              px-5
              py-3
            "
          >

            <div
              className="
                text-[11px]
                uppercase
                tracking-wide
                font-semibold
                text-[var(--erp-text-soft)]
                mb-1
              "
            >
              Registros
            </div>

            <div
              className="
                text-xl
                font-semibold
                text-[var(--erp-text)]
              "
            >
              {Array.isArray(logs)
                ? logs.length
                : 0}
            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          TABLA DE LOGS
      ====================================================== */}

      <section
        className="
          erp-card
          overflow-hidden
        "
      >

        <TablaLogs
          datos={
            Array.isArray(logs)
              ? logs
              : []
          }

          columnas={columnas}

          pageSize={20}

          titulo="Auditoría de seguridad"

          descripcion="
            Intentos de login, errores de autenticación
            y actividad sensible del sistema.
          "

          enableSearch={true}

          enableDateFilter={true}

          enableExport={true}

          exportFilename="logs_seguridad"

          iconosEvento={iconosEvento}
        />

      </section>

    </div>

  );
}
