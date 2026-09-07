import { useEffect, useState } from "react";

export default function ModalEmpleado({ open, onClose, empleado }) {
  if (!open || !empleado) return null;

  const [tab, setTab] = useState("ficha");

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
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">
            {empleado.nombre} {empleado.apellidos} — #{empleado.id}
          </h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>

        <div className="flex gap-4 px-4 border-b">
          <Tab id="ficha" label="Ficha" />
          <Tab id="laboral" label="Laboral" />
          <Tab id="permisos" label="Permisos" />
          <Tab id="roles" label="Roles" />
          <Tab id="foto" label="Foto" />
          <Tab id="auditoria" label="Auditoría" />
        </div>

        <div className="p-4">
          {tab === "ficha" && (
            <div className="space-y-2">
              <p><strong>Nombre:</strong> {empleado.nombre}</p>
              <p><strong>Apellidos:</strong> {empleado.apellidos}</p>
              <p><strong>Usuario:</strong> {empleado.usuario}</p>
              <p><strong>Email empresa:</strong> {empleado.email_empresa}</p>
              <p><strong>Teléfono:</strong> {empleado.telefono}</p>
            </div>
          )}

          {tab === "laboral" && (
            <div className="space-y-2">
              <p><strong>Cargo:</strong> {empleado.cargo}</p>
              <p><strong>Departamento:</strong> {empleado.departamento}</p>
              <p><strong>Fecha alta:</strong> {empleado.fecha_alta}</p>
            </div>
          )}

          {tab === "permisos" && (
            <ul className="list-disc ml-6">
              {empleado.permisos?.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}

          {tab === "roles" && (
            <ul className="list-disc ml-6">
              {empleado.roles?.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}

          {tab === "foto" && (
            <div className="flex flex-col items-center">
              <img
                src={`${import.meta.env.VITE_API_BASE}/empleados/${empleado.id}/foto`}
                className="w-40 h-40 rounded-full object-cover border"
              />
            </div>
          )}

          {tab === "auditoria" && (
            <p className="text-gray-500">Aquí puedes cargar auditoría…</p>
          )}
        </div>
      </div>

      <div className="absolute inset-0" onClick={onClose}></div>
    </div>
  );
}
