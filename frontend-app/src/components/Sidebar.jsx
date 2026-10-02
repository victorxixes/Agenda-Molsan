import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

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
 * ICONO CHEVRON
 * ============================================================
 */

const ChevronDownIcon = ({ open = false }) => (
  <svg
    className={`
      w-3.5 h-3.5
      flex-shrink-0
      transition-transform
      duration-200
      ${open ? "rotate-180" : ""}
    `}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
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
 * ELEMENTO DEL MENÚ "MÁS"
 * ============================================================
 */

const MoreNavItem = ({
  to,
  label,
  icon,
  badge = 0,
  onNavigate,
}) => (
  <NavLink
    to={to}
    onClick={onNavigate}
    className={({ isActive }) =>
      `
      flex
      items-center
      gap-2.5
      w-full
      px-3
      py-2.5
      rounded-xl
      text-sm
      font-medium
      transition-all
      duration-200
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

    <span className="flex-1 text-left">
      {label}
    </span>

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
    aria-hidden="true"
  />
);


/**
 * ============================================================
 * SIDEBAR
 *
 * Visualmente funciona como navegación superior.
 *
 * PRINCIPALES:
 *
 *   Expedientes
 *   Dashboard
 *   Agenda
 *   Empleados
 *   CTN
 *   Intranet
 *   Noticias
 *   Utilidades
 *
 * RESTO:
 *
 *   Más ▾
 *
 * TODO SE FILTRA SEGÚN puedeVerModulo().
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

  const [moreOpen, setMoreOpen] = useState(false);

  const moreRef = useRef(null);


  /**
   * ==========================================================
   * USUARIO SEGURO
   * ==========================================================
   */

  const safeUser = useMemo(
    () =>
      empleado || {
        nombre: "Usuario",
        foto: "/icons/user-default.png",
        id: 0,
      },
    [empleado]
  );


  /**
   * ==========================================================
   * CATÁLOGO DE MÓDULOS
   *
   * El orden aquí determina el orden visual.
   * ==========================================================
   */

  const modulos = useMemo(
    () => [
      {
        id: "expedientes",
        label: "Expedientes",
        to: "/expedientes",
        icon: "folder",
        principal: true,
      },

      {
        id: "dashboard",
        label: "Dashboard",
        to: "/dashboard",
        icon: "home",
        principal: true,
      },

      {
        id: "agenda",
        label: "Agenda",
        to: "/agenda",
        icon: "calendar",
        principal: true,
      },

      {
        id: "empleados",
        label: "Empleados",
        to: "/empleados",
        icon: "user-group",
        principal: true,
      },

      {
        id: "ctn",
        label: "CTN — Notarios",
        to: "/ctn",
        icon: "globe",
        principal: true,
      },

      {
        id: "intranet",
        label: "Intranet",
        to: "/intranet",
        icon: "globe",
        principal: true,
      },

      {
        id: "noticias",
        label: "Noticias",
        to: "/noticias",
        icon: "news",
        principal: true,
      },

      {
        id: "utilidades",
        label: "Utilidades",
        to: "/herramientas/utilidades",
        icon: "cog",
        principal: true,
      },


      /**
       * ========================================================
       * RESTO DE MÓDULOS
       * ========================================================
       */

      {
        id: "documentos",
        label: "Documentos",
        to: "/documentos",
        icon: "file-text",
        principal: false,
      },

      {
        id: "herramientas",
        label: "Herramientas",
        to: "/herramientas",
        icon: "wrench",
        principal: false,
      },

      {
        id: "logs",
        label: "Logs",
        to: "/logs",
        icon: "clipboard",
        principal: false,
      },

      {
        id: "maestros",
        label: "Maestros",
        to: "/maestros",
        icon: "database",
        principal: false,
      },

      {
        id: "mensajes",
        label: "Mensajes",
        to: "/mensajes",
        icon: "chat",
        principal: false,
        badge: mensajesNoLeidos,
      },

      {
        id: "notificaciones",
        label: "Notificaciones",
        to: "/notificaciones",
        icon: "bell",
        principal: false,
        badge: unreadCount,
      },

      {
        id: "panel-tecnico",
        label: "Panel técnico",
        to: "/panel-tecnico",
        icon: "settings",
        principal: false,
      },

      {
        id: "realtime",
        label: "Realtime",
        to: "/realtime",
        icon: "activity",
        principal: false,
      },

      {
        id: "seguridad",
        label: "Seguridad",
        to: "/seguridad",
        icon: "shield",
        principal: false,
      },
    ],
    [
      mensajesNoLeidos,
      unreadCount,
    ]
  );


  /**
   * ==========================================================
   * MÓDULOS VISIBLES
   *
   * IMPORTANTE:
   *
   * Aquí se filtra TODO.
   *
   * Por tanto:
   *
   * usuario A -> 5 módulos
   * usuario B -> 10 módulos
   * usuario C -> 18 módulos
   *
   * cada uno verá una navegación distinta.
   * ==========================================================
   */

  const modulosVisibles = useMemo(
    () =>
      modulos.filter((modulo) =>
        puedeVerModulo(modulo.id)
      ),
    [modulos]
  );


  /**
   * ==========================================================
   * PRINCIPALES VISIBLES
   * ==========================================================
   */

  const modulosPrincipales = useMemo(
    () =>
      modulosVisibles.filter(
        (modulo) => modulo.principal
      ),
    [modulosVisibles]
  );


  /**
   * ==========================================================
   * MÓDULOS DENTRO DE "MÁS"
   * ==========================================================
   */

  const modulosMas = useMemo(
    () =>
      modulosVisibles.filter(
        (modulo) => !modulo.principal
      ),
    [modulosVisibles]
  );


  /**
   * ==========================================================
   * CERRAR "MÁS" AL HACER CLICK FUERA
   * ==========================================================
   */

  useEffect(() => {

    if (!moreOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {

      if (
        moreRef.current &&
        !moreRef.current.contains(event.target)
      ) {
        setMoreOpen(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown
      );
    };

  }, [moreOpen]);


  /**
   * ==========================================================
   * CERRAR "MÁS" CON ESC
   * ==========================================================
   */

  useEffect(() => {

    if (!moreOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {

      if (event.key === "Escape") {
        setMoreOpen(false);
      }

    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, [moreOpen]);


  /**
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <header
      className="
        w-full
        bg-[var(--erp-surface)]
        border-b
        border-[var(--erp-border)]
        shadow-sm
        relative
        z-50
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
    bg-white
    flex
    items-center
    justify-center
    overflow-hidden
    flex-shrink-0
  "
>
  <img
    src="/img/logo.jpg"
    alt="CancelaGest"
    className="
      w-full
      h-full
      object-contain
    "
  />
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
            NAVEGACIÓN PRINCIPAL
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
          aria-label="Navegación principal"
        >

          {modulosPrincipales.map(
            (modulo, index) => {

              /**
               * ------------------------------------------------
               * Separador después de Agenda
               * ------------------------------------------------
               */

              const mostrarSeparador =
                modulo.id === "empleados" &&
                modulosPrincipales.some(
                  (m) => m.id === "expedientes"
                );

              return (
                <div
                  key={modulo.id}
                  className="
                    flex
                    items-center
                    gap-1.5
                  "
                >

                  {mostrarSeparador && (
                    <NavSeparator />
                  )}

                  <TopNavItem
                    to={modulo.to}
                    label={modulo.label}
                    icon={modulo.icon}
                    badge={modulo.badge || 0}
                  />

                </div>
              );

            }
          )}


          {/* ==================================================
              BOTÓN MÁS

              SOLO aparece si existen módulos adicionales
              visibles para el usuario.
              ================================================== */}

          {modulosMas.length > 0 && (

            <div
              ref={moreRef}
              className="
                relative
                flex-shrink-0
              "
            >

              <button
                type="button"
                onClick={() =>
                  setMoreOpen((value) => !value)
                }
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                className={`
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

                  ${
                    moreOpen
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
                `}
              >

                <span>
                  Más
                </span>

                <ChevronDownIcon
                  open={moreOpen}
                />

              </button>


              {/* ==============================================
                  MENÚ DESPLEGABLE
                  ============================================== */}

              {moreOpen && (

                <div
                  role="menu"
                  className="
                    absolute
                    top-[calc(100%+8px)]
                    right-0
                    w-[250px]
                    max-h-[min(70vh,520px)]
                    overflow-y-auto
                    p-2
                    rounded-2xl
                    border
                    border-[var(--erp-border)]
                    bg-[var(--erp-surface)]
                    shadow-xl
                    z-[100]
                    animate-in
                    fade-in
                    slide-in-from-top-1
                    duration-150
                  "
                >

                  <div
                    className="
                      px-3
                      pt-2
                      pb-2.5
                      mb-1
                      border-b
                      border-[var(--erp-border)]
                    "
                  >

                    <div
                      className="
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-[var(--erp-text-soft)]
                      "
                    >
                      Más módulos
                    </div>

                    <div
                      className="
                        text-[11px]
                        text-[var(--erp-text-soft)]
                        mt-0.5
                      "
                    >
                      {modulosMas.length} disponibles
                    </div>

                  </div>


                  <div className="space-y-1">

                    {modulosMas.map(
                      (modulo) => (
                        <div
                          key={modulo.id}
                          role="menuitem"
                        >
                          <MoreNavItem
                            to={modulo.to}
                            label={modulo.label}
                            icon={modulo.icon}
                            badge={modulo.badge || 0}
                            onNavigate={() =>
                              setMoreOpen(false)
                            }
                          />
                        </div>
                      )
                    )}

                  </div>

                </div>

              )}

            </div>

          )}

        </nav>


        {/* ====================================================
            ACCIONES DERECHA
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


          {/* ==================================================
              NOTIFICACIONES
              ================================================== */}

          <button
            type="button"
            title="Notificaciones"
            aria-label="Notificaciones"
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


          {/* ==================================================
              PERFIL
              ================================================== */}

          <button
            type="button"
            onClick={() =>
              useAuthStore
                .getState()
                .setPerfilModal(safeUser.id)
            }
            title="Mi perfil"
            aria-label="Mi perfil"
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


          {/* ==================================================
              CERRAR SESIÓN
              ================================================== */}

          <button
            type="button"
            onClick={logout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
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
