import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSeguridad } from "../../hooks/useSeguridad";
import SeguridadRoles from "./SeguridadRoles";
import SeguridadPermisos from "./SeguridadPermisos";
import SeguridadModulos from "./SeguridadModulos";

/**
 * ============================================================
 * SEGURIDAD — MOLSAN ERP SAAS PREMIUM 2027
 * ============================================================
 *
 * - Panel principal de seguridad
 * - Roles
 * - Permisos
 * - Módulos visibles
 * - Auditoría
 * - Logs técnicos
 * - Diseño ERP Premium
 * ============================================================
 */

const Icono = ({ name, className = "w-5 h-5" }) => (
  <svg
    className={`${className} flex-shrink-0`}
    aria-hidden="true"
  >
    <use href={`/icons/icons.svg#${name}`} />
  </svg>
);


/**
 * ============================================================
 * TARJETA DE ACCESO
 * ============================================================
 */

function TarjetaAcceso({
  to,
  icon,
  titulo,
  descripcion,
  accent = "primary",
}) {
  const accentClasses = {
    primary: {
      iconBg: "bg-[var(--erp-primary-soft)]",
      iconColor: "text-[var(--erp-primary)]",
    },
    warning: {
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  };

  const styles =
    accentClasses[accent] || accentClasses.primary;

  return (
    <Link
      to={to}
      className="
        group
        flex
        items-center
        gap-4
        p-5
        rounded-2xl
        bg-[var(--erp-surface)]
        border
        border-[var(--erp-border)]
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        hover:border-[var(--erp-primary)]
      "
    >
      <div
        className={`
          w-11
          h-11
          rounded-xl
          ${styles.iconBg}
          ${styles.iconColor}
          flex
          items-center
          justify-center
          transition
          group-hover:scale-105
        `}
      >
        <Icono name={icon} className="w-5 h-5" />
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-center justify-between gap-3">

          <h2
            className="
              text-base
              font-semibold
              text-[var(--erp-text)]
            "
          >
            {titulo}
          </h2>

          <span
            className="
              text-[var(--erp-text-soft)]
              transition
              group-hover:text-[var(--erp-primary)]
              group-hover:translate-x-0.5
            "
          >
            →
          </span>

        </div>

        <p
          className="
            mt-1
            text-sm
            leading-5
            text-[var(--erp-text-soft)]
          "
        >
          {descripcion}
        </p>

      </div>
    </Link>
  );
}


/**
 * ============================================================
 * PANEL DE SEGURIDAD
 * ============================================================
 */

function PanelSeguridad({
  icon,
  titulo,
  descripcion,
  children,
  className = "",
}) {
  return (
    <section
      className={`
        bg-[var(--erp-surface)]
        border
        border-[var(--erp-border)]
        rounded-2xl
        shadow-sm
        overflow-hidden
        ${className}
      `}
    >

      {/* CABECERA */}

      <div
        className="
          px-5
          py-4
          border-b
          border-[var(--erp-border)]
          flex
          items-center
          gap-3
        "
      >

        <div
          className="
            w-9
            h-9
            rounded-xl
            bg-[var(--erp-primary-soft)]
            text-[var(--erp-primary)]
            flex
            items-center
            justify-center
            flex-shrink-0
          "
        >
          <Icono
            name={icon}
            className="w-4.5 h-4.5"
          />
        </div>

        <div className="min-w-0">

          <h3
            className="
              text-base
              font-semibold
              text-[var(--erp-text)]
            "
          >
            {titulo}
          </h3>

          {descripcion && (
            <p
              className="
                text-xs
                mt-0.5
                text-[var(--erp-text-soft)]
              "
            >
              {descripcion}
            </p>
          )}

        </div>

      </div>


      {/* CONTENIDO */}

      <div className="p-5">
        {children}
      </div>

    </section>
  );
}


/**
 * ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================
 */

export default function Seguridad() {

  const {
    cargarTodo,
    loading,
  } = useSeguridad();


  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);


  /**
   * ==========================================================
   * LOADING
   * ==========================================================
   */

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
            flex-col
            items-center
            gap-3
            text-[var(--erp-text-soft)]
          "
        >

          <div
            className="
              w-8
              h-8
              rounded-full
              border-2
              border-[var(--erp-border)]
              border-t-[var(--erp-primary)]
              animate-spin
            "
          />

          <span className="text-sm">
            Cargando seguridad…
          </span>

        </div>

      </div>
    );
  }


  return (
    <div
      className="
        space-y-6
        animate-fade-in
      "
    >

      {/* ======================================================
          CABECERA
          ====================================================== */}

      <section
        className="
          bg-[var(--erp-surface)]
          border
          border-[var(--erp-border)]
          rounded-2xl
          shadow-sm
          px-6
          py-5
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-4
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-[var(--erp-primary-soft)]
                  text-[var(--erp-primary)]
                  flex
                  items-center
                  justify-center
                "
              >
                <Icono
                  name="shield"
                  className="w-5 h-5"
                />
              </div>

              <div>

                <h1
                  className="
                    text-2xl
                    font-bold
                    text-[var(--erp-text)]
                  "
                >
                  Seguridad del sistema
                </h1>

                <p
                  className="
                    text-sm
                    text-[var(--erp-text-soft)]
                    mt-0.5
                  "
                >
                  Administración de roles, permisos y acceso a módulos
                </p>

              </div>

            </div>

          </div>


          {/* ESTADO */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-3
              py-2
              rounded-xl
              bg-emerald-50
              border
              border-emerald-100
              text-emerald-700
              text-xs
              font-medium
              w-fit
            "
          >

            <span
              className="
                w-2
                h-2
                rounded-full
                bg-emerald-500
              "
            />

            Sistema protegido

          </div>

        </div>

      </section>


      {/* ======================================================
          ACCESOS RÁPIDOS
          ====================================================== */}

      <section>

        <div
          className="
            flex
            items-center
            justify-between
            mb-3
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-semibold
                text-[var(--erp-text)]
              "
            >
              Control y supervisión
            </h2>

            <p
              className="
                text-sm
                text-[var(--erp-text-soft)]
                mt-0.5
              "
            >
              Consulta y revisión de actividad del sistema
            </p>

          </div>

        </div>


        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          "
        >

          <TarjetaAcceso
            to="/seguridad/auditoria"
            icon="clipboard"
            titulo="Auditoría"
            descripcion="Consulta las acciones registradas y la actividad de los usuarios."
            accent="primary"
          />

          <TarjetaAcceso
            to="/seguridad/logs"
            icon="clipboard"
            titulo="Logs técnicos"
            descripcion="Revisa eventos técnicos, incidencias y registros de seguridad."
            accent="warning"
          />

        </div>

      </section>


      {/* ======================================================
          CONFIGURACIÓN DE SEGURIDAD
          ====================================================== */}

      <section>

        <div className="mb-3">

          <h2
            className="
              text-lg
              font-semibold
              text-[var(--erp-text)]
            "
          >
            Configuración de acceso
          </h2>

          <p
            className="
              text-sm
              text-[var(--erp-text-soft)]
              mt-0.5
            "
          >
            Gestiona quién puede acceder y qué puede visualizar
          </p>

        </div>


        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-5
          "
        >

          {/* ==================================================
              ROLES
              ================================================== */}

          <PanelSeguridad
            icon="user-group"
            titulo="Roles del sistema"
            descripcion="Perfiles y niveles de acceso"
          >
            <SeguridadRoles />
          </PanelSeguridad>


          {/* ==================================================
              PERMISOS
              ================================================== */}

          <PanelSeguridad
            icon="shield"
            titulo="Permisos globales"
            descripcion="Autorizaciones disponibles"
          >
            <SeguridadPermisos />
          </PanelSeguridad>


          {/* ==================================================
              MÓDULOS
              ================================================== */}

          <PanelSeguridad
            icon="folder"
            titulo="Módulos visibles"
            descripcion="Control de acceso a las diferentes áreas del ERP"
            className="xl:col-span-2"
          >
            <SeguridadModulos />
          </PanelSeguridad>

        </div>

      </section>

    </div>
  );
}
