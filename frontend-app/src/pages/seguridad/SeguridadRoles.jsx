import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadRoles() {
  const { roles } = useSeguridad();

  return (
    <div className="border p-4 rounded bg-white shadow">
      <h2 className="text-xl font-semibold mb-3">Roles del sistema</h2>

      <table className="w-full border rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="p-2">{r.id}</td>
              <td className="p-2">{r.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
