import { useState, useCallback, useMemo } from "react";
import { useUtilidades } from "../../hooks/useUtilidades";

/**
 * CREAR NOTICIA — MOLSAN ERP SAAS PREMIUM 2027
 *
 * - Glass Luxe
 * - Diseño corporativo claro
 * - Responsive
 * - Mantiene toda la lógica existente
 * - Feedback visual
 */

export default function CrearNoticia() {
  const { crearNoticia } = useUtilidades();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ok, setOk] = useState(false);

  const puedeEnviar = useMemo(() => {
    return (
      titulo.trim().length > 0 &&
      descripcion.trim().length > 0
    );
  }, [titulo, descripcion]);

  const enviar = useCallback(async () => {
    if (!puedeEnviar) return;

    setOk(false);

    try {
      await crearNoticia(
        titulo.trim(),
        descripcion.trim()
      );

      setOk(true);
      setTitulo("");
      setDescripcion("");
    } catch (error) {
      console.error(
        "ERROR CREANDO NOTICIA:",
        error
      );
    }
  }, [
    crearNoticia,
    titulo,
    descripcion,
    puedeEnviar,
  ]);

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 animate-fadeIn">

      {/* =====================================================
          CABECERA
      ===================================================== */}

      <div className="mb-6">

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
            📰
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
              Crear noticia
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Publica una nueva comunicación para la intranet.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          CONTENEDOR PRINCIPAL
      ===================================================== */}

      <div className="max-w-4xl">

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
              Nueva publicación
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Completa los datos de la noticia.
            </p>

          </div>


          {/* =================================================
              FORMULARIO
          ================================================= */}

          <div className="p-5 sm:p-7 space-y-6">

            {/* TÍTULO */}

            <div>

              <label
                htmlFor="noticia-titulo"
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Título
              </label>

              <input
                id="noticia-titulo"
                type="text"
                value={titulo}
                onChange={(e) => {
                  setTitulo(e.target.value);
                  setOk(false);
                }}
                placeholder="Escribe el título de la noticia"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50/70
                  px-4
                  py-3
                  text-slate-800
                  placeholder:text-slate-400
                  outline-none
                  transition-all
                  duration-200
                  shadow-sm
                  focus:border-blue-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />

            </div>


            {/* DESCRIPCIÓN */}

            <div>

              <label
                htmlFor="noticia-descripcion"
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Descripción
              </label>

              <textarea
                id="noticia-descripcion"
                value={descripcion}
                onChange={(e) => {
                  setDescripcion(e.target.value);
                  setOk(false);
                }}
                rows={7}
                placeholder="Escribe el contenido de la noticia..."
                className="
                  w-full
                  resize-y
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50/70
                  px-4
                  py-3
                  text-slate-800
                  placeholder:text-slate-400
                  outline-none
                  transition-all
                  duration-200
                  shadow-sm
                  focus:border-blue-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />

            </div>


            {/* ACCIONES */}

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
                pt-2
              "
            >

              <p className="text-xs text-slate-400">
                La noticia quedará disponible para los usuarios de la intranet.
              </p>

              <button
                type="button"
                onClick={enviar}
                disabled={!puedeEnviar}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  min-w-[170px]
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
                <span aria-hidden="true">
                  📰
                </span>

                Crear noticia
              </button>

            </div>


            {/* =================================================
                CONFIRMACIÓN
            ================================================= */}

            {ok && (
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
                  py-3
                  text-emerald-700
                  shadow-sm
                  animate-fadeIn
                "
              >

                <span
                  className="
                    flex
                    items-center
                    justify-center
                    w-8
                    h-8
                    rounded-full
                    bg-emerald-100
                    text-emerald-600
                  "
                >
                  ✓
                </span>

                <div>

                  <p className="text-sm font-semibold">
                    Noticia creada correctamente.
                  </p>

                  <p className="text-xs text-emerald-600/80 mt-0.5">
                    La publicación ya está disponible en la intranet.
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
