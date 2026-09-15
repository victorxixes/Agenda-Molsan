import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import EmpleadoFichaModal from "../components/EmpleadoPerfilModal";

export default function Layout() {
  const perfilModalId = useAuthStore((s) => s.perfilModalId);
  const setPerfilModal = useAuthStore((s) => s.setPerfilModal);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ⭐ MODAL PERFIL */}
      {perfilModalId && (
        <EmpleadoFichaModal
          id={perfilModalId}
          onClose={() => setPerfilModal(null)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main className="flex-1">
        <header className="bg-white border-b p-4 shadow-sm">
          <h1 className="text-lg font-semibold">Panel de control</h1>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
