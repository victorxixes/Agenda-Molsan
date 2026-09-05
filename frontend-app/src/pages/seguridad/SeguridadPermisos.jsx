import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadPermisos() {
  const { permisos, guardarPermisos } = useSeguridad();

  const cambiar = (key) => {
    const nuevo = { ...permisos, [key]: !permisos[key] };
    guardarPermisos(nuevo);
  };

  return (
    <div className="border p-4 rounded bg-white shadow">
      <h2 className="text-xl font-semibold mb-3">Permisos globales</h2>

      <ul className="space-y-2">
        {Object.keys(permisos).map((key) => (
          <li key={key} className="flex items-center justify-between">
            <span className="font-medium">{key}</span>
            <input
              type="checkbox"
              checked={permisos[key]}
              onChange={() => cambiar(key)}
              className="h-4 w-4"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
