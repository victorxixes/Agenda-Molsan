import { useEffect, useState, useCallback, useMemo } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

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
    permisos = [],
    logs = [],
    auditoria = [],
  } = useSeguridad();

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [nuevoRol, setNuevoRol] = useState("");

  // Cargar ficha
  useEffect(() => {
    if (empleadoId) cargarFicha(empleadoId);
  }, [empleadoId, cargarFicha]);

  // Blindar ficha
  const fichaSegura = useMemo(() => {
    if (!ficha || typeof ficha !== "object") return null;
    if (!ficha.empleado || typeof ficha.empleado !== "object") return null;
    return ficha;
  }, [ficha]);

  if (!fichaSegura)
    return (
      <div className="p-6 text-white/70 animate-pulse">
        Cargando resumen…
      </div>
    );

  const empleado = fichaSegura.empleado;

  // Blindar módulos visibles
  const modulosVisibles = Array.isArray(empleado.modulos_visibles_list)
    ? empleado.modulos_visibles_list.filter((m) => typeof m === "string")
    : [];

  // Blindar permisos del empleado
  const permisosEmpleado = useMemo(() => {
    const dict = fichaSegura.permisos_modulo_dict || {};
    const limpio = {};

    Object.entries(dict).forEach(([modulo, lista]) => {
      if (typeof modulo === "string" && Array.isArray(lista)) {
        limpio[modulo] = lista.filter((p) => typeof p === "string");
      }
    });

    return limpio;
  }, [fichaSegura]);

  // Blindar permisos globales
  const permisosGlobales = useMemo(() => {
    return permisos
      .filter(
        (p) =>
          p &&
          typeof p === "object" &&
          typeof p.modulo === "string" &&
          typeof p.permiso === "string"
      )
      .reduce((acc, p) => {
        if (!acc[p.modulo]) acc[p.modulo] = [];
        acc[p.modulo].push(p.permiso);
        return acc;
      }, {});
  }, [permisos]);

  // Cambiar permiso
  const cambiarPermiso = useCallback(
    (modulo, permiso) => {
      if (typeof modulo !== "string" || typeof permiso !== "string") return;

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
      if (typeof modulo !== "string") return;

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

  // Blindar auditoría
  const auditoriaSegura = useMemo(() => {
    return Array.isArray(auditoria)
      ? auditoria.filter(
          (a) =>
            a &&
            typeof a === "object" &&
            typeof a.fecha === "string" &&
            typeof a.accion === "string" &&
            typeof a.descripcion === "string" &&
            typeof a.usuario === "string"
        )
      : [];
  }, [auditoria]);

  // Blindar logs
  const logsSeguros = useMemo(() => {
    return Array.isArray(logs)
      ? logs.filter(
          (l) =>
            l &&
            typeof l === "object" &&
            typeof l.fecha === "string" &&
            typeof l.tipo === "string" &&
            typeof l.mensaje === "string"
        )
      : [];
  }, [logs]);

  return (
    <div className="p-6 space-y-8 text-white animate-fade-in">

      {/* HEADER */}
      <h1 className="text-3xl font-bold drop-shadow mb-4">
        Resumen de seguridad — {empleado.nombre || "-"} ({empleado.usuario || "-"})
      </h1>

      {/* DATOS BÁSICOS */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold drop-shadow mb-3">Datos básicos</h2>

        <div className="flex gap-6">
          <img
            src={typeof empleado.foto === "string" ? empleado.foto : "/no-foto.png"}
            alt="Foto empleado"
            className="w-32 h-32 rounded-xl border border-white/20 object-cover shadow-xl"
          />

          <div className="grid grid-cols-2 gap-2 text-white/90 text-sm">
            <div><strong>ID:</strong> {String(empleado.id)}</div>
            <div><strong>Usuario:</strong> {empleado.usuario || "-"}</div>
            <div><strong>Nombre:</strong> {empleado.nombre || "-"}</div>
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
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg transition text-sm"
              onClick={() => bloquear(empleado.id)}
            >
              Bloquear usuario
            </button>
          ) : (
            <button
              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg transition text-sm"
              onClick={() => desbloquear(empleado.id)}
            >
              Desbloquear usuario
            </button>
          )}
        </div>
      </div>

      {/* ACCIONES RÁPIDAS */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold drop-shadow mb-3">Acciones rápidas</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">

          {/* RESET PASSWORD */}
          <div>
            <label className="block text-sm mb-1 text-white/80">Nueva contraseña</label>
            <input
              type="password"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
            />
            <button
              className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-sm"
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
            <label className="block text-sm mb-1 text-white/80">Nuevo rol (ID)</label>
            <input
              type="number"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white"
              value={nuevoRol}
              onChange={(e) => setNuevoRol(e.target.value)}
            />
            <button
              className="mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg text-sm"
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

      {/* PERMISOS Y MÓDULOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Permisos */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6">
          <h3 className="text-white font-semibold text-sm mb-2">Permisos por módulo</h3>

          {Object.entries(permisosGlobales).map(([modulo, lista]) => (
            <div key={modulo} className="mb-4">
              <strong className="text-lg">{modulo}</strong>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {lista.map((perm) => (
                  <label
                    key={`${modulo}-${perm}`}
                    className="flex items-center gap-2 text-sm bg-white/10 border border-white/20 rounded-xl px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      checked={permisosEmpleado[modulo]?.includes(perm) || false}
                      onChange={() => cambiarPermiso(modulo, perm)}
                      className="accent-purple-500 h-4 w-4 cursor-pointer"
                    />
                    {perm}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Módulos visibles */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6">
          <h3 className="text-white font-semibold text-sm mb-2">Módulos visibles</h3>

          <ul className="space-y-3">
            {Object.keys(permisosGlobales).map((modulo) => (
              <li
                key={modulo}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2"
              >
                <span className="font-medium">{modulo}</span>

                <input
                  type="checkbox"
                  checked={modulosVisibles.includes(modulo)}
                  onChange={() => cambiarModulo(modulo)}
                  className="h-5 w-5 accent-blue-500 cursor-pointer"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AUDITORÍA Y LOGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Auditoría */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl">
          <h3 className="text-white font-semibold text-sm mb-2">Auditoría reciente</h3>

          <div className="space-y-2 max-h-64 overflow-y-auto text-xs text-white/80">
            {auditoriaSegura.map((item) => (
              <div
                key={`${item.fecha}-${item.accion}-${item.usuario}`}
                className="border border-white/10 rounded-xl px-3 py-2"
              >
                <div className="font-semibold">{item.accion}</div>
                <div>{item.descripcion}</div>
                <div className="text-white/50">
                  {item.fecha} · {item.usuario}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl">
          <h3 className="text-white font-semibold text-sm mb-2">Logs recientes</h3>

          <div className="space-y-2 max-h-64 overflow-y-auto text-xs text-white/80">
            {logsSeguros.map((log) => (
              <div
                key={`${log.fecha}-${log.tipo}-${log.mensaje}`}
                className="border border-white/10 rounded-xl px-3 py-2"
              >
                <div className="font-semibold">{log.tipo}</div>
                <div>{log.mensaje}</div>
                <div className="text-white/50">
                  {log.fecha} · {log.origen || ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
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
    {Object.keys(permisosGlobales)
      .filter((modulo) => typeof modulo === "string")
      .map((modulo) => (
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
            checked={Array.isArray(modulosVisibles) &&
              modulosVisibles.includes(modulo)}
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
    {Object.entries(permisosGlobales)
      .filter(
        ([modulo, lista]) =>
          typeof modulo === "string" &&
          Array.isArray(lista)
      )
      .map(([modulo, permsDisponibles]) => (
        <li key={modulo}>
          <strong className="text-lg">{modulo}</strong>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {permsDisponibles
              .filter((perm) => typeof perm === "string")
              .map((perm) => (
                <label
                  key={`${modulo}-${perm}`}
                  className="
                    flex items-center gap-2 text-sm bg-white/10 border border-white/20
                    rounded-xl px-3 py-2 hover:bg-white/20 transition
                  "
                >
                  <input
                    type="checkbox"
                    checked={
                      permisosEmpleado[modulo]?.includes(perm) || false
                    }
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
    {(Array.isArray(auditoria) ? auditoria : [])
      .filter(
        (a) =>
          a &&
          typeof a === "object" &&
          typeof a.id === "number" &&
          typeof a.fecha === "string" &&
          typeof a.accion === "string" &&
          typeof a.modulo === "string"
      )
      .slice(0, 10)
      .map((a) => (
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
    {(Array.isArray(logs) ? logs : [])
      .filter(
        (l) =>
          l &&
          typeof l === "object" &&
          typeof l.id === "number" &&
          typeof l.fecha === "string" &&
          typeof l.tipo === "string" &&
          typeof l.mensaje === "string"
      )
      .slice(0, 10)
      .map((l) => (
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
