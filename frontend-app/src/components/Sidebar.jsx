import { NavLink } from "react-router-dom";
import { useMemo } from "react";
import { puedeVerModulo } from "../utils/permisos";
import { useAuthStore } from "../store/authStore";
import { useMensajesStore } from "../store/mensajesStore";
import { useNotificacionesStore } from "../store/notificacionesStore";

/**
 * ============================================================
 * ICONO DE NAVEGACIÓN
 * ============================================================
 */

const NavIcon = ({ name }) => (
  <svg
    className="w-4 h-4 flex-shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <use href={`/icons/icons.svg#${name}`} />
  </svg>
);


/**
 * ============================================================
 * ICONO PERFIL
 * ============================================================
 */

const ProfileIcon = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" />
  </svg>
);


/**
 * ============================================================
 * ICONO SALIR
 * ============================================================
 */

const LogoutIcon = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);


/**
 * ============================================================
 * ICONO NOTIFICACIONES
 * ============================================================
 */

const BellIcon = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
    <path d="M10 21h4" />
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
      flex
      items-center
      gap-2
      px-3
      py-2
      rounded-xl
      whitespace-nowrap
      text-sm
      font-medium
      transition-all
      duration-200
      border
      flex-shrink-0

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
          min-w-[19px]
          h-[19px]
          px-1
          flex
          items-center
          justify-center
          rounded-full
          bg-red-500
          text-white
          text-[10px]
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
      mx-0.5
    "
  />
);


/**
 * ============================================================
 * SIDEBAR
 *
 * Aunque el nombre del fichero sigue siendo Sidebar.jsx,
 * visualmente funciona como navegación superior.
 * ============================================================
 */

export default function Sidebar() {

  const empleado = useAuthStore((s) => s.empleado);
  const logout = useAuthStore((s) => s.logout);

  const mensajesNoLeidos = useMensajesStore(
    (s) => s.noLeidosTotal || 0
  );

  const unreadCount = useNotificacionesStore(
    (s) => s.unreadCount || 0
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
    <header
      className="
        w-full
        bg-[var(--erp-surface)]
        border-b
        border-[var(--erp-border)]
        shadow-sm
      "
    >

      <div
        className="
          max-w-[1800px]
          mx-auto
          px-4
          lg:px-6
          py-2
          flex
          items-center
          gap-4
          min-w-0
        "
      >

        {/* ====================================================
            MARCA
            ==================================================== */}

        <div
          className="
            flex
            items-center
            gap-3
            flex-shrink-0
          "
        >

          <div
            className="
              w-9
              h-9
              rounded-xl
              bg-[var(--erp-primary)]
              text-white
              flex
              items-center
              justify-center
              shadow-sm
            "
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="/icons/icons.svg#folder" />
            </svg>
          </div>

          <div className="hidden lg:block">

            <div
              className="
                text-sm
                font-bold
                text-[var(--erp-text)]
                leading-tight
              "
            >
              CancelaGest
            </div>

            <div
              className="
                text-[11px]
                text-[var(--erp-text-soft)]
                leading-tight
              "
            >
              Gestión empresarial
            </div>

          </div>

        </div>


        {/* ====================================================
            NAVEGACIÓN
            ==================================================== */}

        <nav
          className="
            flex
            items-center
            gap-1.5
            flex-1
            min-w-0
            overflow-x-auto
            scrollbar-thin
            pb-0.5
          "
        >

          {/* GENERAL */}

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


          {/* GESTIÓN */}

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


          {/* SISTEMA */}

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


        {/* ====================================================
            ACCIONES DERECHA
            PERFIL + NOTIFICACIONES + SALIR
            ==================================================== */}

        <div
          className="
            flex
            items-center
            gap-1.5
            flex-shrink-0
            pl-2
            border-l
            border-[var(--erp-border)]
          "
        >

          {/* NOTIFICACIONES */}

          <button
            type="button"
            title="Notificaciones"
            className="
              relative
              w-9
              h-9
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
              hover:border-[var(--erp-primary)]
              transition
              active:scale-[0.96]
            "
          >

            <BellIcon />

            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  min-w-[17px]
                  h-[17px]
                  px-1
                  rounded-full
                  bg-red-500
                  text-white
                  text-[9px]
                  font-bold
                  flex
                  items-center
                  justify-center
                  border-2
                  border-[var(--erp-surface)]
                "
              >
                {unreadCount}
              </span>
            )}

          </button>


          {/* PERFIL */}

          <button
            type="button"
            onClick={() =>
              useAuthStore
                .getState()
                .setPerfilModal(safeUser.id)
            }
            title="Mi perfil"
            className="
              w-9
              h-9
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
              hover:border-[var(--erp-primary)]
              transition
              active:scale-[0.96]
            "
          >
            <ProfileIcon />
          </button>


          {/* CERRAR SESIÓN */}

          <button
            type="button"
            onClick={logout}
            title="Cerrar sesión"
            className="
              w-9
              h-9
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
              active:scale-[0.96]
            "
          >
            <LogoutIcon />
          </button>

        </div>

      </div>

    </header>
  );
}
