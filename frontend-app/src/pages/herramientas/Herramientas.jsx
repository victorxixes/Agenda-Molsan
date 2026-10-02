import { Link } from "react-router-dom";

/**
 * HERRAMIENTAS — MOLSAN ERP SAAS PREMIUM 2027
 *
 * - Glass Luxe
 * - Tarjetas corporativas
 * - Responsive
 * - Sin cambiar navegación
 */

export default function Herramientas() {
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
            🛠️
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
              Herramientas
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Utilidades y herramientas de gestión del ERP.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          GRID
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-3
          gap-5
          max-w-6xl
        "
      >

        <Card
          titulo="Importar CTN"
          descripcion="Importa información CTN desde un archivo Excel."
          icono="📥"
          link="/herramientas/importar-ctn"
        />

      </div>

    </div>
  );
}


/* =========================================================
   CARD
========================================================= */

function Card({
  titulo,
  descripcion,
  icono,
  link,
}) {
  return (
    <Link
      to={link}
      className="
        group
        relative
        overflow-hidden
        block
        rounded-[22px]
        border
        border-slate-200/80
        bg-white/80
        backdrop-blur-xl
        p-5
        shadow-[0_12px_35px_rgba(15,23,42,0.06)]
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-blue-200
        hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]
        active:scale-[0.98]
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
          opacity-0
          group-hover:opacity-100
          transition-opacity
        "
      />


      <div className="flex items-start gap-4">

        {/* ICONO */}

        <div
          className="
            flex
            items-center
            justify-center
            w-12
            h-12
            shrink-0
            rounded-2xl
            bg-blue-50
            border
            border-blue-100
            text-xl
            shadow-sm
            transition-transform
            duration-200
            group-hover:scale-105
          "
        >
          {icono}
        </div>


        {/* TEXTO */}

        <div className="min-w-0">

          <h2
            className="
              text-base
              sm:text-lg
              font-semibold
              text-slate-800
            "
          >
            {titulo}
          </h2>

          <p
            className="
              mt-1
              text-sm
              leading-relaxed
              text-slate-500
            "
          >
            {descripcion}
          </p>

        </div>

      </div>


      {/* ACCESO */}

      <div
        className="
          flex
          items-center
          justify-between
          mt-5
          pt-4
          border-t
          border-slate-100
        "
      >

        <span className="text-xs font-medium text-slate-400">
          Herramienta
        </span>

        <span
          className="
            text-sm
            font-semibold
            text-blue-600
            transition-transform
            duration-200
            group-hover:translate-x-1
          "
        >
          Abrir →
        </span>

      </div>

    </Link>
  );
}
