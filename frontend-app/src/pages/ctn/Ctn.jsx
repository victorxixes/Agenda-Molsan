import CtnListadoPage from "./CtnListadoPage";

export default function Ctn() {
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
            <span className="text-lg font-bold">
              CTN
            </span>
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
              CTN — Notarías
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-[var(--erp-text-soft)]
              "
            >
              Consulta y gestión del directorio de notarías.
            </p>
          </div>

        </div>
      </div>

      <CtnListadoPage />

    </div>
  );
}
