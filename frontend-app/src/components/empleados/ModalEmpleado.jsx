import { useEffect, useState } from "react";
import EmpleadoFicha from "../../pages/empleados/EmpleadoFicha";
import EmpleadoEditar from "../../pages/empleados/EmpleadoEditar";

export default function ModalEmpleado({ open, onClose, empleadoId }) {
  if (!open || !empleadoId) return null;

  const [tab, setTab] = useState("ficha");

  // Cerrar con ESC
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const Tab = ({ id, label }) => (
    <button
      onClick={() => setTab(id)}
      className={`px-4 py-2 border-b-2 ${
        tab === id ? "border-blue-600 text-blue-600" : "border-transparent"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-xl w-[900px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Empleado #{empleadoId}</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-4 px-4 border-b">
          <Tab id="ficha" label="Ficha" />
          <Tab id="editar" label="Editar" />
          <Tab id="permisos" label="Permisos" />
          <Tab id="roles" label="Roles" />
          <Tab id="foto" label="Foto" />
          <Tab id="auditoria" label="Auditoría" />
        </div>

        {/* CONTENT */}
        <div className="p-4">
          {tab === "ficha" && <EmpleadoFicha empleadoId={empleadoId} />}

          {tab === "editar" && (
            <EmpleadoEditar
              empleadoId={empleadoId}
              onGuardado={() => {}}
            />
          )}

          {tab === "permisos" && (
            <p className="text-gray-500">Aquí irán los permisos…</p>
          )}

          {tab === "roles" && (
            <p className="text-gray-500">Aquí irán los roles…</p>
          )}

          {tab === "foto" && (
            <p className="text-gray-500">Aquí irá la foto…</p>
          )}

          {tab === "auditoria" && (
            <p className="text-gray-500">Aquí irá la auditoría…</p>
          )}
        </div>
      </div>

      {/* CERRAR AL HACER CLICK FUERA */}
      <div className="absolute inset-0" onClick={onClose}></div>
    </div>
  );
}
