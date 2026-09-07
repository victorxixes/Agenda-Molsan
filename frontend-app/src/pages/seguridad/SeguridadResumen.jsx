import { useEffect, useState } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadResumen({ empleadoId }) {
  const {
    ficha,
    cargarFicha,
    bloquear,
    desbloquear,
    resetPassword,
    asignarRol,
    permisos,
    logs,
    auditoria
  } = useSeguridad();

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [nuevoRol, setNuevoRol] = useState("");

  useEffect(() => {
    cargarFicha(empleadoId);
  }, [empleadoId]);

  if (!ficha) return <p className="p-6">Cargando resumen…</p>;

  const empleado = ficha.empleado;
  const modulosVisibles = empleado.modulos_visibles_list || [];
  const permisosEmpleado = ficha.permisos_modulo_dict || {};

  // Agrupar permisos globales por módulo
  const permisosGlobales = permisos.reduce((acc, p) => {
    if (!acc[p.modulo]) acc[p.modulo] = [];
    acc[p.modulo].push(p.permiso);
    return acc;
  }, {});

  const cambiarPermiso = (modulo, permiso) => {
    const nuevo = { ...permisosEmpleado };

    if (!nuevo[modulo]) nuevo[modulo] = [];

    if (nuevo[modulo].includes(permiso)) {
      nuevo[modulo] = nuevo[modulo].filter((p) => p !== permiso);
    } else {
      nuevo[modulo] = [...nuevo[modulo], permiso];
    }

    asignarPermisos(empleado.id, nuevo);
  };

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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">
        Resumen de seguridad — {empleado.nombre} ({empleado.usuario})
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
            <div>
              <strong>Activo:</strong>{" "}
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
        <h2 className="text-xl font-semibold mb-3">Acciones rápidas</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              onClick={() => {
                resetPassword(empleado.id, nuevaPassword);
                setNuevaPassword("");
              }}
            >
              Resetear contraseña
            </button>
          </div>

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
              onClick={() => {
                asignarRol(empleado.id, Number(nuevoRol));
                setNuevoRol("");
              }}
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
          {Object.keys(permisosGlobales).map((modulo) => (
            <li key={modulo} className="flex items-center justify-between">
              <span className="font-medium">{modulo}</span>

              <input
                type="checkbox"
                checked={modulosVisibles.includes(modulo)}
                onChange={() => cambiarModulo(modulo)}
                className="h-4 w-4"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* PERMISOS POR MÓDULO */}
      <div className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Permisos por módulo</h2>

        <ul className="space-y-4">
          {Object.entries(permisosGlobales).map(([modulo, permsDisponibles]) => (
            <li key={modulo} className="border-b pb-3">
              <strong className="text-lg">{modulo}</strong>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {permsDisponibles.map((perm) => (
                  <label
                    key={perm}
                    className="flex items-center gap-2 text-sm border px-2 py-1 rounded bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={permisosEmpleado[modulo]?.includes(perm) || false}
                      onChange={() => cambiarPermiso(modulo, perm)}
                    />
                    {perm}
                  </label>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* AUDITORÍA RECIENTE */}
      <div className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Auditoría reciente</h2>

        <ul className="space-y-2 text-sm">
          {auditoria.slice(0, 10).map((a) => (
            <li key={a.id} className="border-b pb-1">
              <strong>{a.fecha}</strong> — {a.accion} ({a.modulo})
            </li>
          ))}
        </ul>
      </div>

      {/* LOGS RECIENTES */}
      <div className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Logs recientes</h2>

        <ul className="space-y-2 text-sm">
          {logs.slice(0, 10).map((l) => (
            <li key={l.id} className="border-b pb-1">
              <strong>{l.fecha}</strong> — {l.tipo}: {l.mensaje}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
