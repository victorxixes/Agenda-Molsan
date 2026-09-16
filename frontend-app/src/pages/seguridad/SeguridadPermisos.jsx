import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadPermisos() {
  const { permisos = [], ficha, asignarPermisos } = useSeguridad();

  if (!ficha) return null;

  const empleado = ficha.empleado;
  const permisosEmpleado = ficha.permisos_modulo_dict || {};

  // Agrupar permisos globales por módulo
  const permisosGlobales = permisos.reduce((acc, p) => {
    if (!acc[p.modulo]) acc[p.modulo] = [];
    acc[p.modulo].push(p.permiso);
    return acc;
  }, {});

  const cambiarPermiso = (modulo, permiso) => {
    const nuevo = { ...permisosEmpleado };

    if (!nuevo[modulo]) nuevo[modulo] = [];

    if (nuevo[modulo].includes(permiso)) {
      nuevo[modulo] = nuevo[modulo].filter((p) => p !== permiso);
    } else {
      nuevo[modulo] = [...nuevo[modulo], permiso];
    }

    asignarPermisos(empleado.id, nuevo);
  };

  return (
    <div
      className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        shadow-xl p-6 space-y-6
      "
    >
      <h2 className="text-xl font-semibold text-white drop-shadow mb-2">
        Permisos por módulo (dinámicos)
      </h2>

      <ul className="space-y-6 text-white">
        {Object.entries(permisosGlobales).map(([modulo, permsDisponibles]) => (
          <li key={modulo}>
            <strong className="text-lg">{modulo}</strong>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              {permsDisponibles.map((perm) => (
                <label
                  key={perm}
                  className="
                    flex items-center gap-2 text-sm bg-white/10 border border-white/20
                    rounded-xl px-3 py-2 hover:bg-white/20 transition
                  "
                >
                  <input
                    type="checkbox"
                    checked={permisosEmpleado[modulo]?.includes(perm) || false}
                    onChange={() => cambiarPermiso(modulo, perm)}
                    className="accent-purple-500 h-4 w-4 cursor-pointer"
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
