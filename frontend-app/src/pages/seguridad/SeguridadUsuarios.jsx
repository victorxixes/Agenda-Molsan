import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadUsuarios() {
  const {
    empleados,
    roles,
    cargarTodo,
    bloquear,
    desbloquear,
    resetPassword,
    asignarRol
  } = useSeguridad();

  const [passwordNueva, setPasswordNueva] = useState("");
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [rolNuevo, setRolNuevo] = useState("");

  useEffect(() => {
    cargarTodo();
  }, []);

  const onResetPassword = async (id) => {
    if (!passwordNueva) return;
    await resetPassword(id, passwordNueva);
    setPasswordNueva("");
  };

  const onBloquear = async (id) => {
    await bloquear(id);
  };

  const onDesbloquear = async (id) => {
    await desbloquear(id);
  };

  const onAsignarRol = async (id) => {
    if (!rolNuevo) return;
    await asignarRol(id, Number(rolNuevo));
    setRolNuevo("");
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Usuarios y seguridad</h1>

      <table className="w-full border rounded bg-white">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Usuario</th>
            <th className="p-2">Activo</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((e) => (
            <tr key={e.id} className="border-b">
              <td className="p-2">{e.id}</td>
              <td className="p-2">{e.nombre}</td>
              <td className="p-2">{e.usuario}</td>
              <td className="p-2">
                {e.activo ? (
                  <span className="text-green-600 font-semibold">Activo</span>
                ) : (
                  <span className="text-red-600 font-semibold">Bloqueado</span>
                )}
              </td>
              <td className="p-2">{e.rol_id}</td>
              <td className="p-2 space-x-2">
                <Link
                  to={`/seguridad/ficha/${e.id}`}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                >
                  Ficha
                </Link>

                <button
                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
                  onClick={() => onBloquear(e.id)}
                >
                  Bloquear
                </button>

                <button
                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
                  onClick={() => onDesbloquear(e.id)}
                >
                  Desbloquear
                </button>

                <button
                  className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded"
                  onClick={() => setEmpleadoSeleccionado(e)}
                >
                  Seguridad
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {empleadoSeleccionado && (
        <div className="mt-4 border rounded bg-white p-4">
          <h2 className="text-lg font-semibold mb-2">
            Seguridad de {empleadoSeleccionado.nombre}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nueva contraseña
              </label>
              <input
                type="password"
                className="border rounded px-2 py-1 w-full"
                value={passwordNueva}
                onChange={(e) => setPasswordNueva(e.target.value)}
              />
              <button
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
                onClick={() => onResetPassword(empleadoSeleccionado.id)}
              >
                Resetear contraseña
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nuevo rol
              </label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={rolNuevo}
                onChange={(e) => setRolNuevo(e.target.value)}
              >
                <option value="">Seleccionar rol…</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>

              <button
                className="mt-2 px-3 py-1 bg-purple-600 text-white rounded text-sm"
                onClick={() => onAsignarRol(empleadoSeleccionado.id)}
              >
                Asignar rol
              </button>
            </div>
          </div>

          <button
            className="mt-4 text-sm text-gray-500 underline"
            onClick={() => setEmpleadoSeleccionado(null)}
          >
            Cerrar panel
          </button>
        </div>
      )}
    </div>
  );
}
