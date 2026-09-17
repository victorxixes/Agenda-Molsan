// frontend-app/src/pages/seguridad/SeguridadFicha.jsx
import { useEffect, useState } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadFicha({ empleadoId }) {
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
    auditoria
  } = useSeguridad();

  // Estados SJ‑2026
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [nuevoRol, setNuevoRol] = useState("");

  const [showModulos, setShowModulos] = useState(false);
  const [showPermisos, setShowPermisos] = useState(false);
  const [showAuditoria, setShowAuditoria] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const [busquedaAud, setBusquedaAud] = useState("");
  const [filtroFechaAud, setFiltroFechaAud] = useState("");
  const [paginaAud, setPaginaAud] = useState(0);

  const [busquedaLog, setBusquedaLog] = useState("");
  const [filtroFechaLog, setFiltroFechaLog] = useState("");
  const [paginaLog, setPaginaLog] = useState(0);

  useEffect(() => {
    if (empleadoId) cargarFicha(empleadoId);
  }, [empleadoId, cargarFicha]);

  // Protección total SJ‑2026
  if (
    !ficha ||
    typeof ficha !== "object" ||
    !ficha.empleado ||
    typeof ficha.empleado !== "object"
  ) {
    return (
      <div className="p-6 text-white/70 animate-pulse">
        Cargando ficha…
      </div>
    );
  }

  const empleado = ficha.empleado;

  // Protección extra
  if (!empleado.id || !empleado.nombre) {
    return (
      <div className="p-6 text-white/70 animate-pulse">
        Datos de empleado no válidos…
      </div>
    );
  }

  const modulosVisibles = empleado.modulos_visibles_list || [];
  const permisosEmpleado = ficha.permisos_modulo_dict || {};

  const permisosGlobales = (permisos || []).reduce((acc, p) => {
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
    <div className="p-6 space-y-8">

      {/* CABECERA */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-white drop-shadow mb-4">
          Ficha de seguridad — SJ‑2026 · {empleado.nombre} ({empleado.usuario})
        </h1>

        <div className="flex gap-6">
          <img
            src={empleado.foto}
            alt="Foto empleado"
            className="w-32 h-32 rounded-xl border border-white/20 object-cover shadow-lg"
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
      {/* SEGURIDAD */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 space-y-6">

        {/* RESET PASSWORD */}
        <div>
          <h2 className="text-xl font-semibold text-white drop-shadow mb-3">
            Seguridad del usuario
          </h2>

          <label className="block text-sm mb-1 text-white/80">
            Nueva contraseña
          </label>

          <input
            type="password"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 transition"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
          />

          <button
            className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition text-sm active:scale-[0.97]"
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
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-purple-400 transition"
            value={nuevoRol}
            onChange={(e) => setNuevoRol(e.target.value)}
          />

          <button
            className="mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition text-sm active:scale-[0.97]"
            onClick={() => {
              asignarRol(empleado.id, Number(nuevoRol));
              setNuevoRol("");
            }}
          >
            Asignar rol
          </button>
        </div>
      </div>
      {/* MÓDULOS VISIBLES */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6">
        <button
          className="text-xl font-semibold text-white drop-shadow mb-3 w-full text-left hover:text-blue-300 transition"
          onClick={() => setShowModulos(!showModulos)}
        >
          Módulos visibles (editable)
        </button>

        {showModulos && (
          <ul className="space-y-3 text-white">
            {Object.keys(permisosGlobales).map((modulo) => (
              <li
                key={modulo}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2 hover:bg-white/10 transition"
              >
                <span className="font-medium">{modulo}</span>

                <input
                  type="checkbox"
                  checked={modulosVisibles.includes(modulo)}
                  onChange={() => cambiarModulo(modulo)}
                  className="h-5 w-5 accent-blue-500 cursor-pointer transition active:scale-[0.97]"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* PERMISOS POR MÓDULO */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6">
        <button
          className="text-xl font-semibold text-white drop-shadow mb-3 w-full text-left hover:text-purple-300 transition"
          onClick={() => setShowPermisos(!showPermisos)}
        >
          Permisos por módulo (editable)
        </button>

        {showPermisos && (
          <ul className="space-y-6 text-white">
            {Object.entries(permisosGlobales).map(([modulo, permsDisponibles]) => (
              <li key={modulo}>
                <strong className="text-lg">{modulo}</strong>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {permsDisponibles.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center gap-2 text-sm bg-white/10 border border-white/20 rounded-xl px-3 py-2 hover:bg-white/20 transition"
                    >
                      <input
                        type="checkbox"
                        checked={permisosEmpleado[modulo]?.includes(perm) || false}
                        onChange={() => cambiarPermiso(modulo, perm)}
                        className="accent-purple-500 h-4 w-4 cursor-pointer transition active:scale-[0.97]"
                      />
                      {perm}
                    </label>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* AUDITORÍA DEL USUARIO — SJ‑2026 */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 space-y-4">
        <button
          className="text-xl font-semibold text-white drop-shadow mb-3 w-full text-left hover:text-green-300 transition"
          onClick={() => setShowAuditoria(!showAuditoria)}
        >
          Auditoría del usuario
        </button>

        {showAuditoria && (
          <>
            <button
              onClick={descargarExcelAuditoria}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition text-sm active:scale-[0.97]"
            >
              Descargar Excel
            </button>

            {/* FILTROS AUDITORÍA */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                type="text"
                className="w-full md:w-1/2 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Buscar por módulo, acción, descripción..."
                value={busquedaAud}
                onChange={(e) => {
                  setBusquedaAud(e.target.value);
                  setPaginaAud(0);
                }}
              />

              <input
                type="date"
                className="w-full md:w-1/3 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-blue-400 transition"
                value={filtroFechaAud}
                onChange={(e) => {
                  setFiltroFechaAud(e.target.value);
                  setPaginaAud(0);
                }}
              />
            </div>

            {/* TABLA AUDITORÍA */}
            <table className="w-full text-sm bg-white/5 border border-white/10 rounded-xl text-white overflow-hidden">
              <thead>
                <tr className="bg-white/10 border-b border-white/20">
                  <th
                    className="p-2 cursor-pointer hover:text-blue-300 transition"
                    onClick={() => ordenarAud("fecha")}
                  >
                    Fecha {ordenAud.campo === "fecha" ? (ordenAud.asc ? "▲" : "▼") : ""}
                  </th>

                  <th
                    className="p-2 cursor-pointer hover:text-blue-300 transition"
                    onClick={() => ordenarAud("modulo")}
                  >
                    Módulo {ordenAud.campo === "modulo" ? (ordenAud.asc ? "▲" : "▼") : ""}
                  </th>

                  <th
                    className="p-2 cursor-pointer hover:text-blue-300 transition"
                    onClick={() => ordenarAud("accion")}
                  >
                    Acción {ordenAud.campo === "accion" ? (ordenAud.asc ? "▲" : "▼") : ""}
                  </th>

                  <th className="p-2">Descripción</th>
                </tr>
              </thead>

              <tbody>
                {auditoriaPaginada.map((a) => (
                  <tr key={a.id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="p-2">{a.fecha}</td>
                    <td className="p-2">{a.modulo}</td>
                    <td className="p-2">{a.accion}</td>
                    <td className="p-2">{a.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINACIÓN AUDITORÍA */}
            <div className="flex items-center gap-3 mt-4 text-white">
              <button
                disabled={paginaAud === 0}
                onClick={() => setPaginaAud(paginaAud - 1)}
                className="px-3 py-1 bg-white/10 border border-white/20 rounded-xl disabled:opacity-40 hover:bg-white/20 transition active:scale-[0.97]"
              >
                ← Anterior
              </button>

              <span className="text-sm text-white/70">
                Página {paginaAud + 1}
              </span>

              <button
                disabled={(paginaAud + 1) * pageSizeAud >= auditoriaOrdenada.length}
                onClick={() => setPaginaAud(paginaAud + 1)}
                className="px-3 py-1 bg-white/10 border border-white/20 rounded-xl disabled:opacity-40 hover:bg-white/20 transition active:scale-[0.97]"
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </div>

      {/* LOGS DEL USUARIO — SJ‑2026 */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 space-y-4">
        <button
          className="text-xl font-semibold text-white drop-shadow mb-3 w-full text-left hover:text-purple-300 transition"
          onClick={() => setShowLogs(!showLogs)}
        >
          Logs del usuario
        </button>

        {showLogs && (
          <>
            <button
              onClick={descargarExcelLogs}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition text-sm active:scale-[0.97]"
            >
              Descargar Excel
            </button>

            {/* FILTROS LOGS */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                type="text"
                className="w-full md:w-1/2 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Buscar por evento, detalle o fecha..."
                value={busquedaLog}
                onChange={(e) => {
                  setBusquedaLog(e.target.value);
                  setPaginaLog(0);
                }}
              />

              <input
                type="date"
                className="w-full md:w-1/3 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-blue-400 transition"
                value={filtroFechaLog}
                onChange={(e) => {
                  setFiltroFechaLog(e.target.value);
                  setPaginaLog(0);
                }}
              />
            </div>

            {/* TABLA LOGS */}
            <table className="w-full text-sm bg-white/5 border border-white/10 rounded-xl text-white overflow-hidden">
              <thead>
                <tr className="bg-white/10 border-b border-white/20">
                  <th
                    className="p-2 cursor-pointer hover:text-purple-300 transition"
                    onClick={() => ordenarLog("fecha")}
                  >
                    Fecha {ordenLog.campo === "fecha" ? (ordenLog.asc ? "▲" : "▼") : ""}
                  </th>

                  <th
                    className="p-2 cursor-pointer hover:text-purple-300 transition"
                    onClick={() => ordenarLog("evento")}
                  >
                    Evento {ordenLog.campo === "evento" ? (ordenLog.asc ? "▲" : "▼") : ""}
                  </th>

                  <th className="p-2">Detalle</th>
                  <th className="p-2">IP</th>
                </tr>
              </thead>

              <tbody>
                {logsPaginados.map((l) => (
                  <tr key={l.id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="p-2">{l.fecha}</td>
                    <td className="p-2">
                      {iconosEvento[l.evento] || iconosEvento.default} {l.evento}
                    </td>
                    <td className="p-2">{l.detalle || "-"}</td>
                    <td className="p-2">{l.ip || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINACIÓN LOGS */}
            <div className="flex items-center gap-3 mt-4 text-white">
              <button
                disabled={paginaLog === 0}
                onClick={() => setPaginaLog(paginaLog - 1)}
                className="px-3 py-1 bg-white/10 border border-white/20 rounded-xl disabled:opacity-40 hover:bg-white/20 transition active:scale-[0.97]"
              >
                ← Anterior
              </button>

              <span className="text-sm text-white/70">
                Página {paginaLog + 1}
              </span>

              <button
                disabled={(paginaLog + 1) * pageSizeLog >= logsOrdenados.length}
                onClick={() => setPaginaLog(paginaLog + 1)}
                className="px-3 py-1 bg-white/10 border border-white/20 rounded-xl disabled:opacity-40 hover:bg-white/20 transition active:scale-[0.97]"
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
