import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r shadow-sm p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">ERP Molsan 2026</h2>

        <nav className="space-y-2">
          <Link className="block p-2 rounded hover:bg-gray-100" to="/panel/empleados">
            Empleados
          </Link>
          <Link className="block p-2 rounded hover:bg-gray-100" to="/ctn">
            CTN
          </Link>
          <Link className="block p-2 rounded hover:bg-gray-100" to="/herramientas">
            Herramientas
          </Link>
          <Link className="block p-2 rounded hover:bg-gray-100" to="/logs">
            Logs
          </Link>

          <div className="pt-4 border-t">
            <Link className="block p-2 rounded hover:bg-gray-100" to="/seguridad">
              Seguridad
            </Link>
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        {/* TOPBAR */}
        <header className="bg-white border-b p-4 shadow-sm">
          <h1 className="text-lg font-semibold">Panel de control</h1>
        </header>

        {/* CONTENT */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
