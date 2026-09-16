import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSeguridad } from "../../hooks/useSeguridad";

/**
 * SeguridadUsuarios — SJ‑2026 Premium
 * - Gestión de usuarios
 * - Bloqueo / desbloqueo
 * - Reset password
 * - Asignación de rol
 * - Glass‑UI
 */

export default function SeguridadUsuarios() {
  const {
    empleados = [],
    roles = [],
    cargarTodo,
    bloquear,
    desbloquear,
    resetPassword,
    asignarRol,
  } = useSeguridad();

  const [passwordNueva, setPasswordNueva] = useState("");
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [rolNuevo, setRolNuevo] = useState("");

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const onResetPassword = useCallback(
    async (id) => {
      if (!passwordNueva) return;
      await resetPassword(id, passwordNueva);
      setPasswordNueva("");
    },
    [passwordNueva, resetPassword]
  );

  const onBloquear = useCallback(async (id) => bloquear(id), [bloquear]);
  const onDesbloquear = useCallback(async (id) => desbloquear(id), [desbloquear]);

  const onAsignarRol = useCallback(
    async (id) => {
      if (!rolNuevo) return;
      await asignarRol(id, Number(rolNuevo));
      setRolNuevo("");
    },
    [rolNuevo, asignarRol]
  );

  const empleadosMemo = useMemo(() => empleados || [], [empleados]);

  return (
    <div className="p-6 space-y-6 text-white animate-fade-in">

      <h1 className="text-3xl font-bold drop-shadow mb-4">
        Usuarios y seguridad — SJ‑2026
      </h1>

      {/* TABLA PREMIUM */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-xl overflow-hidden
        "
      >
        <table className="w-full text-sm text-white">
          <thead>
            <tr className="bg-white/10 border-b border-white/20 text-white/70">
              <th className="p-3">ID</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Usuario</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {empleadosMemo.map((e) => (
              <tr
                key={e.id}
                className="
                  border-b border-white/10 hover:bg-white/10 transition
                "
              >
                <td className="p-3">{e.id}</td>
                <td className="p-3">{e.nombre}</td>
                <td className="p-3">{e.usuario || "—"}</td>

                <td className="p-3">
                  {e.activo ? (
                    <span className="px-3 py-1 bg-green-500/20 text-green-200 border border-green-400 rounded-xl text-xs">
                      Activo
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-500/20 text-red-200 border border-red-400 rounded-xl text-xs">
                      Bloqueado
                    </span>
                  )}
                </td>

                <td className="p-3">{e.rol?.nombre || "—"}</td>

                <td className="p-3 space-x-2">
                  <Link
                    to={`/seguridad/ficha/${e.id}`}
                    className="
                      px-2 py-1 text-xs bg-blue-600/20 text-blue-300 border border-blue-400
                      rounded transition hover:bg-blue-600/30 active:scale-[0.97]
                    "
                  >
                    Ficha
                  </Link>

                  <button
                    className="
                      px-2 py-1 text-xs bg-red-600/20 text-red-300 border border-red-400
                      rounded transition hover:bg-red-600/30 active:scale-[0.97]
                    "
                    onClick={() => onBloquear(e.id)}
                  >
                    Bloquear
                  </button>

                  <button
                    className="
                      px-2 py-1 text-xs bg-green-600/20 text-green-300 border border-green-400
                      rounded transition hover:bg-green-600/30 active:scale-[0.97]
                    "
                    onClick={() => onDesbloquear(e.id)}
                  >
                    Desbloquear
                  </button>

                  <button
                    className="
                      px-2 py-1 text-xs bg-purple-600/20 text-purple-300 border border-purple-400
                      rounded transition hover:bg-purple-600/30 active:scale-[0.97]
                    "
                    onClick={() => setEmpleadoSeleccionado(e)}
                  >
                    Seguridad
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PANEL SEGURIDAD PREMIUM */}
      {empleadoSeleccionado && (
        <div
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            p-6 shadow-xl animate-fade-in
          "
        >
          <h2 className="text-xl font-semibold mb-4 drop-shadow">
            Seguridad de {empleadoSeleccionado.nombre}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* RESET PASSWORD */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white/80">
                Nueva contraseña
              </label>
              <input
                type="password"
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white focus:ring-2 focus:ring-blue-400
                "
                value={passwordNueva}
                onChange={(e) => setPasswordNueva(e.target.value)}
              />
              <button
                className="
                  mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
                  text-white shadow-lg transition active:scale-[0.97]
                "
                onClick={() => onResetPassword(empleadoSeleccionado.id)}
              >
                Resetear contraseña
              </button>
            </div>

            {/* ASIGNAR ROL */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white/80">
                Nuevo rol
              </label>
              <select
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white focus:ring-2 focus:ring-purple-400
                "
                value={rolNuevo}
                onChange={(e) => setRolNuevo(e.target.value)}
              >
                <option value="">Seleccionar rol…</option>
                {(roles || []).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>

              <button
                className="
                  mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700
                  text-white shadow-lg transition active:scale-[0.97]
                "
                onClick={() => onAsignarRol(empleadoSeleccionado.id)}
              >
                Asignar rol
              </button>
            </div>
          </div>

          <button
            className="
              mt-6 text-sm text-white/70 underline hover:text-white
              transition active:scale-[0.97]
            "
            onClick={() => setEmpleadoSeleccionado(null)}
          >
            Cerrar panel
          </button>
        </div>
      )}
    </div>
  );
}
