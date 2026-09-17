import { useMemo, useCallback } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadPermisos() {
  const { permisos = [], ficha, asignarPermisos } = useSeguridad();

  if (!ficha || typeof ficha !== "object") return null;

  const empleado = ficha.empleado;
  const permisosEmpleado = ficha.permisos_modulo_dict || {};

  // Agrupar permisos globales por módulo (blindado)
  const permisosGlobales = useMemo(() => {
    if (!Array.isArray(permisos)) return {};

    return permisos.reduce((acc, p) => {
      // Validación estricta
      if (
        !p ||
        typeof p !== "object" ||
        typeof p.modulo !== "string" ||
        typeof p.permiso !== "string"
      ) {
        return acc; // ignorar elementos corruptos
      }

      if (!acc[p.modulo]) acc[p.modulo] = [];
      acc[p.modulo].push(p.permiso);

      return acc;
    }, {});
  }, [permisos]);

  const cambiarPermiso = useCallback(
    (modulo, permiso) => {
      if (typeof modulo !== "string" || typeof permiso !== "string") return;

      const nuevo = { ...permisosEmpleado };

      if (!Array.isArray(nuevo[modulo])) nuevo[modulo] = [];

      if (nuevo[modulo].includes(permiso)) {
        nuevo[modulo] = nuevo[modulo].filter((p) => p !== permiso);
      } else {
        nuevo[modulo] = [...nuevo[modulo], permiso];
      }

      asignarPermisos(empleado.id, nuevo);
    },
    [permisosEmpleado, asignarPermisos, empleado?.id]
  );

  return (
    <div
      className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        shadow-xl p-6 space-y-6 text-white animate-fade-in
      "
    >
      <h2 className="text-xl font-semibold drop-shadow mb-2">
        Permisos por módulo (dinámicos)
      </h2>

      <ul className="space-y-6">
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
                    className="
                      accent-purple-500 h-4 w-4 cursor-pointer transition
                      active:scale-[0.97]
                    "
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
