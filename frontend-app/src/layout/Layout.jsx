import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import EmpleadoPerfilModal from "../components/EmpleadoPerfilModal";

/**
 * Layout — SJ‑2026 Premium
 * Estructura principal del ERP:
 * - Sidebar glass‑UI
 * - Header premium
 * - Modal de perfil
 * - Fondo degradado profesional
 */

export default function Layout() {
  const perfilModalId = useAuthStore((s) => s.perfilModalId);
  const setPerfilModal = useAuthStore((s) => s.setPerfilModal);

  return (
    <div
      className="
        flex min-h-screen 
        bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700
        text-gray-100
      "
    >
      {/* MODAL PERFIL */}
      {perfilModalId && (
        <EmpleadoPerfilModal
          id={perfilModalId}
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
