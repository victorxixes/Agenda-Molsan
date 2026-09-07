import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadModulos() {
  const { permisos = [], ficha, asignarModulos } = useSeguridad();

  if (!ficha) return null;

  const empleado = ficha.empleado;
  const modulosVisibles = empleado.modulos_visibles_list || [];

  // Obtener lista de módulos globales desde permisos
  const modulosGlobales = [...new Set(permisos.map((p) => p.modulo))];

  const cambiarModulo = (modulo) => {
    let nuevo;

    if (modulosVisibles.includes(modulo)) {
      nuevo = modulosVisibles.filter((m) => m !== modulo);
    } else {
      nuevo = [...modulosVisibles, modulo];
    }

    asignarModulos(empleado.id, nuevo);
  };

  return (
    <div className="border p-4 rounded bg-white shadow">
      <h2 className="text-xl font-semibold mb-3">Módulos visibles (dinámicos)</h2>

      <ul className="space-y-2">
        {modulosGlobales.map((modulo) => (
          <li key={modulo} className="flex items-center justify-between">
            <span className="font-medium">{modulo}</span>

            <input
              type="checkbox"
              checked={modulosVisibles.includes(modulo)}
              onChange={() => cambiarModulo(modulo)}
              className="h-4 w-4"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
