import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadModulos() {
  const { permisos = [], ficha, asignarModulos } = useSeguridad();

  if (!ficha) return null;

  const empleado = ficha.empleado;
  const modulosVisibles = empleado.modulos_visibles_list || [];

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
    <div
      className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        shadow-xl p-6 space-y-4
      "
    >
      <h2 className="text-xl font-semibold text-white drop-shadow mb-2">
        Módulos visibles (dinámicos)
      </h2>

      <ul className="space-y-3 text-white">
        {modulosGlobales.map((modulo) => (
          <li
            key={modulo}
            className="
              flex items-center justify-between bg-white/5 border border-white/10
              rounded-xl px-4 py-2 hover:bg-white/10 transition
            "
          >
            <span className="font-medium">{modulo}</span>

            <input
              type="checkbox"
              checked={modulosVisibles.includes(modulo)}
              onChange={() => cambiarModulo(modulo)}
              className="h-5 w-5 accent-blue-500 cursor-pointer"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
