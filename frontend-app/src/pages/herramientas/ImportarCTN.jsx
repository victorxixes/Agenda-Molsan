import { useState } from "react";
import { useUtilidades } from "../../hooks/useUtilidades";

/**
 * IMPORTAR CTN — MOLSAN ERP SAAS PREMIUM 2027
 *
 * - Glass Luxe
 * - Selector de archivo premium
 * - Feedback visual
 * - Mantiene la lógica actual
 */

export default function ImportarCTN() {
  const {
    importarCTN,
    loading,
    resultado,
  } = useUtilidades();

  const [file, setFile] = useState(null);

  const enviar = async () => {
    if (!file || loading) return;

    await importarCTN(file);
  };

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 animate-fadeIn">

      {/* =====================================================
          CABECERA
      ===================================================== */}

      <div className="mb-7">

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              items-center
              justify-center
              w-11
              h-11
              rounded-2xl
              bg-blue-50
              border
              border-blue-100
              shadow-sm
              text-xl
            "
          >
            📥
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
              Importar CTN
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Importa registros CTN desde un archivo Excel.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          TARJETA PRINCIPAL
      ===================================================== */}

      <div className="max-w-3xl">

        <div
          className="
            relative
            overflow-hidden
            rounded-[24px]
            border
            border-slate-200/80
            bg-white/80
            backdrop-blur-xl
            shadow-[0_18px_50px_rgba(15,23,42,0.08)]
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


          {/* =================================================
              CABECERA TARJETA
          ================================================= */}

          <div
            className="
              px-5
              py-5
              sm:px-7
              border-b
              border-slate-200/70
            "
          >

            <h2 className="text-lg font-semibold text-slate-800">
              Archivo de importación
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Selecciona un archivo Excel en formato .xlsx.
            </p>

          </div>


          {/* =================================================
              CONTENIDO
          ================================================= */}

          <div className="p-5 sm:p-7 space-y-6">

            {/* ZONA ARCHIVO */}

            <label
              htmlFor="ctn-file"
              className="
                group
                flex
                flex-col
                items-center
                justify-center
                min-h-[190px]
                rounded-2xl
                border-2
                border-dashed
                border-slate-200
                bg-slate-50/70
                px-6
                py-8
                text-center
                cursor-pointer
                transition-all
                duration-200
                hover:border-blue-300
                hover:bg-blue-50/40
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-center
                  w-14
                  h-14
                  rounded-2xl
                  bg-white
                  border
                  border-slate-200
                  shadow-sm
                  text-2xl
                  mb-4
                  transition-transform
                  duration-200
                  group-hover:scale-105
                "
              >
                📊
              </div>


              {file ? (
                <>
                  <p className="text-sm font-semibold text-slate-700 break-all">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Archivo seleccionado correctamente
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-slate-700">
                    Selecciona el archivo Excel
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Formato admitido: .xlsx
                  </p>
                </>
              )}

              <input
                id="ctn-file"
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={(e) => {
                  const seleccionado =
                    e.target.files?.[0] || null;

                  setFile(seleccionado);
                }}
              />

            </label>


            {/* BOTÓN */}

            <div className="flex justify-end">

              <button
                type="button"
                onClick={enviar}
                disabled={!file || loading}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  min-w-[150px]
                  rounded-xl
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  bg-gradient-to-r
                  from-blue-600
                  to-blue-500
                  shadow-[0_10px_25px_rgba(37,99,235,0.18)]
                  transition-all
                  duration-200
                  hover:from-blue-500
                  hover:to-blue-400
                  hover:shadow-[0_14px_30px_rgba(37,99,235,0.24)]
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  disabled:shadow-none
                "
              >

                {loading ? (
                  <>
                    <span
                      className="
                        w-4
                        h-4
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                        animate-spin
                      "
                    />

                    Importando...
                  </>
                ) : (
                  <>
                    <span>📥</span>
                    Importar
                  </>
                )}

              </button>

            </div>


            {/* =================================================
                RESULTADO
            ================================================= */}

            {resultado && (
              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-emerald-200
                  bg-emerald-50
                  px-4
                  py-4
                  text-emerald-700
                  shadow-sm
                  animate-fadeIn
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-9
                    h-9
                    rounded-full
                    bg-emerald-100
                    text-emerald-600
                    font-bold
                  "
                >
                  ✓
                </div>

                <div>

                  <p className="text-sm font-semibold">
                    Importación completada
                  </p>

                  <p className="text-xs text-emerald-600/80 mt-0.5">
                    {resultado.importados} registros importados correctamente.
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
