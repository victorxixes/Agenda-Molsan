import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import EmpleadoPerfilModal from "../components/SidebarPerfilModal";
import { useNotificacionesWS } from "../hooks/useNotificacionesWS";
import { useNotificacionesStore } from "../store/notificacionesStore";
import NotificacionesToast from "../components/notificaciones/NotificacionesToast";

/**
 * Layout — SJ‑2026 Premium
 * - WS global de empleados
 * - WS global de notificaciones
 * - Sidebar + Header premium
 * - Popup realtime
 */

export default function Layout() {
  const empleado = useAuthStore((s) => s.empleado);
  const perfilModal = useAuthStore((s) => s.perfilModal);
  const setPerfilModal = useAuthStore((s) => s.setPerfilModal);

  // 🔔 Notificaciones realtime
  useNotificacionesWS(empleado?.id);

  const unreadCount = useNotificacionesStore((s) => s.unreadCount);

  // 🔥 WebSocket global de empleados
  useEffect(() => {
    if (!empleado?.id) return;

    const token = localStorage.getItem("token");

    const ws = new WebSocket(
      `${import.meta.env.VITE_WS_URL}/ws/empleados/${empleado.id}?token=${token}`
    );

    ws.onopen = () => console.log("WS Empleados conectado");
    ws.onclose = () => console.log("WS Empleados cerrado");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WS Empleados mensaje:", data);

        // Aquí puedes actualizar estado global si lo necesitas
        // useAuthStore.getState().updateConectados(data);
      } catch (err) {
        console.warn("WS Empleados error parseando mensaje:", err);
      }
    };

    return () => {
      try {
        ws.close();
      } catch {}
    };
  }, [empleado?.id]);

  return (
    <div
      className="
        flex min-h-screen 
        bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700
        text-gray-100
      "
    >
      {/* MODAL PERFIL */}
      {perfilModal && (
        <EmpleadoPerfilModal
          id={perfilModal}
          onClose={() => setPerfilModal(null)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main className="flex-1 backdrop-blur-xl bg-white/10 relative">
        {/* HEADER */}
        <header
          className="
            bg-white/20 backdrop-blur-xl 
            border-b border-white/20 
            p-4 shadow-lg flex items-center justify-between
          "
        >
          <h1 className="text-xl font-semibold text-white drop-shadow">
            Panel de control
          </h1>

          <button className="relative cursor-pointer">
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </header>

        {/* POPUP REALTIME (siempre visible) */}
        <NotificacionesToast />

        {/* CONTENIDO */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
