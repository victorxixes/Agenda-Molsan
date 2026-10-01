import { NavLink } from "react-router-dom";
import { useMemo } from "react";
import { puedeVerModulo } from "../utils/permisos";
import { useAuthStore } from "../store/authStore";
import { useMensajesStore } from "../store/mensajesStore";

/**
 * ============================================================
 * ICONO DE NAVEGACIÓN
 * ============================================================
 */

const NavIcon = ({ name }) => (
  <svg
    className="w-4 h-4 flex-shrink-0"
    aria-hidden="true"
  >
    <use href={`/icons/icons.svg#${name}`} />
  </svg>
);


/**
 * ============================================================
 * BOTÓN DE NAVEGACIÓN
 * ============================================================
 */

const TopNavItem = ({
  to,
  label,
  icon,
  badge = 0,
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `
      flex items-center gap-2
      px-4 py-2.5
      rounded-xl
      whitespace-nowrap
      text-sm font-medium
      transition-all duration-200
      border
      ${
        isActive
          ? `
            bg-[var(--erp-primary)]
            text-white
            border-[var(--erp-primary)]
            shadow-sm
          `
          : `
            bg-white
            text-[var(--erp-text)]
            border-[var(--erp-border)]
            hover:bg-[var(--erp-primary-soft)]
            hover:text-[var(--erp-primary)]
            hover:border-[var(--erp-primary)]
          `
      }
      `
    }
  >
    <NavIcon name={icon} />

    <span>{label}</span>

    {badge > 0 && (
      <span
        className="
          min-w-[20px]
          h-5
          px-1.5
          flex
          items-center
          justify-center
          rounded-full
          bg-red-500
          text-white
          text-[11px]
          font-bold
        "
      >
        {badge}
      </span>
    )}
  </NavLink>
);


/**
 * ============================================================
 * SEPARADOR
 * ============================================================
 */

const NavSeparator = () => (
  <div
    className="
      h-7
      w-px
      bg-[var(--erp-border)]
      flex-shrink-0
      mx-1
    "
  />
);


/**
 * ============================================================
 * NAVEGACIÓN SUPERIOR
 *
 * Se mantiene el nombre Sidebar.jsx para no tener que modificar
 * imports existentes del Layout.
 * ============================================================
 */

