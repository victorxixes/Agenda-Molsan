import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import axios from "../../api/axios";

/**
 * ============================================================
 * INTRANET — MOLSAN ERP SAAS PREMIUM 2027
 * ============================================================
 *
 * Diseño:
 * - Premium / Glass Luxe claro
 * - Coherente con el resto del ERP
 * - Fondo claro corporativo
 * - Tarjetas glass
 * - Azul corporativo
 * - Responsive
 * - Animaciones suaves
 *
 * Funcionalidad:
 * - Mantiene autenticación actual
 * - Mantiene carga de noticias
 * - Mantiene carga de documentos
 * - Mantiene permisos de administrador
 * - Mantiene eliminación
 * - Mantiene descarga de documentos
 */

function Intranet() {
  const { token, authReady, empleado } = useAuthStore();

  const esAdmin =
    empleado?.rol?.nombre === "admin";

  const [noticias, setNoticias] = useState([]);
  const [documentos, setDocumentos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================================================
  // CARGAR DATOS
  // =========================================================

  useEffect(() => {
    if (!authReady || !token) {
      return;
    }

    async function cargar() {
      try {
        setLoading(true);
        setError(null);

        const [
          resNoticias,
          resDocumentos,
        ] = await Promise.all([
          axios.get("/noticias"),
          axios.get("/documentos"),
        ]);

        setNoticias(
          Array.isArray(resNoticias.data)
            ? resNoticias.data
            : []
        );

        setDocumentos(
          Array.isArray(resDocumentos.data)
            ? resDocumentos.data
            : []
        );
      } catch (e) {
        console.error(
          "Error cargando intranet",
          e
        );

        setError(
          "Error cargando datos de intranet"
        );
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, [authReady, token]);

  // =========================================================
  // ELIMINAR NOTICIA
  // =========================================================

  async function eliminarNoticia(id) {
    try {
      await axios.delete(
        `/noticias/${id}`
      );

      setNoticias((actuales) =>
        actuales.filter(
          (n) => n.id !== id
        )
      );
    } catch (e) {
      console.error(
        "Error eliminando noticia",
        e
      );

      alert(
        "Error eliminando noticia"
      );
    }
  }

  // =========================================================
  // ELIMINAR DOCUMENTO
  // =========================================================

  async function eliminarDocumento(id) {
    try {
      await axios.delete(
        `/documentos/${id}`
      );

      setDocumentos((actuales) =>
        actuales.filter(
          (d) => d.id !== id
        )
      );
    } catch (e) {
      console.error(
        "Error eliminando documento",
        e
      );

      alert(
        "Error eliminando documento"
      );
    }
  }

  // =========================================================
  // CARGANDO SESIÓN
  // =========================================================

  if (!authReady) {
    return (
      <div
        className="
          min-h-[400px]
          flex
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-slate-200
            bg-white/80
            px-6
            py-4
            shadow-sm
            backdrop-blur-xl
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

          <span
            className="
              text-sm
              font-medium
              text-slate-600
            "
          >
            Cargando sesión…
          </span>
        </div>
      </div>
    );
  }

  // =========================================================
  // CARGANDO INTRANET
  // =========================================================

  if (loading) {
    return (
      <div
        className="
          min-h-[400px]
          flex
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-white/80
            bg-white/80
            px-6
            py-4
            shadow-[0_15px_40px_rgba(15,23,42,0.08)]
            backdrop-blur-xl
          "
        >
          <span
            className="
              h-5
              w-5
              rounded-full
              border-2
              border-blue-100
              border-t-blue-500
              animate-spin
            "
          />

          <span
            className="
              text-sm
              font-medium
              text-slate-600
            "
          >
            Cargando intranet…
          </span>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-red-200
          bg-white/80
          p-8
          shadow-[0_15px_40px_rgba(15,23,42,0.06)]
          backdrop-blur-xl
          animate-[fadeIn_0.3s_ease]
        "
      >
        <div
          className="
            flex
            items-start
            gap-4
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-red-50
              text-red-500
              border
              border-red-100
            "
          >
            !
          </div>

          <div>
            <h2
              className="
                text-base
                font-semibold
                text-slate-800
              "
            >
              No se ha podido cargar la intranet
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
        relative
        min-h-full
        overflow-hidden
        animate-fadeIn
      "
    >

      {/* =====================================================
          FONDO DECORATIVO
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            -top-40
            -right-40
            h-[420px]
            w-[420px]
            rounded-full
            bg-blue-400/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -left-40
            h-[420px]
            w-[420px]
            rounded-full
            bg-cyan-300/10
            blur-3xl
          "
        />

      </div>


      {/* =====================================================
          CONTENIDO
      ===================================================== */}

      <div
        className="
          relative
          z-10
          space-y-6
        "
      >

        {/* ===================================================
            CABECERA
        =================================================== */}

        <section
          className="
            relative
            overflow-hidden

            rounded-[28px]

            border
            border-white/80

            bg-white/75

            backdrop-blur-2xl

            shadow-[0_18px_55px_rgba(15,23,42,0.08)]

            p-6
            sm:p-7
          "
        >

          {/* Línea superior */}

          <div
            className="
              absolute
              left-0
              right-0
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-blue-400/50
              to-transparent
            "
          />

          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            {/* TÍTULO */}

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-blue-100

                  bg-blue-50

                  text-2xl

                  shadow-sm
                "
              >
                🏢
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
                  Intranet
                </h1>

                <p
                  className="
                    mt-1
                    text-sm
                    sm:text-base
                    text-slate-500
                  "
                >
                  Información y documentación interna
                </p>

              </div>

            </div>


            {/* INDICADOR */}

            <div
              className="
                inline-flex
                w-fit
                items-center
                gap-2

                rounded-full

                border
                border-blue-100

                bg-blue-50/80

                px-4
                py-2

                text-xs
                font-semibold

                text-blue-600
              "
            >

              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-blue-500
                  shadow-[0_0_0_4px_rgba(59,130,246,0.10)]
                "
              />

              Área interna

            </div>

          </div>

        </section>


        {/* ===================================================
            RESUMEN
        =================================================== */}

        <section
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-4
          "
        >

          {/* NOTICIAS */}

          <div
            className="
              relative
              overflow-hidden

              rounded-2xl

              border
              border-white/80

              bg-white/70

              backdrop-blur-xl

              p-5

              shadow-[0_12px_35px_rgba(15,23,42,0.06)]

              transition-all
              duration-200

              hover:-translate-y-0.5
              hover:shadow-[0_18px_45px_rgba(15,23,42,0.09)]
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-slate-400
                  "
                >
                  Noticias
                </p>

                <p
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    text-slate-800
                  "
                >
                  {noticias.length}
                </p>

              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  border
                  border-blue-100
                  text-xl
                "
              >
                📰
              </div>

            </div>

          </div>


          {/* DOCUMENTOS */}

          <div
            className="
              relative
              overflow-hidden

              rounded-2xl

              border
              border-white/80

              bg-white/70

              backdrop-blur-xl

              p-5

              shadow-[0_12px_35px_rgba(15,23,42,0.06)]

              transition-all
              duration-200

              hover:-translate-y-0.5
              hover:shadow-[0_18px_45px_rgba(15,23,42,0.09)]
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-slate-400
                  "
                >
                  Documentos
                </p>

                <p
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    text-slate-800
                  "
                >
                  {documentos.length}
                </p>

              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-cyan-50
                  border
                  border-cyan-100
                  text-xl
                "
              >
                📁
              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            CONTENIDO PRINCIPAL
        =================================================== */}

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-6
          "
        >

          {/* =================================================
              NOTICIAS
          ================================================= */}

          <section
            className="
              relative
              overflow-hidden

              rounded-[28px]

              border
              border-white/80

              bg-white/75

              backdrop-blur-2xl

              shadow-[0_18px_55px_rgba(15,23,42,0.08)]

              p-5
              sm:p-6
            "
          >

            <div
              className="
                absolute
                left-0
                right-0
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-blue-400/40
                to-transparent
              "
            />


            {/* CABECERA */}

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
                gap-3
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
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    border
                    border-blue-100
                    text-lg
                  "
                >
                  📰
                </div>

                <div>

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-slate-800
                    "
                  >
                    Noticias internas
                  </h2>

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Comunicaciones de la empresa
                  </p>

                </div>

              </div>


              <span
                className="
                  rounded-full
                  bg-slate-100
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-slate-500
                "
              >
                {noticias.length}
              </span>

            </div>


            {/* LISTA */}

            {noticias.length === 0 ? (

              <div
                className="
                  rounded-2xl
                  border
                  border-dashed
                  border-slate-200
                  bg-slate-50/70
                  px-5
                  py-10
                  text-center
                "
              >

                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white
                    border
                    border-slate-200
                    text-xl
                    shadow-sm
                  "
                >
                  📰
                </div>

                <p
                  className="
                    mt-3
                    text-sm
                    font-medium
                    text-slate-600
                  "
                >
                  No hay noticias publicadas.
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-400
                  "
                >
                  Las nuevas comunicaciones aparecerán aquí.
                </p>

              </div>

            ) : (

              <div
                className="
                  space-y-3
                "
              >

                {noticias.map((n) => (

                  <article
                    key={n.id}
                    className="
                      group

                      rounded-2xl

                      border
                      border-slate-200/80

                      bg-white/80

                      p-4

                      shadow-sm

                      transition-all
                      duration-200

                      hover:-translate-y-0.5

                      hover:border-blue-200

                      hover:shadow-[0_12px_30px_rgba(15,23,42,0.07)]

                      animate-[fadeIn_0.3s_ease]
                    "
                  >

                    <div
                      className="
                        flex
                        flex-col
                        gap-3
                      "
                    >

                      <div
                        className="
                          flex
                          flex-col
                          gap-2
                          sm:flex-row
                          sm:items-start
                          sm:justify-between
                        "
                      >

                        <h3
                          className="
                            font-semibold
                            text-slate-800
                          "
                        >
                          {n.titulo}
                        </h3>

                        {n.fecha_publicacion && (
                          <span
                            className="
                              shrink-0
                              text-xs
                              text-slate-400
                            "
                          >
                            {new Date(
                              n.fecha_publicacion
                            ).toLocaleString(
                              "es-ES"
                            )}
                          </span>
                        )}

                      </div>


                      {n.descripcion && (
                        <p
                          className="
                            text-sm
                            leading-6
                            text-slate-500
                          "
                        >
                          {n.descripcion}
                        </p>
                      )}


                      {esAdmin && (
                        <div
                          className="
                            pt-1
                            flex
                            justify-end
                          "
                        >

                          <button
                            onClick={() =>
                              eliminarNoticia(
                                n.id
                              )
                            }
                            className="
                              rounded-xl

                              border
                              border-red-200

                              bg-red-50

                              px-3
                              py-1.5

                              text-xs
                              font-semibold

                              text-red-600

                              transition-all

                              hover:bg-red-100
                              hover:border-red-300

                              active:scale-[0.98]
                            "
                          >
                            Eliminar
                          </button>

                        </div>
                      )}

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>


          {/* =================================================
              DOCUMENTOS
          ================================================= */}

          <section
            className="
              relative
              overflow-hidden

              rounded-[28px]

              border
              border-white/80

              bg-white/75

              backdrop-blur-2xl

              shadow-[0_18px_55px_rgba(15,23,42,0.08)]

              p-5
              sm:p-6
            "
          >

            <div
              className="
                absolute
                left-0
                right-0
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-cyan-400/40
                to-transparent
              "
            />


            {/* CABECERA */}

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
                gap-3
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
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-cyan-50
                    border
                    border-cyan-100
                    text-lg
                  "
                >
                  📁
                </div>

                <div>

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-slate-800
                    "
                  >
                    Documentos internos
                  </h2>

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Documentación corporativa
                  </p>

                </div>

              </div>


              <span
                className="
                  rounded-full
                  bg-slate-100
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-slate-500
                "
              >
                {documentos.length}
              </span>

            </div>


            {/* LISTA */}

            {documentos.length === 0 ? (

              <div
                className="
                  rounded-2xl
                  border
                  border-dashed
                  border-slate-200
                  bg-slate-50/70
                  px-5
                  py-10
                  text-center
                "
              >

                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white
                    border
                    border-slate-200
                    text-xl
                    shadow-sm
                  "
                >
                  📁
                </div>

                <p
                  className="
                    mt-3
                    text-sm
                    font-medium
                    text-slate-600
                  "
                >
                  No hay documentos disponibles.
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-400
                  "
                >
                  Los documentos internos aparecerán aquí.
                </p>

              </div>

            ) : (

              <div
                className="
                  space-y-3
                "
              >

                {documentos.map((d) => (

                  <article
                    key={d.id}
                    className="
                      group

                      rounded-2xl

                      border
                      border-slate-200/80

                      bg-white/80

                      p-4

                      shadow-sm

                      transition-all
                      duration-200

                      hover:-translate-y-0.5

                      hover:border-cyan-200

                      hover:shadow-[0_12px_30px_rgba(15,23,42,0.07)]

                      animate-[fadeIn_0.3s_ease]
                    "
                  >

                    <div
                      className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >

                      {/* INFORMACIÓN */}

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center

                            rounded-xl

                            bg-cyan-50

                            border
                            border-cyan-100

                            text-lg
                          "
                        >
                          📄
                        </div>


                        <div
                          className="
                            min-w-0
                          "
                        >

                          <div
                            className="
                              truncate
                              font-semibold
                              text-slate-800
                            "
                          >
                            {d.titulo}
                          </div>


                          {d.concepto && (
                            <div
                              className="
                                mt-1
                                text-sm
                                text-slate-500
                              "
                            >
                              {d.concepto}
                            </div>
                          )}


                          {d.fecha_publicacion && (
                            <div
                              className="
                                mt-1
                                text-xs
                                text-slate-400
                              "
                            >
                              {new Date(
                                d.fecha_publicacion
                              ).toLocaleString(
                                "es-ES"
                              )}
                            </div>
                          )}

                        </div>

                      </div>


                      {/* ACCIONES */}

                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                          gap-2
                        "
                      >

                        <a
                          href={`
                            ${import.meta.env.VITE_API_URL}
                            /documentos/descargar/${d.id}
                          `}
                          className="
                            inline-flex
                            items-center
                            justify-center

                            rounded-xl

                            border
                            border-blue-200

                            bg-blue-50

                            px-3
                            py-2

                            text-xs
                            font-semibold

                            text-blue-600

                            transition-all

                            hover:bg-blue-100
                            hover:border-blue-300

                            active:scale-[0.98]
                          "
                        >
                          Descargar
                        </a>


                        {esAdmin && (
                          <button
                            onClick={() =>
                              eliminarDocumento(
                                d.id
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              justify-center

                              rounded-xl

                              border
                              border-red-200

                              bg-red-50

                              px-3
                              py-2

                              text-xs
                              font-semibold

                              text-red-600

                              transition-all

                              hover:bg-red-100
                              hover:border-red-300

                              active:scale-[0.98]
                            "
                          >
                            Eliminar
                          </button>
                        )}

                      </div>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>

        </div>

      </div>

    </div>
  );
}

export default Intranet;
