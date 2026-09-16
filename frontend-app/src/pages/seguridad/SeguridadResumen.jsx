import { useEffect, useState, useCallback, useMemo } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

/**
 * SeguridadResumen — SJ‑2026 Premium
 * - Resumen completo de seguridad del empleado
 * - Acciones rápidas
 * - Módulos visibles
 * - Permisos por módulo
 * - Auditoría reciente
 * - Logs recientes
 * - Glass‑UI
 */

export default function SeguridadResumen({ empleadoId }) {
  const {
    ficha,
    cargarFicha,
    bloquear,
    desbloquear,
    resetPassword,
    asignarRol,
    asignarPermisos,
    asignarModulos,
    permisos,
    logs,
    auditoria,
  } = useSeguridad();

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [nuevoRol, setNuevoRol] = useState("");

  // Cargar ficha
  useEffect(() => {
    cargarFicha(empleadoId);
  }, [empleadoId, cargarFicha]);

  if (!ficha)
    return (
      <div className="p-6 text-white/70 animate-pulse">
        Cargando resumen…
      </div>
    );

  const empleado = ficha.empleado;
  const modulosVisibles = ficha.empleado.modulos_visibles_list || [];
  const permisosEmpleado = ficha.permisos_modulo_dict || {};

  // Agrupar permisos globales por módulo (optimizado)
  const permisosGlobales = useMemo(() => {
    return permisos.reduce((acc, p) => {
      if (!acc[p.modulo]) acc[p.modulo] = [];
      acc[p.modulo].push(p.permiso);
      return acc;
    }, {});
  }, [permisos]);

  // Cambiar permiso
  const cambiarPermiso = useCallback(
    (modulo, permiso) => {
      const nuevo = { ...permisosEmpleado };

      if (!nuevo[modulo]) nuevo[modulo] = [];

      if (nuevo[modulo].includes(permiso)) {
        nuevo[modulo] = nuevo[modulo].filter((p) => p !== permiso);
      } else {
        nuevo[modulo] = [...nuevo[modulo], permiso];
      }

      asignarPermisos(empleado.id, nuevo);
    },
    [permisosEmpleado, asignarPermisos, empleado.id]
  );

  // Cambiar módulo visible
  const cambiarModulo = useCallback(
    (modulo) => {
      let nuevo;

      if (modulosVisibles.includes(modulo)) {
        nuevo = modulosVisibles.filter((m) => m !== modulo);
      } else {
        nuevo = [...modulosVisibles, modulo];
      }

      asignarModulos(empleado.id, nuevo);
    },
    [modulosVisibles, asignarModulos, empleado.id]
  );

  return (
    <div className="p-6 space-y-8 text-white animate-fade-in">

      {/* HEADER PREMIUM */}
      <h1 className="text-3xl font-bold drop-shadow mb-4">
        Resumen de seguridad — {empleado.nombre} ({empleado.usuario})
      </h1>

      {/* DATOS BÁSICOS */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-xl p-6 space-y-4
        "
      >
        <h2 className="text-xl font-semibold drop-shadow mb-3">
          Datos básicos
        </h2>

        <div className="flex gap-6">
          <img
            src={empleado.foto}
            alt="Foto empleado"
            className="
              w-32 h-32 rounded-xl border border-white/20 object-cover shadow-xl
              transition hover:scale-[1.03]
            "
          />

          <div className="grid grid-cols-2 gap-2 text-white/90 text-sm">
            <div><strong>ID:</strong> {empleado.id}</div>
            <div><strong>Usuario:</strong> {empleado.usuario}</div>
            <div><strong>Nombre:</strong> {empleado.nombre}</div>
            <div><strong>Apellidos:</strong> {empleado.apellidos || "-"}</div>
            <div><strong>DNI:</strong> {empleado.dni || "-"}</div>
            <div><strong>Email:</strong> {empleado.email_empresa || "-"}</div>
            <div>
              <strong>Activo:</strong>{" "}
              {empleado.activo ? (
                <span className="text-green-400 font-semibold">Sí</span>
              ) : (
                <span className="text-red-400 font-semibold">No</span>
              )}
            </div>
            <div><strong>Rol:</strong> {empleado.rol_nombre || "-"}</div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          {empleado.activo ? (
            <button
              className="
                px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700
                text-white shadow-lg transition text-sm active:scale-[0.97]
              "
              onClick={() => bloquear(empleado.id)}
            >
              Bloquear usuario
            </button>
          ) : (
            <button
              className="
                px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700
                text-white shadow-lg transition text-sm active:scale-[0.97]
              "
              onClick={() => desbloquear(empleado.id)}
            >
              Desbloquear usuario
            </button>
          )}
        </div>
      </div>

      {/* ACCIONES RÁPIDAS */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-xl p-6
        "
      >
        <h2 className="text-xl font-semibold drop-shadow mb-3">
          Acciones rápidas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">

          {/* RESET PASSWORD */}
          <div>
            <label className="block text-sm mb-1 text-white/80">
              Nueva contraseña
            </label>
            <input
              type="password"
              className="
                w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
              "
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
            />
            <button
              className="
                mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
                text-white shadow-lg transition text-sm active:scale-[0.97]
              "
              onClick={() => {
                resetPassword(empleado.id, nuevaPassword);
                setNuevaPassword("");
              }}
            >
              Resetear contraseña
            </button>
          </div>

          {/* ASIGNAR ROL */}
          <div>
            <label className="block text-sm mb-1 text-white/80">
              Nuevo rol (ID)
            </label>
            <input
              type="number"
              className="
                w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                text-white focus:ring-2 focus:ring-purple-400
              "
              value={nuevoRol}
              onChange={(e) => setNuevoRol(e.target.value)}
            />
            <button
              className="
                mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700
                text-white shadow-lg transition text-sm active:scale-[0.97]
              "
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
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-xl p-6
        "
      >
        <h2 className="text-xl font-semibold drop-shadow mb-3">
          Módulos visibles
        </h2>

        <ul className="space-y-3 text-white">
          {Object.keys(permisosGlobales).map((modulo) => (
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

      {/* PERMISOS POR MÓDULO */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-xl p-6
        "
      >
        <h2 className="text-xl font-semibold drop-shadow mb-3">
          Permisos por módulo
        </h2>

        <ul className="space-y-6 text-white">
          {Object.entries(permisosGlobales).map(([modulo, permsDisponibles]) => (
            <li key={modulo}>
              <strong className="text-lg">{modulo}</strong>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                {permsDisponibles.map((perm) => (
                  <label
                    key={perm}
                    className="
                      flex items-center gap-2 text-sm bg-white/10 border border-white/20
                      rounded-xl px-3 py-2 hover:bg-white/20 transition
                    "
                  >
                    <input
                      type="checkbox"
                      checked={permisosEmpleado[modulo]?.includes(perm) || false}
                      onChange={() => cambiarPermiso(modulo, perm)}
                      className="
                        accent-purple-500 h-4 w-4 cursor-pointer transition
                        active:scale-[0.97]
                      "
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
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-xl p-6
        "
      >
        <h2 className="text-xl font-semibold drop-shadow mb-3">
          Auditoría reciente
        </h2>

        <ul className="space-y-2 text-white/90 text-sm">
          {auditoria.slice(0, 10).map((a) => (
            <li
              key={a.id}
              className="
                border-b border-white/10 pb-1 hover:bg-white/5 transition
              "
            >
              <strong>{a.fecha}</strong> — {a.accion} ({a.modulo})
            </li>
          ))}
        </ul>
      </div>

      {/* LOGS RECIENTES */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-xl p-6
        "
      >
        <h2 className="text-xl font-semibold drop-shadow mb-3">
          Logs recientes
        </h2>

        <ul className="space-y-2 text-white/90 text-sm">
          {logs.slice(0, 10).map((l) => (
            <li
              key={l.id}
              className="
                border-b border-white/10 pb-1 hover:bg-white/5 transition
              "
            >
              <strong>{l.fecha}</strong> — {l.tipo}: {l.mensaje}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
