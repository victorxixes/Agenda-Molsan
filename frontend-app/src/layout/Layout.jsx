import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* SIDEBAR UNIFICADO */}
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
