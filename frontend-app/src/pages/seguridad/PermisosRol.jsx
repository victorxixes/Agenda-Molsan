import { useEffect } from "react";
import { useSeguridadStore } from "../../store/seguridadStore";

export default function PermisosRol({ rolId }) {
  const {
    permisosBase,
    permisosRol,
    cargarPermisosBase,
    cargarPermisosRol,
  } = useSeguridadStore();

  useEffect(() => {
    cargarPermisosBase();
    cargarPermisosRol(rolId);
  }, [rolId]);

  if (!permisosRol) return <div className="p-6">Cargando permisos...</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Permisos del rol</h2>

      {Object.entries(permisosRol).map(([modulo, acciones]) => (
        <div key={modulo} className="border p-3 rounded">
          <h3 className="font-semibold">{modulo}</h3>
          <p className="text-sm text-neutral-600">
            {acciones.join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}
