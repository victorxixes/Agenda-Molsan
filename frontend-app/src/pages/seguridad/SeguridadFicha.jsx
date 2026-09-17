// frontend-app/src/pages/seguridad/SeguridadResumen.jsx
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
    asignarPermisos,
    asignarModulos,
    permisos,
    logs,
    auditoria
  } = useSeguridad();

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [nuevoRol, setNuevoRol] = useState("");
  const [showModulos, setShowModulos] = useState(false);
  const [showPermisos, setShowPermisos] = useState(false);

  useEffect(() => {
    cargarFicha(empleadoId);
  }, [empleadoId]);

  if (!ficha)
    return (
      <div className="p-6 text-white/70 animate-pulse">
        Cargando resumen…
      </div>
    );

  const empleado = ficha.empleado;
  const modulosVisibles = empleado.modulos_visibles_list || [];
  const permisosEmpleado = ficha.permisos_modulo_dict || {};

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
    <div className="p-6 space-y-8">

      {/* DATOS BÁSICOS */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-xl p-6 space-y-4
        "
      >
        <h2 className="text-xl font-semibold text-white drop-shadow mb-3">
          Datos básicos
        </h2>

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
              className="
                px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700
                text-white shadow-lg transition text-sm
              "
              onClick={() => bloquear(empleado.id)}
            >
              Bloquear usuario
            </button>
          ) : (
            <button
              className="
                px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700
                text-white shadow-lg transition text-sm
              "
              onClick={() => desbloquear(empleado.id)}
            >
              Desbloquear usuario
            </button>
          )}
        </div>
      </div>
      {/* AUDITORÍA DEL USUARIO — SJ‑2026 */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-xl p-6 space-y-4
        "
      >
        <h2 className="text-xl font-semibold text-white drop-shadow mb-3">
          Auditoría del usuario
        </h2>

        <button
          onClick={descargarExcelAuditoria}
          className="
            px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl
            shadow-lg transition text-sm active:scale-[0.97]
          "
        >
          Descargar Excel
        </button>

        {/* FILTROS */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            className="
              w-full md:w-1/2 bg-white/10 border border-white/20 rounded-xl px-3 py-2
              text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
              transition
            "
            placeholder="Buscar por módulo, acción, descripción..."
            value={busquedaAud}
            onChange={(e) => {
              setBusquedaAud(e.target.value);
              setPaginaAud(0);
            }}
          />

          <input
            type="date"
            className="
              w-full md:w-1/3 bg-white/10 border border-white/20 rounded-xl px-3 py-2
              text-white focus:ring-2 focus:ring-blue-400 transition
            "
            value={filtroFechaAud}
            onChange={(e) => {
              setFiltroFechaAud(e.target.value);
              setPaginaAud(0);
            }}
          />
        </div>

        {/* TABLA AUDITORÍA */}
        <table
          className="
            w-full text-sm bg-white/5 border border-white/10 rounded-xl
            text-white overflow-hidden
          "
        >
          <thead>
            <tr className="bg-white/10 border-b border-white/20">
              <th
                className="p-2 cursor-pointer hover:text-blue-300 transition"
                onClick={() => ordenarAud("fecha")}
              >
                Fecha{" "}
                {ordenAud.campo === "fecha"
                  ? ordenAud.asc
                    ? "▲"
                    : "▼"
                  : ""}
              </th>

              <th
                className="p-2 cursor-pointer hover:text-blue-300 transition"
                onClick={() => ordenarAud("modulo")}
              >
                Módulo{" "}
                {ordenAud.campo === "modulo"
                  ? ordenAud.asc
                    ? "▲"
                    : "▼"
                  : ""}
              </th>

              <th
                className="p-2 cursor-pointer hover:text-blue-300 transition"
                onClick={() => ordenarAud("accion")}
              >
                Acción{" "}
                {ordenAud.campo === "accion"
                  ? ordenAud.asc
                    ? "▲"
                    : "▼"
                  : ""}
              </th>

              <th className="p-2">Descripción</th>
            </tr>
          </thead>

          <tbody>
            {auditoriaPaginada.map((a) => (
              <tr
                key={a.id}
                className="
                  border-b border-white/10 hover:bg-white/5 transition
                "
              >
                <td className="p-2">{a.fecha}</td>
                <td className="p-2">{a.modulo}</td>
                <td className="p-2">
                  {iconosAccion[a.accion] || iconosAccion.default} {a.accion}
                </td>
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
            className="
              px-3 py-1 bg-white/10 border border-white/20 rounded-xl
              disabled:opacity-40 hover:bg-white/20 transition active:scale-[0.97]
            "
          >
            ← Anterior
          </button>

          <span className="text-sm text-white/70">
            Página {paginaAud + 1}
          </span>

          <button
            disabled={(paginaAud + 1) * pageSizeAud >= auditoriaOrdenada.length}
            onClick={() => setPaginaAud(paginaAud + 1)}
            className="
              px-3 py-1 bg-white/10 border border-white/20 rounded-xl
              disabled:opacity-40 hover:bg-white/20 transition active:scale-[0.97]
            "
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* LOGS DEL USUARIO — SJ‑2026 */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-xl p-6 space-y-4
        "
      >
        <h2 className="text-xl font-semibold text-white drop-shadow mb-3">
          Logs del usuario
        </h2>

        <button
          onClick={descargarExcelLogs}
          className="
            px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl
            shadow-lg transition text-sm active:scale-[0.97]
          "
        >
          Descargar Excel
        </button>

        {/* FILTROS */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            className="
              w-full md:w-1/2 bg-white/10 border border-white/20 rounded-xl px-3 py-2
              text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
              transition
            "
            placeholder="Buscar por evento, detalle o fecha..."
            value={busquedaLog}
            onChange={(e) => {
              setBusquedaLog(e.target.value);
              setPaginaLog(0);
            }}
          />

          <input
            type="date"
            className="
              w-full md:w-1/3 bg-white/10 border border-white/20 rounded-xl px-3 py-2
              text-white focus:ring-2 focus:ring-blue-400 transition
            "
            value={filtroFechaLog}
            onChange={(e) => {
              setFiltroFechaLog(e.target.value);
              setPaginaLog(0);
            }}
          />
        </div>

        {/* TABLA LOGS */}
        <table
          className="
            w-full text-sm bg-white/5 border border-white/10 rounded-xl
            text-white overflow-hidden
          "
        >
          <thead>
            <tr className="bg-white/10 border-b border-white/20">
              <th
                className="p-2 cursor-pointer hover:text-purple-300 transition"
                onClick={() => ordenarLog("fecha")}
              >
                Fecha{" "}
                {ordenLog.campo === "fecha"
                  ? ordenLog.asc
                    ? "▲"
                    : "▼"
                  : ""}
              </th>

              <th
                className="p-2 cursor-pointer hover:text-purple-300 transition"
                onClick={() => ordenarLog("evento")}
              >
                Evento{" "}
                {ordenLog.campo === "evento"
                  ? ordenLog.asc
                    ? "▲"
                    : "▼"
                  : ""}
              </th>

              <th className="p-2">Detalle</th>
              <th className="p-2">IP</th>
            </tr>
          </thead>

          <tbody>
            {logsPaginados.map((l) => (
              <tr
                key={l.id}
                className="
                  border-b border-white/10 hover:bg-white/5 transition
                "
              >
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
            className="
              px-3 py-1 bg-white/10 border border-white/20 rounded-xl
              disabled:opacity-40 hover:bg-white/20 transition active:scale-[0.97]
            "
          >
            ← Anterior
          </button>

          <span className="text-sm text-white/70">
            Página {paginaLog + 1}
          </span>

          <button
            disabled={(paginaLog + 1) * pageSizeLog >= logsOrdenados.length}
            onClick={() => setPaginaLog(paginaLog + 1)}
            className="
              px-3 py-1 bg-white/10 border border-white/20 rounded-xl
              disabled:opacity-40 hover:bg-white/20 transition active:scale-[0.97]
            "
          >
            Siguiente →
          </button>
        </div>
      </div>
        {/* PAGINACIÓN LOGS */}
        <div className="flex items-center gap-3 mt-4 text-white">
          <button
            disabled={paginaLog === 0}
            onClick={() => setPaginaLog(paginaLog - 1)}
            className="
              px-3 py-1 bg-white/10 border border-white/20 rounded-xl
              disabled:opacity-40 hover:bg-white/20 transition active:scale-[0.97]
            "
          >
            ← Anterior
          </button>

          <span className="text-sm text-white/70">
            Página {paginaLog + 1}
          </span>

          <button
            disabled={(paginaLog + 1) * pageSizeLog >= logsOrdenados.length}
            onClick={() => setPaginaLog(paginaLog + 1)}
            className="
              px-3 py-1 bg-white/10 border border-white/20 rounded-xl
              disabled:opacity-40 hover:bg-white/20 transition active:scale-[0.97]
            "
          >
            Siguiente →
          </button>
        </div>
      </div> {/* ← cierre bloque LOGS */}

    </div> {/* ← cierre contenedor principal p-6 space-y-8 */}
  );
} {/* ← cierre del componente SeguridadResumen */}
