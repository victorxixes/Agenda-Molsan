import { useSeguridadStore } from "../../store/seguridadStore";
import { useEffect } from "react";

export default function RolesList() {
  const { roles, cargarRoles } = useSeguridadStore();

  useEffect(() => {
    cargarRoles();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Roles del sistema</h2>

      {roles.length === 0 && (
        <p className="text-neutral-600">No hay roles registrados.</p>
      )}

      <div className="space-y-2">
        {roles.map((rol) => (
          <div
            key={rol.id}
            className="p-3 border rounded-lg bg-white shadow-sm"
          >
            <h3 className="font-semibold">{rol.nombre}</h3>
            <p className="text-sm text-neutral-600">
              {rol.descripcion || "Sin descripción"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
