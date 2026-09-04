import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadRoles() {
  const { roles } = useSeguridad();

  return (
    <div className="border p-4 rounded bg-white shadow">
      <h2 className="text-xl font-semibold mb-2">Roles</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r.id} className="border-b">
              <td>{r.id}</td>
              <td>{r.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
