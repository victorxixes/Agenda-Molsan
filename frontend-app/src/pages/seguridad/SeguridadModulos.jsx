import { useCallback, useMemo } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadModulos() {
  const { permisos = [], ficha, asignarModulos } = useSeguridad();

  if (!ficha || typeof ficha !== "object") return null;

  const empleado = ficha.empleado || {};
  const modulosVisiblesRaw = empleado.modulos_visibles_list || [];

  // Blindar lista de módulos visibles
  const modulosVisibles = useMemo(() => {
    return Array.isArray(modulosVisiblesRaw)
      ? modulosVisiblesRaw.filter((m) => typeof m === "string")
      : [];
  }, [modulosVisiblesRaw]);

  // Blindar permisos → solo módulos válidos (strings)
  const modulosGlobales = useMemo(() => {
    if (!Array.isArray(permisos)) return [];

    const lista = permisos
      .filter(
        (p) =>
          p &&
          typeof p === "object" &&
          typeof p.modulo === "string"
      )
      .map((p) => p.modulo);

    return [...new Set(lista)];
  }, [permisos]);

  const cambiarModulo = useCallback(
    (modulo) => {
      if (typeof modulo !== "string") return;

      let nuevo;

      if (modulosVisibles.includes(modulo)) {
        nuevo = modulosVisibles.filter((m) => m !== modulo);
      } else {
        nuevo = [...modulosVisibles, modulo];
      }

      asignarModulos(empleado.id, nuevo);
    },
    [modulosVisibles, asignarModulos, empleado?.id]
  );

  return (
    <div
      className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        shadow-xl p-6 space-y-4 text-white animate-fade-in
      "
    >
      <h2 className="text-xl font-semibold drop-shadow mb-2">
        Módulos visibles (dinámicos)
      </h2>

      <ul className="space-y-3">
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
              className="
                h-5 w-5 accent-blue-500 cursor-pointer transition active:scale-[0.97]
              "
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
