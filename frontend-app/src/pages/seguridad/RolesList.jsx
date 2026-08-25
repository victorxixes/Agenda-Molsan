import { useEffect } from "react";
import { useSeguridadStore } from "../../store/seguridadStore";

export default function RolesList() {
  const { roles, cargarRoles } = useSeguridadStore();

  useEffect(() => {
    cargarRoles();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Roles</h2>

      {roles.map((r) => (
        <div key={r.id} className="border p-3 rounded">
          {r.nombre}
        </div>
      ))}
    </div>
  );
}
