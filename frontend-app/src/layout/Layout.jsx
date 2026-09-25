import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import EmpleadoPerfilModal from "../components/SidebarPerfilModal";

/**
 * Layout — SJ‑2026 Premium
 * Estructura principal del ERP:
 * - Sidebar glass‑UI
 * - Header premium
 * - Modal de perfil
 * - Fondo degradado profesional
 */

export default function Layout() {
  const empleado = useAuthStore((s) => s.empleado);
  const perfilModal = useAuthStore((s) => s.perfilModal);
  const setPerfilModal = useAuthStore((s) => s.setPerfilModal);

  // 🔥 WebSocket de empleados — conexión global y persistente
  useEffect(() => {
    if (!empleado || !empleado.id) return;

    const token = localStorage.getItem("token");

   const ws = new WebSocket(
  `${import.meta.env.VITE_WS_URL}/ws/empleados/${empleado.id}?token=${token}`
);

    ws.onopen = () => console.log("WS Empleados conectado");
    ws.onclose = () => console.log("WS Empleados cerrado");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WS Empleados mensaje:", data);

      // Si quieres actualizar conectados:
      // useAuthStore.getState().updateConectados(data);
    };

    return () => {
      ws.close();
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
      <main className="flex-1 backdrop-blur-xl bg-white/10">
        <header
          className="
            bg-white/20 backdrop-blur-xl 
            border-b border-white/20 
            p-4 shadow-lg
          "
        >
          <h1 className="text-xl font-semibold text-white drop-shadow">
            Panel de control
          </h1>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
