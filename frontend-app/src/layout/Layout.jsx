import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

import EmpleadoPerfilModal from "../components/SidebarPerfilModal";

import { useNotificacionesWS } from "../hooks/useNotificacionesWS";
import { useNotificacionesStore } from "../store/notificacionesStore";
import NotificacionesToast from "../components/notificaciones/NotificacionesToast";


/**
 * ============================================================
 * LAYOUT PRINCIPAL — ERP SJ-2026
 * ============================================================
 *
 * Cambios visuales:
 *
 * - Se elimina el sidebar lateral.
 * - La navegación pasa a la parte superior.
 * - Se elimina el fondo azul global.
 * - Se utiliza el nuevo tema ERP.
 *
 * Se mantienen:
 *
 * - WebSocket empleados
 * - WebSocket notificaciones
 * - Perfil
 * - Notificaciones realtime
 * - Outlet de React Router
 * ============================================================
 */

export default function Layout() {

  const empleado = useAuthStore(
    (s) => s.empleado
  );

  const perfilModal = useAuthStore(
    (s) => s.perfilModal
  );

  const setPerfilModal = useAuthStore(
    (s) => s.setPerfilModal
  );


  // ============================================================
  // NOTIFICACIONES REALTIME
  // ============================================================

  useNotificacionesWS(
    empleado?.id
  );


  const unreadCount = useNotificacionesStore(
    (s) => s.unreadCount
  );


  // ============================================================
  // WEBSOCKET GLOBAL DE EMPLEADOS
  // ============================================================

  useEffect(() => {

    if (!empleado?.id) {
      return;
    }

    const token =
      localStorage.getItem("token");


    const ws = new WebSocket(
      `${import.meta.env.VITE_WS_URL}/ws/empleados/${empleado.id}?token=${token}`
    );


    ws.onopen = () => {
      console.log(
        "WS Empleados conectado"
      );
    };


    ws.onclose = () => {
      console.log(
        "WS Empleados cerrado"
      );
    };


    ws.onmessage = (event) => {

      try {

        const data =
          JSON.parse(
            event.data
          );

        console.log(
          "WS Empleados mensaje:",
          data
        );

        /*
         * Aquí puedes actualizar
         * estado global si lo necesitas.
         */

      } catch (err) {

        console.warn(
          "WS Empleados error parseando mensaje:",
          err
        );

      }

    };


    return () => {

      try {

        ws.close();

      } catch {}

    };

  }, [empleado?.id]);


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div
      className="
        min-h-screen
        bg-[var(--erp-bg)]
        text-[var(--erp-text)]
      "
    >

      {/* ======================================================
          MODAL PERFIL
          ====================================================== */}

      {perfilModal && (

        <EmpleadoPerfilModal
          id={perfilModal}
          onClose={() =>
            setPerfilModal(null)
          }
        />

      )}


      {/* ======================================================
          NAVEGACIÓN SUPERIOR
          ====================================================== */}

      <Sidebar />


      {/* ======================================================
          CONTENIDO PRINCIPAL
          ====================================================== */}

      <main
        className="
          min-h-[calc(100vh-120px)]
          relative
        "
      >

        {/* ====================================================
            BARRA DE INFORMACIÓN
            ==================================================== */}

        <header
          className="
            bg-[var(--erp-surface)]
            border-b
            border-[var(--erp-border)]
          "
        >

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

            <div>

              <h1
                className="
                  text-lg
                  font-semibold
                  text-[var(--erp-text)]
                "
              >
                Panel de control
              </h1>

              <p
                className="
                  text-sm
                  text-[var(--erp-text-soft)]
                "
              >
                Gestión y administración del ERP
              </p>

            </div>


            {/* ==================================================
                NOTIFICACIONES
                ================================================== */}

            <button
              type="button"
              className="
                relative
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
              title="Notificaciones"
            >

              <span
                className="
                  text-lg
                  leading-none
                "
              >
                🔔
              </span>


              {unreadCount > 0 && (

                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    min-w-[18px]
                    h-[18px]
                    px-1
                    rounded-full
                    bg-red-500
                    text-white
                    text-[10px]
                    font-bold
                    flex
                    items-center
                    justify-center
                    border-2
                    border-white
                  "
                >
                  {unreadCount}
                </span>

              )}

            </button>

          </div>

        </header>


        {/* ======================================================
            POPUP REALTIME
            ====================================================== */}

        <NotificacionesToast />


        {/* ======================================================
            CONTENIDO DE LAS PÁGINAS
            ====================================================== */}

        <div
          className="
            w-full
            px-4
            lg:px-6
            py-6
          "
        >

          <div
            className="
              max-w-[1800px]
              mx-auto
            "
          >

            <Outlet />

          </div>

        </div>

      </main>

    </div>

  );
}
