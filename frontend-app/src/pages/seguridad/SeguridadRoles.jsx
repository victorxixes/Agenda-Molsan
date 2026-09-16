import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadRoles() {
  const { roles = [] } = useSeguridad();

  return (
    <div
      className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        shadow-xl p-6 space-y-4
      "
    >
      <h2 className="text-xl font-semibold text-white drop-shadow mb-2">
        Roles del sistema
      </h2>

      <table className="w-full text-sm text-white">
        <thead className="bg-white/10 border-b border-white/20">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nombre</th>
          </tr>
        </thead>

        <tbody>
          {(roles || []).map((r) => (
            <tr
              key={r.id}
              className="border-b border-white/10 hover:bg-white/5 transition"
            >
              <td className="p-3">{r.id}</td>
              <td className="p-3">{r.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
