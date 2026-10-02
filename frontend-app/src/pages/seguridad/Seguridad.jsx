import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import { useSeguridad } from "../../hooks/useSeguridad";

import SeguridadRoles from "./SeguridadRoles";
import SeguridadPermisos from "./SeguridadPermisos";
import SeguridadModulos from "./SeguridadModulos";

/**
 * ============================================================
 * SEGURIDAD — MOLSAN ERP SAAS PREMIUM 2027
 * CENTRO DE CONTROL DE SEGURIDAD
 * ============================================================
 *
 * Centro principal de seguridad del ERP.
 *
 * - Monitor general
 * - Estado del sistema
 * - Indicadores de seguridad
 * - Actividad reciente
 * - Alertas
 * - Roles
 * - Permisos
 * - Módulos
 * - Auditoría
 * - Logs técnicos
 *
 * Todo el módulo utiliza el mismo lenguaje visual ERP Premium.
 * ============================================================
 */


/**
 * ============================================================
 * ICONO
 * ============================================================
 */

const Icono = ({
  name,
  className = "w-5 h-5",
}) => (
  <svg
    className={`${className} flex-shrink-0`}
    aria-hidden="true"
  >
    <use href={`/icons/icons.svg#${name}`} />
  </svg>
);


/**
 * ============================================================
 * UTILIDADES
 * ============================================================
 */

function arraySeguro(valor) {
  return Array.isArray(valor)
    ? valor
    : [];
}


function textoSeguro(valor) {
  if (
    valor === null ||
    typeof valor === "undefined"
  ) {
    return "";
  }

  return String(valor);
}


/**
 * ============================================================
 * INDICADOR
 * ============================================================
 */

function IndicadorSeguridad({
  icon,
  titulo,
  valor,
  descripcion,
  accent = "primary",
}) {

  const accentClasses = {
    primary: {
      iconBg:
        "bg-[var(--erp-primary-soft)]",
      iconColor:
        "text-[var(--erp-primary)]",
    },

    success: {
      iconBg:
        "bg-emerald-50",
      iconColor:
        "text-emerald-600",
    },

    warning: {
      iconBg:
        "bg-amber-50",
      iconColor:
        "text-amber-600",
    },

    danger: {
      iconBg:
        "bg-red-50",
      iconColor:
        "text-red-600",
    },
  };

  const styles =
    accentClasses[accent] ||
    accentClasses.primary;

  return (
    <div
      className="
        bg-[var(--erp-surface)]
        border
        border-[var(--erp-border)]
        rounded-2xl
        shadow-sm
        p-5
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
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

          <p
            className="
              text-xs
              uppercase
              tracking-wide
              font-medium
              text-[var(--erp-text-soft)]
            "
          >
            {titulo}
          </p>

          <p
            className="
              text-2xl
              font-bold
              text-[var(--erp-text)]
              mt-1
            "
          >
            {valor}
          </p>

          {descripcion && (
            <p
              className="
                text-xs
                text-[var(--erp-text-soft)]
                mt-1
                leading-5
              "
            >
              {descripcion}
            </p>
          )}

        </div>


        <div
          className={`
            w-10
            h-10
            rounded-xl
            ${styles.iconBg}
            ${styles.iconColor}
            flex
            items-center
            justify-center
            flex-shrink-0
          `}
        >
          <Icono
            name={icon}
            className="w-5 h-5"
          />
        </div>

      </div>

    </div>
  );
}


/**
 * ============================================================
 * ACCESO RÁPIDO
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
      iconBg:
        "bg-[var(--erp-primary-soft)]",
      iconColor:
        "text-[var(--erp-primary)]",
    },

    warning: {
      iconBg:
        "bg-amber-50",
      iconColor:
        "text-amber-600",
    },

    success: {
      iconBg:
        "bg-emerald-50",
      iconColor:
        "text-emerald-600",
    },
  };

  const styles =
    accentClasses[accent] ||
    accentClasses.primary;

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
        <Icono
          name={icon}
          className="w-5 h-5"
        />
      </div>


      <div className="min-w-0 flex-1">

        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >

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
 * PANEL
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
            className="w-4 h-4"
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
 * ACTIVIDAD RECIENTE
 * ============================================================
 */

