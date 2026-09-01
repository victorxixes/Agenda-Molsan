import { useEffect } from "react";
import { useSeguridadStore } from "../../store/seguridadStore";
import { Link } from "react-router-dom";

export default function Roles() {
  const { roles, cargarRoles } = useSeguridadStore();

  useEffect(() => {
    cargarRoles();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Roles del sistema</h2>

      <Link
        to="/seguridad/roles/nuevo"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Crear rol
      </Link>

      <div className="mt-6 space-y-4">
        {roles.map((rol) => (
          <Link
            key={rol.id}
            to={`/seguridad/roles/${rol.id}`}
            className="block border p-4 rounded hover:bg-gray-50"
          >
            <h3 className="font-semibold">{rol.nombre}</h3>
            <p className="text-sm text-gray-600">{rol.descripcion}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
