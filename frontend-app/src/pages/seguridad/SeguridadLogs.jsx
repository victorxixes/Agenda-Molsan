import { useEffect } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";
import TablaLogs from "../../components/logs/TablaLogs";

export default function SeguridadLogs() {
  const { logs = [], cargarTodo } = useSeguridad();

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

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

  const iconosEvento = {
    login: "🔐",
    login_error: "⚠️",
    acceso: "📥",
    update: "✏️",
    delete: "🗑️",
    default: "📄",
  };

  return (
    <div
      className="
        w-full
        space-y-6
        text-white
        animate-fade-in
      "
    >
      {/* =====================================================
          CABECERA
      ===================================================== */}

      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border border-white/15
          bg-white/[0.06]
          backdrop-blur-2xl
          shadow-[0_20px_70px_rgba(0,0,0,0.28)]
          px-6
          py-6
        "
      >
        {/* Brillo decorativo */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-24
            h-64
            w-64
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            left-1/3
            h-48
            w-48
            rounded-full
            bg-purple-500/10
            blur-3xl
          "
        />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border border-white/15
                  bg-white/10
                  text-2xl
                  shadow-lg
                "
              >
                🛡️
              </div>

              <div>
                <h1
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-white
                    md:text-3xl
                  "
                >
                  Logs de seguridad
                </h1>

                <p className="mt-1 text-sm text-white/55">
                  Auditoría y trazabilidad de actividad sensible del sistema.
                </p>
              </div>
            </div>
          </div>

          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border border-emerald-400/20
              bg-emerald-400/10
              px-4
              py-2
              text-xs
              font-semibold
              text-emerald-300
            "
          >
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-emerald-400
                shadow-[0_0_10px_rgba(52,211,153,0.8)]
              "
            />

            SISTEMA DE AUDITORÍA
          </div>
        </div>
      </div>

      {/* =====================================================
          TABLA
      ===================================================== */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          border border-white/15
          bg-white/[0.045]
          backdrop-blur-2xl
          shadow-[0_20px_70px_rgba(0,0,0,0.24)]
        "
      >
        <TablaLogs
          datos={logs || []}
          columnas={columnas}
          pageSize={20}
          titulo="Auditoría de seguridad"
          descripcion="Intentos de login, errores de autenticación y actividad sensible del sistema."
          enableSearch={true}
          enableDateFilter={true}
          enableExport={true}
          exportFilename="logs_seguridad"
          iconosEvento={iconosEvento}
        />
      </div>
    </div>
  );
}
