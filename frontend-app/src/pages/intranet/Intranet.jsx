import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import axios from "../../api/axios";

function Intranet() {
  const { token, authReady, empleado } = useAuthStore();

  const esAdmin = empleado?.rol?.nombre === "admin";

  const [noticias, setNoticias] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================================================
  // CARGAR DATOS
  // =========================================================

  useEffect(() => {
    if (!authReady || !token) return;

    async function cargar() {
      try {
        setLoading(true);
        setError(null);

        const [resNoticias, resDocumentos] =
          await Promise.all([
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

      setNoticias(
        noticias.filter(
          (n) => n.id !== id
        )
      );
    } catch {
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

      setDocumentos(
        documentos.filter(
          (d) => d.id !== id
        )
      );
    } catch {
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
      <div className="animate-fadeIn">

        <div
          className="
            relative
            overflow-hidden

            rounded-[26px]

            border
            border-white/90

            bg-white/80

            backdrop-blur-xl

            shadow-[0_20px_60px_rgba(15,23,42,0.08)]

            p-8
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center

                rounded-2xl

                bg-blue-50

                text-xl
              "
            >
              🔐
            </div>

            <div>

              <h2
                className="
                  text-base
                  font-semibold
                  text-slate-800
                "
              >
                Intranet
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Cargando sesión…
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // CARGANDO INTRANET
  // =========================================================

  if (loading) {
    return (
      <div className="animate-fadeIn">

        <div
          className="
            relative
            overflow-hidden

            rounded-[26px]

            border
            border-white/90

            bg-white/80

            backdrop-blur-xl

            shadow-[0_20px_60px_rgba(15,23,42,0.08)]

            p-8
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center

                rounded-2xl

                bg-blue-50

                text-xl
              "
            >
              🏢
            </div>

            <div className="flex-1">

              <h2
                className="
                  text-base
                  font-semibold
                  text-slate-800
                "
              >
                Intranet
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Cargando información…
              </p>

            </div>

            <div
              className="
                h-5
                w-5

                rounded-full

                border-2
                border-blue-200
                border-t-blue-600

                animate-spin
              "
            />

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="animate-fadeIn">

        <div
          className="
            rounded-[26px]

            border
            border-red-200

            bg-white/85

            backdrop-blur-xl

            shadow-[0_20px_60px_rgba(15,23,42,0.08)]

            p-8
          "
        >

          <div className="flex items-start gap-4">

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

                text-lg
              "
            >
              ⚠️
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
                  text-red-500
                "
              >
                {error}
              </p>

            </div>

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

        animate-fadeIn

        space-y-6
      "
    >

      {/* =====================================================
          CABECERA INTRANET
      ===================================================== */}

      <div
        className="
          relative
          overflow-hidden

          rounded-[26px]

          border
          border-white/90

          bg-white/80

          backdrop-blur-xl

          shadow-[0_20px_60px_rgba(15,23,42,0.07)]

          px-6
          py-5
          sm:px-7
        "
      >

        {/* brillo superior */}

        <div
          className="
            absolute
            top-0
            left-0
            right-0

            h-[2px]

            bg-gradient-to-r
            from-transparent
            via-blue-500/40
            to-transparent
          "
        />

        {/* decoración */}

        <div
          className="
            absolute

            -right-20
            -top-24

            h-56
            w-56

            rounded-full

            bg-blue-400/[0.05]

            blur-3xl

            pointer-events-none
          "
        />

        <div
          className="
            relative

            flex
            items-center
            gap-4
          "
        >

          <div
            className="
              flex
              h-12
              w-12
              shrink-0

              items-center
              justify-center

              rounded-2xl

              border
              border-blue-100

              bg-gradient-to-br
              from-blue-50
              to-cyan-50

              text-xl

              shadow-sm
            "
          >
            🏢
          </div>

          <div className="min-w-0">

            <h1
              className="
                text-xl
                sm:text-2xl

                font-bold

                tracking-tight

                text-slate-800
              "
            >
              Intranet
            </h1>

            <p
              className="
                mt-0.5

                text-sm

                text-slate-500
              "
            >
              Noticias y documentación interna
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          COLUMNAS
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2

          gap-6
        "
      >

        {/* ===================================================
            NOTICIAS
        =================================================== */}

        <section
          className="
            relative
            overflow-hidden

            rounded-[26px]

            border
            border-white/90

            bg-white/80

            backdrop-blur-xl

            shadow-[0_20px_60px_rgba(15,23,42,0.07)]
          "
        >

          {/* línea superior */}

          <div
            className="
              absolute
              top-0
              left-0
              right-0

              h-[2px]

              bg-gradient-to-r
              from-blue-500/0
              via-blue-500/35
              to-blue-500/0
            "
          />


          {/* CABECERA */}

          <div
            className="
              flex
              items-center
              justify-between

              border-b
              border-slate-100

              px-5
              py-4
              sm:px-6
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

                  text-lg
                "
              >
                📰
              </div>

              <div>

                <h2
                  className="
                    text-base
                    font-semibold
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
                inline-flex
                items-center
                rounded-full

                border
                border-blue-100

                bg-blue-50

                px-2.5
                py-1

                text-[11px]
                font-semibold

                text-blue-600
              "
            >
              {noticias.length}
            </span>

          </div>


          {/* CONTENIDO */}

          <div
            className="
              p-5
              sm:p-6
            "
          >

            {noticias.length === 0 ? (

              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-dashed
                  border-slate-200

                  bg-slate-50/70

                  px-6
                  py-10

                  text-center
                "
              >

                <div
                  className="
                    mb-3

                    flex
                    h-12
                    w-12

                    items-center
                    justify-center

                    rounded-2xl

                    bg-white

                    border
                    border-slate-200

                    shadow-sm

                    text-lg
                  "
                >
                  📰
                </div>

                <p
                  className="
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

              <ul className="space-y-3">

                {noticias.map((n) => (

                  <li
                    key={n.id}

                    className="
                      group

                      rounded-2xl

                      border
                      border-slate-100

                      bg-white

                      p-4

                      shadow-[0_5px_20px_rgba(15,23,42,0.04)]

                      transition-all
                      duration-200

                      hover:-translate-y-[1px]

                      hover:border-blue-100

                      hover:shadow-[0_10px_30px_rgba(15,23,42,0.07)]
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        justify-between

                        gap-4
                      "
                    >

                      <div className="min-w-0">

                        <h3
                          className="
                            font-semibold

                            text-slate-800

                            leading-snug
                          "
                        >
                          {n.titulo}
                        </h3>

                      </div>


                      {n.fecha_publicacion && (
                        <span
                          className="
                            shrink-0

                            rounded-lg

                            bg-slate-50

                            px-2.5
                            py-1

                            text-[10px]

                            font-medium

                            text-slate-400
                          "
                        >
                          {new Date(
                            n.fecha_publicacion
                          ).toLocaleString()}
                        </span>
                      )}

                    </div>


                    {n.descripcion && (
                      <p
                        className="
                          mt-2

                          text-sm

                          leading-relaxed

                          text-slate-500
                        "
                      >
                        {n.descripcion}
                      </p>
                    )}


                    {esAdmin && (
                      <div
                        className="
                          mt-4

                          flex
                          justify-end
                        "
                      >

                        <button
                          onClick={() =>
                            eliminarNoticia(n.id)
                          }

                          className="
                            rounded-xl

                            border
                            border-red-100

                            bg-red-50

                            px-3
                            py-1.5

                            text-xs
                            font-medium

                            text-red-500

                            transition-all

                            hover:border-red-200

                            hover:bg-red-100

                            hover:text-red-600
                          "
                        >
                          Eliminar
                        </button>

                      </div>
                    )}

                  </li>

                ))}

              </ul>

            )}

          </div>

        </section>


        {/* ===================================================
            DOCUMENTOS
        =================================================== */}

        <section
          className="
            relative
            overflow-hidden

            rounded-[26px]

            border
            border-white/90

            bg-white/80

            backdrop-blur-xl

            shadow-[0_20px_60px_rgba(15,23,42,0.07)]
          "
        >

          {/* línea superior */}

          <div
            className="
              absolute
              top-0
              left-0
              right-0

              h-[2px]

              bg-gradient-to-r
              from-transparent
              via-cyan-500/35
              to-transparent
            "
          />


          {/* CABECERA */}

          <div
            className="
              flex
              items-center
              justify-between

              border-b
              border-slate-100

              px-5
              py-4
              sm:px-6
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

                  text-lg
                "
              >
                📁
              </div>

              <div>

                <h2
                  className="
                    text-base
                    font-semibold
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
                  Archivos disponibles para la empresa
                </p>

              </div>

            </div>


            <span
              className="
                inline-flex
                items-center
                rounded-full

                border
                border-cyan-100

                bg-cyan-50

                px-2.5
                py-1

                text-[11px]
                font-semibold

                text-cyan-600
              "
            >
              {documentos.length}
            </span>

          </div>


          {/* CONTENIDO */}

          <div
            className="
              p-5
              sm:p-6
            "
          >

            {documentos.length === 0 ? (

              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-dashed
                  border-slate-200

                  bg-slate-50/70

                  px-6
                  py-10

                  text-center
                "
              >

                <div
                  className="
                    mb-3

                    flex
                    h-12
                    w-12

                    items-center
                    justify-center

                    rounded-2xl

                    bg-white

                    border
                    border-slate-200

                    shadow-sm

                    text-lg
                  "
                >
                  📁
                </div>

                <p
                  className="
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

              <ul className="space-y-3">

                {documentos.map((d) => (

                  <li
                    key={d.id}

                    className="
                      group

                      rounded-2xl

                      border
                      border-slate-100

                      bg-white

                      p-4

                      shadow-[0_5px_20px_rgba(15,23,42,0.04)]

                      transition-all
                      duration-200

                      hover:-translate-y-[1px]

                      hover:border-cyan-100

                      hover:shadow-[0_10px_30px_rgba(15,23,42,0.07)]
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
                          items-start
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0

                            items-center
                            justify-center

                            rounded-xl

                            bg-slate-50

                            border
                            border-slate-100

                            text-base
                          "
                        >
                          📄
                        </div>


                        <div className="min-w-0">

                          <div
                            className="
                              font-semibold

                              text-slate-800

                              truncate
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

                                leading-relaxed
                              "
                            >
                              {d.concepto}
                            </div>
                          )}

                        </div>

                      </div>


                      {/* ACCIONES */}

                      <div
                        className="
                          flex
                          shrink-0
                          gap-2
                        "
                      >

                        <a
                          href={`${import.meta.env.VITE_API_URL}/documentos/descargar/${d.id}`}

                          className="
                            inline-flex
                            items-center
                            justify-center

                            rounded-xl

                            border
                            border-blue-100

                            bg-blue-50

                            px-3.5
                            py-2

                            text-xs
                            font-semibold

                            text-blue-600

                            transition-all

                            hover:border-blue-200

                            hover:bg-blue-100

                            hover:text-blue-700
                          "
                        >
                          Descargar
                        </a>


                        {esAdmin && (
                          <button
                            onClick={() =>
                              eliminarDocumento(d.id)
                            }

                            className="
                              inline-flex
                              items-center
                              justify-center

                              rounded-xl

                              border
                              border-red-100

                              bg-red-50

                              px-3.5
                              py-2

                              text-xs
                              font-medium

                              text-red-500

                              transition-all

                              hover:border-red-200

                              hover:bg-red-100

                              hover:text-red-600
                            "
                          >
                            Eliminar
                          </button>
                        )}

                      </div>

                    </div>

                  </li>

                ))}

              </ul>

            )}

          </div>

        </section>

      </div>

    </div>
  );
}

export default Intranet;