function ActividadReciente({
  auditoria,
}) {

  const registros =
    useMemo(() => {

      return arraySeguro(auditoria)
        .filter((item) => item)
        .slice(0, 6);

    }, [auditoria]);


  return (
    <section
      className="
        bg-[var(--erp-surface)]
        border
        border-[var(--erp-border)]
        rounded-2xl
        shadow-sm
        overflow-hidden
      "
    >

      <div
        className="
          px-5
          py-4
          border-b
          border-[var(--erp-border)]
        "
      >

        <h2
          className="
            text-base
            font-semibold
            text-[var(--erp-text)]
          "
        >
          Actividad reciente
        </h2>

        <p
          className="
            text-xs
            text-[var(--erp-text-soft)]
            mt-0.5
          "
        >
          Últimas operaciones registradas
        </p>

      </div>


      <div className="divide-y divide-[var(--erp-border)]">

        {registros.length === 0 ? (

          <div
            className="
              px-5
              py-10
              text-center
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-[var(--erp-primary-soft)]
                text-[var(--erp-primary)]
                flex
                items-center
                justify-center
                mx-auto
                mb-3
              "
            >
              <Icono
                name="clipboard"
                className="w-5 h-5"
              />
            </div>

            <p
              className="
                text-sm
                font-medium
                text-[var(--erp-text)]
              "
            >
              Sin actividad registrada
            </p>

            <p
              className="
                text-xs
                text-[var(--erp-text-soft)]
                mt-1
              "
            >
              No hay operaciones disponibles para mostrar.
            </p>

          </div>

        ) : (

          registros.map((item, index) => (

            <div
              key={
                item.id ??
                `actividad-${index}`
              }
              className="
                px-5
                py-3.5
                flex
                items-start
                gap-3
                hover:bg-[var(--erp-primary-soft)]
                transition
              "
            >

              <div
                className="
                  w-8
                  h-8
                  rounded-lg
                  bg-[var(--erp-primary-soft)]
                  text-[var(--erp-primary)]
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                "
              >
                <Icono
                  name="clipboard"
                  className="w-4 h-4"
                />
              </div>


              <div className="min-w-0 flex-1">

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-2
                    gap-y-1
                  "
                >

                  <span
                    className="
                      text-sm
                      font-medium
                      text-[var(--erp-text)]
                    "
                  >
                    {textoSeguro(item.usuario) ||
                      "Sistema"}
                  </span>

                  <span
                    className="
                      text-xs
                      text-[var(--erp-text-soft)]
                    "
                  >
                    ·
                  </span>

                  <span
                    className="
                      text-xs
                      text-[var(--erp-primary)]
                    "
                  >
                    {textoSeguro(item.accion) ||
                      "Actividad"}
                  </span>

                </div>


                <p
                  className="
                    text-sm
                    text-[var(--erp-text-soft)]
                    mt-0.5
                    truncate
                  "
                  title={
                    textoSeguro(
                      item.descripcion
                    )
                  }
                >
                  {textoSeguro(
                    item.descripcion
                  ) ||
                    "Sin descripción"}
                </p>


                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                    mt-1
                    text-[11px]
                    text-[var(--erp-text-soft)]
                  "
                >

                  <span>
                    {textoSeguro(
                      item.modulo
                    ) || "Sistema"}
                  </span>

                  <span>·</span>

                  <span>
                    {textoSeguro(
                      item.fecha
                    ) || "-"}
                  </span>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </section>
  );
}


/**
 * ============================================================
 * ESTADO / ALERTAS
 * ============================================================
 */

function PanelEstado({
  auditoria,
  logs,
}) {

  const auditoriaSegura =
    arraySeguro(auditoria);

  const logsSeguros =
    arraySeguro(logs);


  const intentosFallidos =
    auditoriaSegura.filter(
      (item) =>
        textoSeguro(
          item?.accion
        ).toLowerCase() ===
        "login_error"
    ).length;


  const erroresTecnicos =
    logsSeguros.filter(
      (item) =>
        textoSeguro(
          item?.evento
        ).toLowerCase() ===
        "error"
    ).length;


  const advertencias =
    logsSeguros.filter(
      (item) =>
        textoSeguro(
          item?.evento
        ).toLowerCase() ===
        "warning"
    ).length;


  const incidencias =
    erroresTecnicos +
    advertencias;


  const estado =
    incidencias === 0 &&
    intentosFallidos === 0
      ? "Sistema protegido"
      : "Revisión recomendada";


  const estadoClasses =
    incidencias === 0 &&
    intentosFallidos === 0
      ? {
          badge:
            "bg-emerald-50 border-emerald-100 text-emerald-700",
          dot:
            "bg-emerald-500",
        }
      : {
          badge:
            "bg-amber-50 border-amber-100 text-amber-700",
          dot:
            "bg-amber-500",
        };


  return (
    <section
      className="
        bg-[var(--erp-surface)]
        border
        border-[var(--erp-border)]
        rounded-2xl
        shadow-sm
        overflow-hidden
      "
    >

      <div
        className="
          px-5
          py-4
          border-b
          border-[var(--erp-border)]
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >

          <div>

            <h2
              className="
                text-base
                font-semibold
                text-[var(--erp-text)]
              "
            >
              Estado de seguridad
            </h2>

            <p
              className="
                text-xs
                text-[var(--erp-text-soft)]
                mt-0.5
              "
            >
              Supervisión de actividad y eventos
            </p>

          </div>


          <span
            className={`
              inline-flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-lg
              border
              text-xs
              font-medium
              ${estadoClasses.badge}
            `}
          >

            <span
              className={`
                w-1.5
                h-1.5
                rounded-full
                ${estadoClasses.dot}
              `}
            />

            {estado}

          </span>

        </div>

      </div>


      <div
        className="
          p-5
          grid
          grid-cols-1
          sm:grid-cols-3
          gap-4
        "
      >

        <div>

          <p
            className="
              text-xs
              text-[var(--erp-text-soft)]
            "
          >
            Intentos fallidos
          </p>

          <p
            className="
              text-xl
              font-bold
              text-[var(--erp-text)]
              mt-1
            "
          >
            {intentosFallidos}
          </p>

        </div>


        <div>

          <p
            className="
              text-xs
              text-[var(--erp-text-soft)]
            "
          >
            Errores técnicos
          </p>

          <p
            className="
              text-xl
              font-bold
              text-[var(--erp-text)]
              mt-1
            "
          >
            {erroresTecnicos}
          </p>

        </div>


        <div>

          <p
            className="
              text-xs
              text-[var(--erp-text-soft)]
            "
          >
            Advertencias
          </p>

          <p
            className="
              text-xl
              font-bold
              text-[var(--erp-text)]
              mt-1
            "
          >
            {advertencias}
          </p>

        </div>

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
    roles = [],
    permisos = [],
    empleados = [],
    auditoria = [],
    logs = [],
    cargarTodo,
    loading,
  } = useSeguridad();


  /**
   * ==========================================================
   * CARGA
   * ==========================================================
   */

  useEffect(() => {

    cargarTodo();

  }, [cargarTodo]);


  /**
   * ==========================================================
   * DATOS SEGUROS
   * ==========================================================
   */

  const rolesSeguros =
    useMemo(
      () => arraySeguro(roles),
      [roles]
    );


  const permisosSeguros =
    useMemo(
      () => arraySeguro(permisos),
      [permisos]
    );


  const empleadosSeguros =
    useMemo(
      () => arraySeguro(empleados),
      [empleados]
    );


  const auditoriaSegura =
    useMemo(
      () => arraySeguro(auditoria),
      [auditoria]
    );


  const logsSeguros =
    useMemo(
      () => arraySeguro(logs),
      [logs]
    );


  /**
   * ==========================================================
   * INDICADORES
   * ==========================================================
   */

  const usuariosActivos =
    useMemo(
      () =>
        empleadosSeguros.filter(
          (empleado) =>
            empleado &&
            (
              empleado.activo === true ||
              empleado.activo === 1
            )
        ).length,
      [empleadosSeguros]
    );


  const erroresSeguros =
    useMemo(
      () =>
        logsSeguros.filter(
          (item) =>
            textoSeguro(
              item?.evento
            ).toLowerCase() ===
            "error"
        ).length,
      [logsSeguros]
    );


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


  /**
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <div
      className="
        space-y-6
        animate-fade-in
      "
    >

      {/* ======================================================
          CABECERA PRINCIPAL
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
            gap-5
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
              min-w-0
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-[var(--erp-primary-soft)]
                text-[var(--erp-primary)]
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <Icono
                name="shield"
                className="w-6 h-6"
              />
            </div>


            <div className="min-w-0">

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >

                <h1
                  className="
                    text-2xl
                    font-bold
                    text-[var(--erp-text)]
                  "
                >
                  Centro de seguridad
                </h1>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-2.5
                    py-1
                    rounded-lg
                    bg-emerald-50
                    border
                    border-emerald-100
                    text-emerald-700
                    text-[11px]
                    font-medium
                  "
                >

                  <span
                    className="
                      w-1.5
                      h-1.5
                      rounded-full
                      bg-emerald-500
                    "
                  />

                  Monitor activo

                </span>

              </div>


              <p
                className="
                  text-sm
                  text-[var(--erp-text-soft)]
                  mt-1
                "
              >
                Centro de control y supervisión de seguridad de Molsan ERP
              </p>

            </div>

          </div>


          <div
            className="
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-xl
              bg-[var(--erp-bg)]
              border
              border-[var(--erp-border)]
              text-xs
              text-[var(--erp-text-soft)]
              w-fit
            "
          >

            <Icono
              name="shield"
              className="w-4 h-4 text-[var(--erp-primary)]"
            />

            Control centralizado

          </div>

        </div>

      </section>


      {/* ======================================================
          INDICADORES
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
            Resumen de seguridad
          </h2>

          <p
            className="
              text-sm
              text-[var(--erp-text-soft)]
              mt-0.5
            "
          >
            Estado actual de usuarios, configuración y actividad
          </p>

        </div>


        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-5
            gap-4
          "
        >

          <IndicadorSeguridad
            icon="user-group"
            titulo="Usuarios"
            valor={
              empleadosSeguros.length
            }
            descripcion="Usuarios disponibles"
          />


          <IndicadorSeguridad
            icon="user-group"
            titulo="Activos"
            valor={usuariosActivos}
            descripcion="Usuarios activos"
            accent="success"
          />


          <IndicadorSeguridad
            icon="shield"
            titulo="Roles"
            valor={
              rolesSeguros.length
            }
            descripcion="Roles configurados"
          />


          <IndicadorSeguridad
            icon="shield"
            titulo="Permisos"
            valor={
              permisosSeguros.length
            }
            descripcion="Permisos registrados"
          />


          <IndicadorSeguridad
            icon="clipboard"
            titulo="Auditoría"
            valor={
              auditoriaSegura.length
            }
            descripcion="Registros disponibles"
            accent={
              auditoriaSegura.length
                ? "primary"
                : "success"
            }
          />

        </div>

      </section>


      {/* ======================================================
          MONITOR
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
            Monitor de seguridad
          </h2>

          <p
            className="
              text-sm
              text-[var(--erp-text-soft)]
              mt-0.5
            "
          >
            Supervisión de actividad e incidencias del sistema
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

          <ActividadReciente
            auditoria={
              auditoriaSegura
            }
          />


          <PanelEstado
            auditoria={
              auditoriaSegura
            }
            logs={
              logsSeguros
            }
          />

        </div>

      </section>


      {/* ======================================================
          ACCESOS DE CONTROL
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
            Control y supervisión
          </h2>

          <p
            className="
              text-sm
              text-[var(--erp-text-soft)]
              mt-0.5
            "
          >
            Acceso directo a los registros y controles de seguridad
          </p>

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
            descripcion="Revisa eventos técnicos, errores, incidencias y registros del sistema."
            accent="warning"
          />

        </div>

      </section>


      {/* ======================================================
          CONFIGURACIÓN
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
            Gestiona quién puede acceder y qué puede visualizar dentro del ERP
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


      {/* ======================================================
          PIE INFORMATIVO
          ====================================================== */}

      <section
        className="
          bg-[var(--erp-bg)]
          border
          border-[var(--erp-border)]
          rounded-2xl
          px-5
          py-4
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
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
                w-8
                h-8
                rounded-lg
                bg-[var(--erp-primary-soft)]
                text-[var(--erp-primary)]
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <Icono
                name="shield"
                className="w-4 h-4"
              />
            </div>


            <div>

              <p
                className="
                  text-sm
                  font-medium
                  text-[var(--erp-text)]
                "
              >
                Seguridad centralizada
              </p>

              <p
                className="
                  text-xs
                  text-[var(--erp-text-soft)]
                  mt-0.5
                "
              >
                Roles, permisos, módulos, auditoría y registros técnicos desde un único centro.
              </p>

            </div>

          </div>


          <div
            className="
              text-xs
              text-[var(--erp-text-soft)]
            "
          >
            Molsan ERP · Seguridad
          </div>

        </div>

      </section>

    </div>
  );
}
