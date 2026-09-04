import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadModulos() {
  const { modulos, guardarModulos } = useSeguridad();

  const cambiar = (mod) => {
    const nuevo = modulos.map((m) =>
      m.nombre === mod.nombre ? { ...m, visible: !m.visible } : m
    );
    guardarModulos(nuevo);
  };

  return (
    <div className="border p-4 rounded bg-white shadow">
      <h2 className="text-xl font-semibold mb-2">Módulos visibles</h2>

      <ul className="space-y-2">
        {modulos.map((m) => (
          <li key={m.nombre} className="flex items-center justify-between">
            <span>{m.nombre}</span>
            <input
              type="checkbox"
              checked={m.visible}
              onChange={() => cambiar(m)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
