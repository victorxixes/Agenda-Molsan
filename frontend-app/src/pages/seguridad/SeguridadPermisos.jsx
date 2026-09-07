import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadPermisos() {
  const { permisos = [] } = useSeguridad();

  // Agrupar permisos por módulo
  const agrupados = permisos.reduce((acc, p) => {
    if (!acc[p.modulo]) acc[p.modulo] = [];
    acc[p.modulo].push(p.permiso);
    return acc;
  }, {});

  return (
    <div className="border p-4 rounded bg-white shadow">
      <h2 className="text-xl font-semibold mb-3">Permisos globales por módulo</h2>

      <ul className="space-y-4">
        {Object.entries(agrupados).map(([modulo, perms]) => (
          <li key={modulo} className="border-b pb-3">
            <strong className="text-lg">{modulo}</strong>

            <div className="flex flex-wrap gap-2 mt-2">
              {perms.map((perm) => (
                <span
                  key={perm}
                  className="px-2 py-1 bg-gray-100 rounded text-sm border"
                >
                  {perm}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
