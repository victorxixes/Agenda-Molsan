import { useEffect } from "react";

import { useSeguridad } from "../../hooks/useSeguridad";
import TablaLogs from "../../components/logs/TablaLogs";


/* =========================================================
   SEGURIDAD — LOGS
   MOLSAN ERP SAAS PREMIUM 2027
========================================================= */

export default function SeguridadLogs() {

  const {
    logs = [],
    cargarTodo,
  } = useSeguridad();


  /* =======================================================
     CARGAR LOGS
  ======================================================= */

  useEffect(() => {

    cargarTodo();

  }, [cargarTodo]);


  /* =======================================================
     COLUMNAS
  ======================================================= */

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


  /* =======================================================
     ICONOS EVENTOS
  ======================================================= */

  const iconosEvento = {

    login: "🔐",

    login_error: "⚠️",

    acceso: "📥",

    update: "✏️",

    delete: "🗑️",

    default: "📄",

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div
      className="
        erp-page
        space-y-6
        animate-fade-in
      "
    >

      {/* ===================================================
          CABECERA
      =================================================== */}

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
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  bg-[var(--erp-primary-soft)]
                  text-xl
                  border
                  border-[var(--erp-border)]
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
              "
            >
              Registro de accesos, autenticaciones y
              actividad sensible realizada en el sistema.
            </p>

          </div>


          {/* INDICADOR */}

          <div
            className="
              inline-flex
              items-center
              gap-3
              rounded-xl
              border
              border-[var(--erp-border)]
              bg-[var(--erp-surface-soft)]
              px-4
              py-3
              shrink-0
            "
          >

            <span
              className="
                w-2.5
                h-2.5
                rounded-full
                bg-emerald-500
                shadow-sm
              "
            />

            <div>

              <div
                className="
                  text-xs
                  font-semibold
                  text-[var(--erp-text)]
                "
              >
                Auditoría activa
              </div>

              <div
                className="
                  text-[11px]
                  text-[var(--erp-text-soft)]
                  mt-0.5
                "
              >
                SJ-2026
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================
          TABLA
      =================================================== */}

      <section
        className="
          erp-card
          p-5
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
