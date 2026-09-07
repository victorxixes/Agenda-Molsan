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

  // Acordeones
  const [showModulos, setShowModulos] = useState(false);
  const [showPermisos, setShowPermisos] = useState(false);

  // Filtros
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroModulo, setFiltroModulo] = useState("");

  // Ordenación
  const [orden, setOrden] = useState({ campo: "fecha", asc: false });

  const ordenar = (campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true
    }));
  };

  // Iconos por tipo de acción
  const iconosAccion = {
    login: "🔐",
    logout: "🚪",
    update: "✏️",
    delete: "🗑️",
    error: "⚠️",
    acceso: "📥",
    default: "📄"
  };

  // Paginación auditoría
  const [paginaAuditoria, setPaginaAuditoria] = useState(0);

  // Paginación logs
  const [paginaLogs, setPaginaLogs] = useState(0);

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
  // AUDITORÍA — FILTROS + ORDEN + PAGINACIÓN
  // ---------------------------

  const auditoriaFiltrada = auditoria.filter(
    (a) => a.usuario === empleado.usuario
  );

  const auditoriaOrdenada = [...auditoriaFiltrada].sort((a, b) => {
    const campo = orden.campo;
    const asc = orden.asc ? 1 : -1;

    if (a[campo] < b[campo]) return -1 * asc;
    if (a[campo] > b[campo]) return 1 * asc;
    return 0;
  });

  const auditoriaFiltradaFinal = auditoriaOrdenada.filter((a) => {
    const coincideFecha = filtroFecha ? a.fecha.startsWith(filtroFecha) : true;
    const coincideModulo = filtroModulo
      ? a.modulo.toLowerCase().includes(filtroModulo)
      : true;
    return coincideFecha && coincideModulo;
  });

  const auditoriaPaginada = auditoriaFiltradaFinal.slice(
    paginaAuditoria * 10,
    paginaAuditoria * 10 + 10
  );

  // ---------------------------
  // LOGS — PAGINACIÓN
  // ---------------------------

  const logsFiltrados = logs.filter((l) => l.usuario === empleado.usuario);

  const logsPaginados = logsFiltrados.slice(
    paginaLogs * 10,
    paginaLogs * 10 + 10
  );

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

      {/* MÓDULOS VISIBLES (ACORDEÓN) */}
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

      {/* PERMISOS POR MÓDULO (ACORDEÓN) */}
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

      {/* AUDITORÍA DEL SISTEMA */}
      <div className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Auditoría del sistema</h2>

        {/* Filtros */}
        <div className="flex gap-4 mb-3">
          <div>
            <label className="text-sm">Filtrar por fecha</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Buscar módulo</label>
            <input
              type="text"
              className="border rounded px-2 py-1"
              placeholder="agenda, intranet, mensajes..."
              value={filtroModulo}
              onChange={(e) => setFiltroModulo(e.target.value.toLowerCase())}
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-2 cursor-pointer" onClick={() => ordenar("fecha")}>
                Fecha {orden.campo === "fecha" ? (orden.asc ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 cursor-pointer" onClick={() => ordenar("usuario")}>
                Usuario {orden.campo === "usuario" ? (orden.asc ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 cursor-pointer" onClick={() => ordenar("modulo")}>
                Módulo {orden.campo === "modulo" ? (orden.asc ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 cursor-pointer" onClick={() => ordenar("accion")}>
                Acción {orden.campo === "accion" ? (orden.asc ? "▲" : "▼") : ""}
              </th>
              <th className="p-2">Descripción</th>
            </tr>
          </thead>

          <tbody>
            {auditoriaPaginada.map((a) => (
              <tr key={a.id} className="border-b">
                <td className="p-2">{a.fecha}</td>
                <td className="p-2">{a.usuario}</td>
                <td className="p-2">{a.modulo}</td>
                <td className="p-2">
                  {iconosAccion[a.accion] || iconosAccion.default} {a.accion}
                </td>
                <td className="p-2">{a.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación auditoría */}
        <div className="flex gap-3 mt-3">
          <button
            disabled={paginaAuditoria === 0}
            onClick={() => setPaginaAuditoria(paginaAuditoria - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <button
            disabled={(paginaAuditoria + 1) * 10 >= auditoriaFiltradaFinal.length}
            onClick={() => setPaginaAuditoria(paginaAuditoria + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* LOGS DEL USUARIO */}
      <div className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Logs del usuario</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-2">Fecha</th>
              <th className="p-2">Evento</th>
              <th className="p-2">Detalle</th>
              <th className="p-2">IP</th>
            </tr>
          </thead>

          <tbody>
            {logsPaginados.map((l) => (
              <tr key={l.id} className="border-b">
                <td className="p-2">{l.fecha}</td>
                <td className="p-2">{l.evento}</td>
                <td className="p-2">{l.detalle || "-"}</td>
                <td className="p-2">{l.ip || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación logs */}
        <div className="flex gap-3 mt-3">
          <button
            disabled={paginaLogs === 0}
            onClick={() => setPaginaLogs(paginaLogs - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <button
            disabled={(paginaLogs + 1) * 10 >= logsFiltrados.length}
            onClick={() => setPaginaLogs(paginaLogs + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