export default function Sidebar() {
  const empleado = useAuthStore((s) => s.empleado);
  const logout = useAuthStore((s) => s.logout);

  const mensajesNoLeidos = useMensajesStore(
    (s) => s.noLeidosTotal || 0
  );

  const safeUser = useMemo(
    () =>
      empleado || {
        nombre: "Usuario",
        foto: "/icons/user-default.png",
        id: 0,
      },
    [empleado]
  );

  return (
    <div
      className="
        w-full
        bg-[var(--erp-surface)]
        border-b
        border-[var(--erp-border)]
        shadow-sm
      "
    >

      {/* ======================================================
          FILA PRINCIPAL
          ====================================================== */}

      <div
        className="
          max-w-[1800px]
          mx-auto
          px-4
          lg:px-6
          py-3
          flex
          items-center
          justify-between
          gap-4
        "
      >

        {/* MARCA */}

        <div className="flex items-center gap-3 flex-shrink-0">

          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-[var(--erp-primary)]
              text-white
              flex
              items-center
              justify-center
              shadow-sm
            "
          >
            <svg className="w-5 h-5">
              <use href="/icons/icons.svg#folder" />
            </svg>
          </div>

          <div className="hidden sm:block">
            <div
              className="
                text-base
                font-bold
                text-[var(--erp-text)]
                leading-tight
              "
            >
              Agenda Molsan
            </div>

            <div
              className="
                text-xs
                text-[var(--erp-text-soft)]
              "
            >
              Gestión empresarial
            </div>
          </div>

        </div>


        {/* ====================================================
            ACCIONES DERECHA
            ==================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            flex-shrink-0
          "
        >

          {/* MI PERFIL */}

          <button
            type="button"
            onClick={() =>
              useAuthStore
                .getState()
                .setPerfilModal(safeUser.id)
            }
            title="Mi perfil"
            className="
              w-10
              h-10
              rounded-xl
              border
              border-[var(--erp-border)]
              bg-white
              text-[var(--erp-text)]
              flex
              items-center
              justify-center
              hover:bg-[var(--erp-primary-soft)]
              hover:text-[var(--erp-primary)]
              transition
            "
          >
            <svg className="w-5 h-5">
              <use href="/icons/icons.svg#user" />
            </svg>
          </button>


          {/* CERRAR SESIÓN */}

          <button
            type="button"
            onClick={logout}
            title="Cerrar sesión"
            className="
              w-10
              h-10
              rounded-xl
              border
              border-[var(--erp-border)]
              bg-white
              text-red-500
              flex
              items-center
              justify-center
              hover:bg-red-50
              hover:border-red-200
              transition
            "
          >
            <svg className="w-5 h-5">
              <use href="/icons/icons.svg#logout" />
            </svg>
          </button>

        </div>

      </div>


      {/* ======================================================
          NAVEGACIÓN
          ====================================================== */}

      <div
        className="
          border-t
          border-[var(--erp-border)]
          bg-[var(--erp-surface-soft)]
        "
      >

        <div
          className="
            max-w-[1800px]
            mx-auto
            px-4
            lg:px-6
            py-2.5
          "
        >

          <nav
            className="
              flex
              items-center
              gap-2
              overflow-x-auto
              scrollbar-thin
              pb-0.5
            "
          >

            {/* ==================================================
                GENERAL
                ================================================== */}

            {puedeVerModulo("expedientes") && (
              <TopNavItem
                to="/expedientes"
                label="Expedientes"
                icon="folder"
              />
            )}

            <TopNavItem
              to="/dashboard"
              label="Dashboard"
              icon="home"
            />

            {puedeVerModulo("agenda") && (
              <TopNavItem
                to="/agenda"
                label="Agenda"
                icon="calendar"
              />
            )}


            {/* SEPARADOR */}

            {(puedeVerModulo("empleados") ||
              puedeVerModulo("ctn") ||
              puedeVerModulo("intranet") ||
              puedeVerModulo("mensajes")) && (
              <NavSeparator />
            )}


            {/* ==================================================
                GESTIÓN
                ================================================== */}

            {puedeVerModulo("empleados") && (
              <TopNavItem
                to="/empleados"
                label="Empleados"
                icon="user-group"
              />
            )}

            {puedeVerModulo("ctn") && (
              <TopNavItem
                to="/ctn"
                label="CTN — Notarios"
                icon="globe"
              />
            )}

            {puedeVerModulo("intranet") && (
              <TopNavItem
                to="/intranet"
                label="Intranet"
                icon="globe"
              />
            )}

            {puedeVerModulo("mensajes") && (
              <TopNavItem
                to="/mensajes"
                label="Mensajes"
                icon="chat"
                badge={mensajesNoLeidos}
              />
            )}


            {/* SEPARADOR */}

            {(puedeVerModulo("logs") ||
              puedeVerModulo("seguridad") ||
              puedeVerModulo("utilidades")) && (
              <NavSeparator />
            )}


            {/* ==================================================
                SISTEMA
                ================================================== */}

            {puedeVerModulo("logs") && (
              <TopNavItem
                to="/logs"
                label="Logs"
                icon="clipboard"
              />
            )}

            {puedeVerModulo("seguridad") && (
              <TopNavItem
                to="/seguridad"
                label="Seguridad"
                icon="shield"
              />
            )}

            {puedeVerModulo("utilidades") && (
              <TopNavItem
                to="/herramientas/utilidades"
                label="Utilidades"
                icon="cog"
              />
            )}

          </nav>

        </div>

      </div>

    </div>
  );
}
