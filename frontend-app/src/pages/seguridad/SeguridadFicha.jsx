

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
    asignarModulos,
    asignarPermisos,
    permisos,
    auditoria,
    logs
  } = useSeguridad();

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [nuevoRol, setNuevoRol] = useState("");

  const [showModulos, setShowModulos] = useState(false);
  const [showPermisos, setShowPermisos] = useState(false);

  const [filtroFechaAud, setFiltroFechaAud] = useState("");
  const [busquedaAud, setBusquedaAud] = useState("");
  const [paginaAud, setPaginaAud] = useState(0);
  const pageSizeAud = 20;

  const [filtroFechaLog, setFiltroFechaLog] = useState("");
  const [busquedaLog, setBusquedaLog] = useState("");
  const [paginaLog, setPaginaLog] = useState(0);
  const pageSizeLog = 20;

  const [ordenAud, setOrdenAud] = useState({ campo: "fecha", asc: false });
  const ordenarAud = (campo) => {
    setOrdenAud((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true
    }));
  };

  const [ordenLog, setOrdenLog] = useState({ campo: "fecha", asc: false });
  const ordenarLog = (campo) => {
    setOrdenLog((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true
    }));
  };

  const iconosAccion = {
    login: "🔐",
    login_error: "⚠️",
    acceso: "📥",
    update: "✏️",
    delete: "🗑️",
    permiso: "🔧",
    modulo: "📦",
    default: "📄"
  };

  const iconosEvento = {
    login: "🔐",
    login_error: "⚠️",
    acceso: "📥",
    update: "✏️",
    delete: "🗑️",
    default: "📄"
  };

  useEffect(() => {
    cargarFicha(id);
  }, [id]);

  if (!ficha) return <p className="p-6">Cargando ficha…</p>;

  const empleado = ficha.empleado;

  const modulosVisibles = ficha.modulos_visibles || [];
  const permisosEmpleado = ficha.permisos_modulo || {};

  const permisosGlobales = permisos.reduce((acc, p) => {
    if (!acc[p.modulo]) acc[p.modulo] = [];
    acc[p.modulo].push(p.permiso);
    return acc;
  }, {});



  const cambiarModulo = (modulo) => {
    let nuevo;

    if (modulosVisibles.includes(modulo)) {
      nuevo = modulosVisibles.filter((m) => m !== modulo);
    } else {
      nuevo = [...modulosVisibles, modulo];
    }

    asignarModulos(empleado.id, nuevo);
  };

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

  // ---------------------------
  // AUDITORÍA
  // ---------------------------

  const auditoriaFiltrada = auditoria.filter((a) => {
    const texto = busquedaAud.toLowerCase();

    const coincideBusqueda =
      a.usuario?.toLowerCase().includes(texto) ||
      a.modulo?.toLowerCase().includes(texto) ||
      a.accion?.toLowerCase().includes(texto) ||
      a.descripcion?.toLowerCase().includes(texto) ||
      a.fecha?.toLowerCase().includes(texto);

    const coincideFecha = filtroFechaAud
      ? a.fecha.startsWith(filtroFechaAud)
      : true;

    return coincideBusqueda && coincideFecha;
  });

  const auditoriaOrdenada = [...auditoriaFiltrada].sort((a, b) => {
    const campo = ordenAud.campo;
    const asc = ordenAud.asc ? 1 : -1;

    if (a[campo] < b[campo]) return -1 * asc;
    if (a[campo] > b[campo]) return 1 * asc;
    return 0;
  });

  const auditoriaPaginada = auditoriaOrdenada.slice(
    paginaAud * pageSizeAud,
    paginaAud * pageSizeAud + pageSizeAud
  );

  const descargarExcelAuditoria = () => {
    const encabezados = ["ID", "Usuario", "Módulo", "Acción", "Descripción", "Fecha"];
    const filas = auditoriaOrdenada.map((a) => [
      a.id,
      a.usuario,
      a.modulo,
      a.accion,
      a.descripcion,
      a.fecha
    ]);

    const contenido = [encabezados, ...filas]
      .map((fila) => fila.join("\t"))
      .join("\n");

    const blob = new Blob([contenido], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);

    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.download = "auditoria_usuario.xls";
    aTag.click();

    URL.revokeObjectURL(url);
  };



  // ---------------------------
  // LOGS
  // ---------------------------

  const logsFiltrados = logs.filter((l) => {
    const texto = busquedaLog.toLowerCase();

    const coincideBusqueda =
      l.evento?.toLowerCase().includes(texto) ||
      l.detalle?.toLowerCase().includes(texto) ||
      l.fecha?.toLowerCase().includes(texto);

    const coincideFecha = filtroFechaLog
      ? l.fecha.startsWith(filtroFechaLog)
      : true;

    return coincideBusqueda && coincideFecha;
  });

  const logsOrdenados = [...logsFiltrados].sort((a, b) => {
    const campo = ordenLog.campo;
    const asc = ordenLog.asc ? 1 : -1;

    if (a[campo] < b[campo]) return -1 * asc;
    if (a[campo] > b[campo]) return 1 * asc;
    return 0;
  });

  const logsPaginados = logsOrdenados.slice(
    paginaLog * pageSizeLog,
    paginaLog * pageSizeLog + pageSizeLog
  );

  const descargarExcelLogs = () => {
    const encabezados = ["ID", "Evento", "Detalle", "Fecha", "IP"];
    const filas = logsOrdenados.map((l) => [
      l.id,
      l.evento,
      l.detalle,
      l.fecha,
      l.ip || "-"
    ]);

    const contenido = [encabezados, ...filas]
      .map((fila) => fila.join("\t"))
      .join("\n");

    const blob = new Blob([contenido], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);

    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.download = "logs_usuario.xls";
    aTag.click();

    URL.revokeObjectURL(url);
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
            <div>
              <strong>Activo:</strong>{" "}
              {empleado.activo ? (
                <span className="text-green-600 font-semibold">Sí</span>
              ) : (
                <span className="text-red-600 font-semibold">No</span>
              )}
            </div>
            <div><strong>Rol:</strong> {empleado.rol?.nombre || "-"}</div>
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

      {/* SEGURIDAD */}
      <div className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Seguridad</h2>

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
        <button
          className="text-xl font-semibold mb-3 w-full text-left"
          onClick={() => setShowModulos(!showModulos)}
        >
          Módulos visibles (editable)
        </button>

        {showModulos && (
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
        )}
      </div>

      {/* PERMISOS POR MÓDULO */}
      <div className="border p-4 rounded bg-white shadow">
        <button
          className="text-xl font-semibold mb-3 w-full text-left"
          onClick={() => setShowPermisos(!showPermisos)}
        >
          Permisos por módulo (editable)
        </button>

        {showPermisos && (
          <ul className="space-y-4">
            {Object.entries(permisosGlobales).map(([modulo, permsDisponibles]) => (
              <li key={modulo} className="border-b pb-2">
                <strong>{modulo}</strong>

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
        )}
      </div>

      {/* AUDITORÍA DEL USUARIO */}
      <div className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Auditoría del usuario</h2>

        <button
          onClick={descargarExcelAuditoria}
          className="px-3 py-2 bg-green-600 text-white rounded mb-4"
        >
          Descargar Excel
        </button>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            className="border rounded px-3 py-2 w-full md:w-1/2"
            placeholder="Buscar por módulo, acción, descripción..."
            value={busquedaAud}
            onChange={(e) => {
              setBusquedaAud(e.target.value);
              setPaginaAud(0);
            }}
          />

          <input
            type="date"
            className="border rounded px-3 py-2 w-full md:w-1/3"
            value={filtroFechaAud}
            onChange={(e) => {
              setFiltroFechaAud(e.target.value);
              setPaginaAud(0);
            }}
          />
        </div>

        <table className="w-full text-sm border rounded bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2 cursor-pointer" onClick={() => ordenarAud("fecha")}>
                Fecha {ordenAud.campo === "fecha" ? (ordenAud.asc ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 cursor-pointer" onClick={() => ordenarAud("modulo")}>
                Módulo {ordenAud.campo === "modulo" ? (ordenAud.asc ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 cursor-pointer" onClick={() => ordenarAud("accion")}>
                Acción {ordenAud.campo === "accion" ? (ordenAud.asc ? "▲" : "▼") : ""}
              </th>
              <th className="p-2">Descripción</th>
            </tr>
          </thead>

          <tbody>
            {auditoriaPaginada.map((a) => (
              <tr key={a.id} className="border-b">
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
        <div className="flex items-center gap-3 mt-4">
          <button
            disabled={paginaAud === 0}
            onClick={() => setPaginaAud(paginaAud - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ← Anterior
          </button>

          <span className="text-sm text-gray-600">Página {paginaAud + 1}</span>

          <button
            disabled={(paginaAud + 1) * pageSizeAud >= auditoriaOrdenada.length}
            onClick={() => setPaginaAud(paginaAud + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* LOGS DEL USUARIO */}
      <div className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Logs del usuario</h2>

        <button
          onClick={descargarExcelLogs}
          className="px-3 py-2 bg-green-600 text-white rounded mb-4"
        >
          Descargar Excel
        </button>

        {/* FILTROS */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            className="border rounded px-3 py-2 w-full md:w-1/2"
            placeholder="Buscar por evento, detalle o fecha..."
            value={busquedaLog}
            onChange={(e) => {
              setBusquedaLog(e.target.value);
              setPaginaLog(0);
            }}
          />

          <input
            type="date"
            className="border rounded px-3 py-2 w-full md:w-1/3"
            value={filtroFechaLog}
            onChange={(e) => {
              setFiltroFechaLog(e.target.value);
              setPaginaLog(0);
            }}
          />
        </div>

        {/* TABLA */}
        <table className="w-full text-sm border rounded bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2 cursor-pointer" onClick={() => ordenarLog("fecha")}>
                Fecha {ordenLog.campo === "fecha" ? (ordenLog.asc ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 cursor-pointer" onClick={() => ordenarLog("evento")}>
                Evento {ordenLog.campo === "evento" ? (ordenLog.asc ? "▲" : "▼") : ""}
              </th>
              <th className="p-2">Detalle</th>
              <th className="p-2">IP</th>
            </tr>
          </thead>

          <tbody>
            {logsPaginados.map((l) => (
              <tr key={l.id} className="border-b">
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
        <div className="flex items-center gap-3 mt-4">
          <button
            disabled={paginaLog === 0}
            onClick={() => setPaginaLog(paginaLog - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ← Anterior
          </button>

          <span className="text-sm text-gray-600">Página {paginaLog + 1}</span>

          <button
            disabled={(paginaLog + 1) * pageSizeLog >= logsOrdenados.length}
            onClick={() => setPaginaLog(paginaLog + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
