import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadFicha() {
  const { id } = useParams();
  const {
    ficha,
    cargarFicha,
    bloquear,
    desbloquear,
    resetPassword,
    asignarRol,
    asignarPermisos,
    asignarModulos
  } = useSeguridad();

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [nuevoRol, setNuevoRol] = useState("");

  useEffect(() => {
    cargarFicha(id);
  }, [id]);

  if (!ficha) return <p className="p-6">Cargando ficha…</p>;

  const empleado = ficha.empleado;

  const onResetPassword = async () => {
    if (!nuevaPassword) return;
    await resetPassword(empleado.id, nuevaPassword);
    setNuevaPassword("");
  };

  const onAsignarRol = async () => {
    if (!nuevoRol) return;
    await asignarRol(empleado.id, Number(nuevoRol));
    setNuevoRol("");
    cargarFicha(empleado.id);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">
        Ficha de {empleado.nombre} ({empleado.usuario})
      </h1>

      {/* DATOS BÁSICOS */}
      <div className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Datos básicos</h2>

        <div className="flex gap-6">
          <img
            src={empleado.foto}
            alt="Foto empleado"
            className="w-32 h-32 rounded border object-cover"
          />

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><strong>ID:</strong> {empleado.id}</div>
            <div><strong>Usuario:</strong> {empleado.usuario}</div>
            <div><strong>Nombre:</strong> {empleado.nombre}</div>
            <div><strong>Apellidos:</strong> {empleado.apellidos || "-"}</div>
            <div><strong>DNI:</strong> {empleado.dni || "-"}</div>
            <div><strong>Email:</strong> {empleado.email_empresa || "-"}</div>
            <div><strong>Activo:</strong>{" "}
              {empleado.activo ? (
                <span className="text-green-600 font-semibold">Sí</span>
              ) : (
                <span className="text-red-600 font-semibold">No</span>
              )}
            </div>
            <div><strong>Rol:</strong> {empleado.rol_nombre || "-"}</div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          {empleado.activo ? (
            <button
              className="px-3 py-1 bg-red-600 text-white rounded text-sm"
              onClick={() => bloquear(empleado.id)}
            >
              Bloquear usuario
            </button>
          ) : (
            <button
              className="px-3 py-1 bg-green-600 text-white rounded text-sm"
              onClick={() => desbloquear(empleado.id)}
            >
              Desbloquear usuario
            </button>
          )}
        </div>
      </div>

      {/* CONTRASEÑA Y ROL */}
      <div className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Seguridad</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reset password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              className="border rounded px-2 py-1 w-full"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
            />
            <button
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
              onClick={onResetPassword}
            >
              Resetear contraseña
            </button>
          </div>

          {/* Asignar rol */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nuevo rol (ID)
            </label>
            <input
              type="number"
              className="border rounded px-2 py-1 w-full"
              value={nuevoRol}
              onChange={(e) => setNuevoRol(e.target.value)}
            />
            <button
              className="mt-2 px-3 py-1 bg-purple-600 text-white rounded text-sm"
              onClick={onAsignarRol}
            >
              Asignar rol
            </button>
          </div>
        </div>
      </div>

      {/* MÓDULOS VISIBLES */}
      <div className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Módulos visibles</h2>

        <ul className="space-y-2">
          {empleado.modulos_visibles_list.map((m) => (
            <li key={m} className="flex items-center justify-between">
              <span className="font-medium">{m}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* PERMISOS POR MÓDULO */}
      <div className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Permisos por módulo</h2>

        <ul className="space-y-2">
          {Object.entries(empleado.permisos_modulo_dict).map(([modulo, perms]) => (
            <li key={modulo} className="border-b pb-2">
              <strong>{modulo}</strong>
              <div className="flex gap-2 mt-1">
                {perms.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-1 bg-gray-100 rounded text-sm border"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
