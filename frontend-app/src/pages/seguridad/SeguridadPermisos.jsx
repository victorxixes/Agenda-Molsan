import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadPermisos() {
  const { ficha, asignarPermisos } = useSeguridad();

  if (!ficha) return null;

  const empleado = ficha.empleado;
  const permisosModulo = ficha.permisos_modulo_dict || {};

  const cambiarPermiso = (modulo, permiso) => {
    // Clonar estructura actual
    const nuevo = { ...permisosModulo };

    // Alternar permiso
    if (!nuevo[modulo]) nuevo[modulo] = [];

    if (nuevo[modulo].includes(permiso)) {
      nuevo[modulo] = nuevo[modulo].filter((p) => p !== permiso);
    } else {
      nuevo[modulo] = [...nuevo[modulo], permiso];
    }

    // Guardar en backend
    asignarPermisos(empleado.id, nuevo);
  };

  return (
    <div className="border p-4 rounded bg-white shadow">
      <h2 className="text-xl font-semibold mb-3">Permisos por módulo (editable)</h2>

      <ul className="space-y-4">
        {Object.entries(permisosModulo).map(([modulo, perms]) => (
          <li key={modulo} className="border-b pb-3">
            <strong className="text-lg">{modulo}</strong>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {["ver", "crear", "editar", "eliminar"].map((perm) => (
                <label
                  key={perm}
                  className="flex items-center gap-2 text-sm border px-2 py-1 rounded bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={perms.includes(perm)}
                    onChange={() => cambiarPermiso(modulo, perm)}
                  />
                  {perm}
                </label>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
