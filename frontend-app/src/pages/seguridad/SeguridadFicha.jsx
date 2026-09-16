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
      className="
        w-32 h-32 rounded-2xl border border-white/20 object-cover
        shadow-lg
      "
    />

    <div className="grid grid-cols-2 gap-2 text-sm text-white">
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
      <div><strong>Rol:</strong> {empleado.rol?.nombre || "-"}</div>
    </div>
  </div>

  <div className="mt-4 flex gap-3">
    {empleado.activo ? (
      <button
        className="
          px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl
          shadow-lg transition text-sm
        "
        onClick={() => bloquear(empleado.id)}
      >
        Bloquear usuario
      </button>
    ) : (
      <button
        className="
          px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl
          shadow-lg transition text-sm
        "
        onClick={() => desbloquear(empleado.id)}
      >
        Desbloquear usuario
      </button>
    )}
  </div>
</div>

{/* SEGURIDAD */}
<div
  className="
    bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
    shadow-xl p-6 space-y-4
  "
>
  <h2 className="text-xl font-semibold text-white drop-shadow mb-3">
    Seguridad
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
          text-white shadow-lg transition text-sm
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
          text-white shadow-lg transition text-sm
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
  <button
    className="
      text-xl font-semibold text-white drop-shadow mb-3 w-full text-left
      hover:text-blue-300 transition
    "
    onClick={() => setShowModulos(!showModulos)}
  >
    Módulos visibles (editable)
  </button>

  {showModulos && (
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
            className="h-5 w-5 accent-blue-500 cursor-pointer"
          />
        </li>
      ))}
    </ul>
  )}
</div>

{/* PERMISOS POR MÓDULO */}
<div
  className="
    bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
    shadow-xl p-6
  "
>
  <button
    className="
      text-xl font-semibold text-white drop-shadow mb-3 w-full text-left
      hover:text-purple-300 transition
    "
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
                className="
                  flex items-center gap-2 text-sm bg-white/10 border border-white/20
                  rounded-xl px-3 py-2 hover:bg-white/20 transition
                "
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
        </li>
      ))}
    </ul>
  )}
</div>

{/* AUDITORÍA DEL USUARIO */}
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
      shadow-lg transition text-sm
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
        text-white focus:ring-2 focus:ring-blue-400
      "
      value={filtroFechaAud}
      onChange={(e) => {
        setFiltroFechaAud(e.target.value);
        setPaginaAud(0);
      }}
    />
  </div>

     </div>   {/* cierre del bloque LOGS */}

</div>   {/* cierre del contenedor principal p-6 space-y-6 */}

);       {/* cierre del return */}
}        {/* cierre del componente SeguridadFicha */}


       
