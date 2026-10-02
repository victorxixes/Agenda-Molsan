// frontend-app/src/pages/seguridad/SeguridadFicha.jsx

import { useEffect, useState, useMemo, useCallback } from "react";
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
    auditoria,
  } = useSeguridad();

  // ============================================================
  // ESTADOS PRINCIPALES
  // ============================================================

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [nuevoRol, setNuevoRol] = useState("");

  const [showModulos, setShowModulos] = useState(false);
  const [showPermisos, setShowPermisos] = useState(false);
  const [showAuditoria, setShowAuditoria] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  // ============================================================
  // AUDITORÍA
  // ============================================================

  const [busquedaAud, setBusquedaAud] = useState("");
  const [filtroFechaAud, setFiltroFechaAud] = useState("");
  const [paginaAud, setPaginaAud] = useState(0);

  const [ordenAud, setOrdenAud] = useState({
    campo: "fecha",
    asc: false,
  });

  const pageSizeAud = 20;

  // ============================================================
  // LOGS
  // ============================================================

  const [busquedaLog, setBusquedaLog] = useState("");
  const [filtroFechaLog, setFiltroFechaLog] = useState("");
  const [paginaLog, setPaginaLog] = useState(0);

  const [ordenLog, setOrdenLog] = useState({
    campo: "fecha",
    asc: false,
  });

  const pageSizeLog = 20;

  // ============================================================
  // CARGAR FICHA
  // ============================================================

  useEffect(() => {
    if (empleadoId) {
      cargarFicha(empleadoId);
    }
  }, [empleadoId, cargarFicha]);

  // ============================================================
  // BLINDAJE FICHA
  // ============================================================

  const fichaSegura = useMemo(() => {
    if (!ficha || typeof ficha !== "object") {
      return null;
    }

    if (
      !ficha.empleado ||
      typeof ficha.empleado !== "object"
    ) {
      return null;
    }

    return ficha;
  }, [ficha]);

  // ============================================================
  // CARGANDO
  // ============================================================

  if (!fichaSegura) {
    return (
      <div className="p-6 text-white/70 animate-pulse">
        Cargando ficha…
      </div>
    );
  }

  const empleado = fichaSegura.empleado;

  // ============================================================
  // BLINDAJE EMPLEADO
  // ============================================================

  if (
    typeof empleado.id !== "number" ||
    typeof empleado.nombre !== "string"
  ) {
    return (
      <div className="p-6 text-white/70 animate-pulse">
        Datos de empleado no válidos…
      </div>
    );
  }

  // ============================================================
  // MÓDULOS VISIBLES
  // ============================================================

  const modulosVisibles = Array.isArray(
    empleado.modulos_visibles_list
  )
    ? empleado.modulos_visibles_list.filter(
        (m) => typeof m === "string"
      )
    : [];

  // ============================================================
  // PERMISOS DEL EMPLEADO
  // ============================================================

  const permisosEmpleado =
    fichaSegura.permisos_modulo_dict &&
    typeof fichaSegura.permisos_modulo_dict === "object"
      ? fichaSegura.permisos_modulo_dict
      : {};

  // ============================================================
  // PERMISOS GLOBALES
  // ============================================================

  const permisosGlobales = useMemo(() => {
    if (!Array.isArray(permisos)) {
      return {};
    }

    return permisos.reduce((acc, p) => {
      if (!p || typeof p !== "object") {
        return acc;
      }

      if (
        typeof p.modulo !== "string" ||
        typeof p.permiso !== "string"
      ) {
        return acc;
      }

      if (!acc[p.modulo]) {
        acc[p.modulo] = [];
      }

      acc[p.modulo].push(p.permiso);

      return acc;
    }, {});
  }, [permisos]);

  // ============================================================
  // CAMBIAR PERMISO
  // ============================================================

  const cambiarPermiso = useCallback(
    (modulo, permiso) => {
      if (
        typeof modulo !== "string" ||
        typeof permiso !== "string"
      ) {
        return;
      }

      const nuevo = {
        ...permisosEmpleado,
      };

      if (!Array.isArray(nuevo[modulo])) {
        nuevo[modulo] = [];
      }

      if (nuevo[modulo].includes(permiso)) {
        nuevo[modulo] = nuevo[modulo].filter(
          (p) => p !== permiso
        );
      } else {
        nuevo[modulo] = [
          ...nuevo[modulo],
          permiso,
        ];
      }

      asignarPermisos(
        empleado.id,
        nuevo
      );
    },
    [
      permisosEmpleado,
      asignarPermisos,
      empleado.id,
    ]
  );

  // ============================================================
  // CAMBIAR MÓDULO
  // ============================================================

  const cambiarModulo = useCallback(
    (modulo) => {
      if (typeof modulo !== "string") {
        return;
      }

      let nuevo;

      if (modulosVisibles.includes(modulo)) {
        nuevo = modulosVisibles.filter(
          (m) => m !== modulo
        );
      } else {
        nuevo = [
          ...modulosVisibles,
          modulo,
        ];
      }

      asignarModulos(
        empleado.id,
        nuevo
      );
    },
    [
      modulosVisibles,
      asignarModulos,
      empleado.id,
    ]
  );

  // ============================================================
  // AUDITORÍA SEGURA
  // ============================================================

  const auditoriaSegura = useMemo(() => {
    if (!Array.isArray(auditoria)) {
      return [];
    }

    return auditoria.filter((a) => {
      if (!a || typeof a !== "object") {
        return false;
      }

      return (
        typeof a.fecha === "string" &&
        typeof a.modulo === "string" &&
        typeof a.accion === "string" &&
        typeof a.descripcion === "string"
      );
    });
  }, [auditoria]);

  // ============================================================
  // FILTRAR AUDITORÍA
  // ============================================================

  const auditoriaFiltrada = useMemo(() => {
    const texto = busquedaAud
      .trim()
      .toLowerCase();

    return auditoriaSegura.filter((a) => {
      const coincideBusqueda =
        !texto ||
        a.usuario?.toLowerCase?.().includes(texto) ||
        a.modulo.toLowerCase().includes(texto) ||
        a.accion.toLowerCase().includes(texto) ||
        a.descripcion.toLowerCase().includes(texto) ||
        a.fecha.toLowerCase().includes(texto);

      const coincideFecha = filtroFechaAud
        ? a.fecha.startsWith(filtroFechaAud)
        : true;

      return (
        coincideBusqueda &&
        coincideFecha
      );
    });
  }, [
    auditoriaSegura,
    busquedaAud,
    filtroFechaAud,
  ]);

  // ============================================================
  // ORDENAR AUDITORÍA
  // ============================================================

  const ordenarAud = useCallback((campo) => {
    setOrdenAud((prev) => ({
      campo,
      asc:
        prev.campo === campo
          ? !prev.asc
          : true,
    }));
  }, []);

  const auditoriaOrdenada = useMemo(() => {
    const {
      campo,
      asc,
    } = ordenAud;

    const direccion = asc ? 1 : -1;

    return [...auditoriaFiltrada].sort(
      (a, b) => {
        const va = String(
          a?.[campo] ?? ""
        ).toLowerCase();

        const vb = String(
          b?.[campo] ?? ""
        ).toLowerCase();

        if (va < vb) {
          return -1 * direccion;
        }

        if (va > vb) {
          return 1 * direccion;
        }

        return 0;
      }
    );
  }, [
    auditoriaFiltrada,
    ordenAud,
  ]);

  const auditoriaPaginada = useMemo(() => {
    const inicio =
      paginaAud * pageSizeAud;

    return auditoriaOrdenada.slice(
      inicio,
      inicio + pageSizeAud
    );
  }, [
    auditoriaOrdenada,
    paginaAud,
  ]);

  // ============================================================
  // LOGS SEGUROS
  // ============================================================

  const logsSeguros = useMemo(() => {
    if (!Array.isArray(logs)) {
      return [];
    }

    return logs.filter((l) => {
      if (!l || typeof l !== "object") {
        return false;
      }

      return (
        typeof l.fecha === "string" &&
        typeof l.evento === "string" &&
        typeof l.detalle === "string"
      );
    });
  }, [logs]);

  // ============================================================
  // FILTRAR LOGS
  // ============================================================

  const logsFiltrados = useMemo(() => {
    const texto = busquedaLog
      .trim()
      .toLowerCase();

    return logsSeguros.filter((l) => {
      const coincideBusqueda =
        !texto ||
        l.evento.toLowerCase().includes(texto) ||
        l.detalle.toLowerCase().includes(texto) ||
        String(l.ip || "")
          .toLowerCase()
          .includes(texto) ||
        l.fecha.toLowerCase().includes(texto);

      const coincideFecha = filtroFechaLog
        ? l.fecha.startsWith(filtroFechaLog)
        : true;

      return (
        coincideBusqueda &&
        coincideFecha
      );
    });
  }, [
    logsSeguros,
    busquedaLog,
    filtroFechaLog,
  ]);

  // ============================================================
  // ORDENAR LOGS
  // ============================================================

  const ordenarLog = useCallback((campo) => {
    setOrdenLog((prev) => ({
      campo,
      asc:
        prev.campo === campo
          ? !prev.asc
          : true,
    }));
  }, []);

  const logsOrdenados = useMemo(() => {
    const {
      campo,
      asc,
    } = ordenLog;

    const direccion = asc ? 1 : -1;

    return [...logsFiltrados].sort(
      (a, b) => {
        const va = String(
          a?.[campo] ?? ""
        ).toLowerCase();

        const vb = String(
          b?.[campo] ?? ""
        ).toLowerCase();

        if (va < vb) {
          return -1 * direccion;
        }

        if (va > vb) {
          return 1 * direccion;
        }

        return 0;
      }
    );
  }, [
    logsFiltrados,
    ordenLog,
  ]);

  const logsPaginados = useMemo(() => {
    const inicio =
      paginaLog * pageSizeLog;

    return logsOrdenados.slice(
      inicio,
      inicio + pageSizeLog
    );
  }, [
    logsOrdenados,
    paginaLog,
  ]);

  // ============================================================
  // ICONOS AUDITORÍA
  // ============================================================

  const iconosAccion = useMemo(
    () => ({
      login: "🔐",
      login_error: "⚠️",
      acceso: "📥",
      update: "✏️",
      delete: "🗑️",
      permiso: "🔧",
      modulo: "📦",
      create: "➕",
      logout: "🚪",
      default: "📄",
    }),
    []
  );

  // ============================================================
  // ICONOS LOGS
  // ============================================================

  const iconosEvento = useMemo(
    () => ({
      login: "🔐",
      login_error: "⚠️",
      logout: "🚪",
      acceso: "📥",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
      update: "✏️",
      delete: "🗑️",
      create: "➕",
      default: "📄",
    }),
    []
  );

  // ============================================================
  // DESCARGAR AUDITORÍA
  // ============================================================

  const descargarExcelAuditoria = useCallback(() => {
    const encabezados = [
      "ID",
      "Usuario",
      "Módulo",
      "Acción",
      "Descripción",
      "Fecha",
    ];

    const filas =
      auditoriaOrdenada.map((a) => [
        a.id ?? "",
        a.usuario ?? "",
        a.modulo ?? "",
        a.accion ?? "",
        a.descripcion ?? "",
        a.fecha ?? "",
      ]);

    const contenido = [
      encabezados,
      ...filas,
    ]
      .map((fila) =>
        fila
          .map((valor) =>
            `"${String(valor).replaceAll(
              '"',
              '""'
            )}"`
          )
          .join(";")
      )
      .join("\n");

    const blob = new Blob(
      ["\ufeff", contenido],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const enlace =
      document.createElement("a");

    enlace.href = url;
    enlace.download =
      `auditoria_${empleado.usuario || empleado.id}.csv`;

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    URL.revokeObjectURL(url);
  }, [
    auditoriaOrdenada,
    empleado.usuario,
    empleado.id,
  ]);

  // ============================================================
  // DESCARGAR LOGS
  // ============================================================

  const descargarExcelLogs = useCallback(() => {
    const encabezados = [
      "ID",
      "Fecha",
      "Evento",
      "Detalle",
      "IP",
    ];

    const filas =
      logsOrdenados.map((l) => [
        l.id ?? "",
        l.fecha ?? "",
        l.evento ?? "",
        l.detalle ?? "",
        l.ip ?? "",
      ]);

    const contenido = [
      encabezados,
      ...filas,
    ]
      .map((fila) =>
        fila
          .map((valor) =>
            `"${String(valor).replaceAll(
              '"',
              '""'
            )}"`
          )
          .join(";")
      )
      .join("\n");

    const blob = new Blob(
      ["\ufeff", contenido],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const enlace =
      document.createElement("a");

    enlace.href = url;
    enlace.download =
      `logs_${empleado.usuario || empleado.id}.csv`;

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    URL.revokeObjectURL(url);
  }, [
    logsOrdenados,
    empleado.usuario,
    empleado.id,
  ]);

  // ============================================================
  // RESET PASSWORD
  // ============================================================

  const ejecutarResetPassword = useCallback(() => {
    const password =
      nuevaPassword.trim();

    if (
      typeof empleado.id !== "number" ||
      !password
    ) {
      return;
    }

    resetPassword(
      empleado.id,
      password
    );

    setNuevaPassword("");
  }, [
    empleado.id,
    nuevaPassword,
    resetPassword,
  ]);

  // ============================================================
  // ASIGNAR ROL
  // ============================================================

  const ejecutarAsignarRol = useCallback(() => {
    const rolNum =
      Number(nuevoRol);

    if (
      !Number.isFinite(rolNum) ||
      typeof empleado.id !== "number"
    ) {
      return;
    }

    asignarRol(
      empleado.id,
      rolNum
    );

    setNuevoRol("");
  }, [
    empleado.id,
    nuevoRol,
    asignarRol,
  ]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="p-6 space-y-8 text-white animate-fade-in">

      {/* ======================================================
          CABECERA
      ====================================================== */}

      <div
        className="
          bg-white/10 backdrop-blur-xl
          border border-white/20 rounded-2xl
          shadow-xl p-6
        "
      >
        <h1 className="text-3xl font-bold text-white drop-shadow mb-6">
          Ficha de seguridad — SJ-2026
          <span className="text-white/50">
            {" "}·{" "}
          </span>
          {empleado.nombre}
          <span className="text-white/50">
            {" "}
            ({empleado.usuario || "-"})
          </span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">

          <img
            src={
              typeof empleado.foto === "string"
                ? empleado.foto
                : "/no-foto.png"
            }
            alt="Foto empleado"
            className="
              w-32 h-32 rounded-xl
              border border-white/20
              object-cover shadow-lg
            "
          />

          <div
            className="
              grid grid-cols-1
              md:grid-cols-2
              gap-x-10 gap-y-3
              text-white/90 text-sm
              flex-1
            "
          >
            <div>
              <strong>ID:</strong>{" "}
              {empleado.id}
            </div>

            <div>
              <strong>Usuario:</strong>{" "}
              {empleado.usuario || "-"}
            </div>

            <div>
              <strong>Nombre:</strong>{" "}
              {empleado.nombre}
            </div>

            <div>
              <strong>Apellidos:</strong>{" "}
              {empleado.apellidos || "-"}
            </div>

            <div>
              <strong>DNI:</strong>{" "}
              {empleado.dni || "-"}
            </div>

            <div>
              <strong>Email:</strong>{" "}
              {empleado.email_empresa || "-"}
            </div>

            <div>
              <strong>Activo:</strong>{" "}

              {empleado.activo ? (
                <span className="text-green-400 font-semibold">
                  Sí
                </span>
              ) : (
                <span className="text-red-400 font-semibold">
                  No
                </span>
              )}
            </div>

            <div>
              <strong>Rol:</strong>{" "}
              {empleado.rol_nombre || "-"}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">

          {empleado.activo ? (
            <button
              className="
                px-4 py-2 rounded-xl
                bg-red-600 hover:bg-red-700
                text-white shadow-lg
                transition active:scale-[0.97]
              "
              onClick={() =>
                bloquear(empleado.id)
              }
            >
              🔒 Bloquear usuario
            </button>
          ) : (
            <button
              className="
                px-4 py-2 rounded-xl
                bg-green-600 hover:bg-green-700
                text-white shadow-lg
                transition active:scale-[0.97]
              "
              onClick={() =>
                desbloquear(empleado.id)
              }
            >
              🔓 Desbloquear usuario
            </button>
          )}
        </div>
      </div>

      {/* ======================================================
          SEGURIDAD DEL USUARIO
      ====================================================== */}

      <div
        className="
          bg-white/10 backdrop-blur-xl
          border border-white/20 rounded-2xl
          shadow-xl p-6 space-y-6
        "
      >
        <h2 className="text-xl font-semibold text-white drop-shadow">
          Seguridad del usuario
        </h2>

        {/* RESET PASSWORD */}

        <div>
          <label className="block text-sm mb-2 text-white/80">
            Nueva contraseña
          </label>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="password"
              className="
                flex-1
                bg-white/10
                border border-white/20
                rounded-xl px-3 py-2
                text-white
                placeholder-white/40
                focus:ring-2
                focus:ring-blue-400
                transition
              "
              placeholder="Introducir nueva contraseña"
              value={nuevaPassword}
              onChange={(e) =>
                setNuevaPassword(
                  e.target.value
                )
              }
            />

            <button
              className="
                px-4 py-2
                rounded-xl
                bg-blue-600
                hover:bg-blue-700
                text-white
                shadow-lg
                transition
                active:scale-[0.97]
              "
              onClick={
                ejecutarResetPassword
              }
            >
              🔑 Resetear contraseña
            </button>
          </div>
        </div>

        {/* ASIGNAR ROL */}

        <div>
          <label className="block text-sm mb-2 text-white/80">
            Nuevo rol (ID)
          </label>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="number"
              className="
                flex-1
                bg-white/10
                border border-white/20
                rounded-xl px-3 py-2
                text-white
                focus:ring-2
                focus:ring-purple-400
                transition
              "
              placeholder="ID del rol"
              value={nuevoRol}
              onChange={(e) =>
                setNuevoRol(
                  e.target.value
                )
              }
            />

            <button
              className="
                px-4 py-2
                rounded-xl
                bg-purple-600
                hover:bg-purple-700
                text-white
                shadow-lg
                transition
                active:scale-[0.97]
              "
              onClick={
                ejecutarAsignarRol
              }
            >
              👤 Asignar rol
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================
          MÓDULOS VISIBLES
      ====================================================== */}

      <div
        className="
          bg-white/10 backdrop-blur-xl
          border border-white/20 rounded-2xl
          shadow-xl p-6
        "
      >
        <button
          className="
            text-xl font-semibold
            text-white drop-shadow
            w-full text-left
            hover:text-blue-300
            transition
          "
          onClick={() =>
            setShowModulos(
              (prev) => !prev
            )
          }
        >
          <span className="mr-2">
            {showModulos ? "▼" : "▶"}
          </span>

          Módulos visibles
          <span className="text-white/50 text-sm ml-2">
            ({modulosVisibles.length})
          </span>
        </button>

        {showModulos && (
          <div className="mt-5">
            <ul className="space-y-3">

              {Object.keys(
                permisosGlobales || {}
              ).map((modulo) => {

                const visible =
                  modulosVisibles.includes(
                    modulo
                  );

                return (
                  <li
                    key={modulo}
                    className="
                      flex items-center
                      justify-between
                      bg-white/5
                      border border-white/10
                      rounded-xl
                      px-4 py-3
                      hover:bg-white/10
                      transition
                    "
                  >
                    <span className="font-medium">
                      {modulo}
                    </span>

                    <input
                      type="checkbox"
                      checked={visible}
                      onChange={() =>
                        cambiarModulo(
                          modulo
                        )
                      }
                      className="
                        h-5 w-5
                        accent-blue-500
                        cursor-pointer
                      "
                    />
                  </li>
                );
              })}

            {Object.keys(
              permisosGlobales || {}
            ).length === 0 && (
              <p className="text-white/50 text-sm">
                No hay módulos disponibles.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ======================================================
          PERMISOS POR MÓDULO
      ====================================================== */}

      <div
        className="
          bg-white/10 backdrop-blur-xl
          border border-white/20 rounded-2xl
          shadow-xl p-6
        "
      >
        <button
          className="
            text-xl font-semibold
            text-white drop-shadow
            w-full text-left
            hover:text-purple-300
            transition
          "
          onClick={() =>
            setShowPermisos(
              (prev) => !prev
            )
          }
        >
          <span className="mr-2">
            {showPermisos ? "▼" : "▶"}
          </span>

          Permisos por módulo
        </button>

        {showPermisos && (
          <ul className="space-y-6 mt-5">

            {Object.entries(
              permisosGlobales || {}
            ).map(
              ([
                modulo,
                permsDisponibles,
              ]) => {

                const listaPerms =
                  Array.isArray(
                    permsDisponibles
                  )
                    ? permsDisponibles
                    : [];

                return (
                  <li key={modulo}>

                    <strong className="text-lg">
                      {modulo}
                    </strong>

                    <div
                      className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-4
                        gap-3
                        mt-3
                      "
                    >
                      {listaPerms.map(
                        (perm) => {

                          const checked =
                            Array.isArray(
                              permisosEmpleado[
                                modulo
                              ]
                            )
                              ? permisosEmpleado[
                                  modulo
                                ].includes(
                                  perm
                                )
                              : false;

                          return (
                            <label
                              key={`${modulo}-${perm}`}
                              className="
                                flex
                                items-center
                                gap-2
                                text-sm
                                bg-white/10
                                border
                                border-white/20
                                rounded-xl
                                px-3 py-2
                                hover:bg-white/20
                                transition
                                cursor-pointer
                              "
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  cambiarPermiso(
                                    modulo,
                                    perm
                                  )
                                }
                                className="
                                  accent-purple-500
                                  h-4 w-4
                                  cursor-pointer
                                "
                              />

                              <span>
                                {perm}
                              </span>
                            </label>
                          );
                        }
                      )}
                    </div>
                  </li>
                );
              }
            )}

            {Object.keys(
              permisosGlobales || {}
            ).length === 0 && (
              <li className="text-white/50 text-sm">
                No hay permisos disponibles.
              </li>
            )}
          </ul>
        )}
      </div>

      {/* ======================================================
          AUDITORÍA DEL USUARIO
      ====================================================== */}

      <div
        className="
          bg-white/10 backdrop-blur-xl
          border border-white/20 rounded-2xl
          shadow-xl p-6 space-y-4
        "
      >
        <button
          className="
            text-xl font-semibold
            text-white drop-shadow
            w-full text-left
            hover:text-green-300
            transition
          "
          onClick={() =>
            setShowAuditoria(
              (prev) => !prev
            )
          }
        >
          <span className="mr-2">
            {showAuditoria ? "▼" : "▶"}
          </span>

          Auditoría del usuario

          <span className="text-white/50 text-sm ml-2">
            ({auditoriaOrdenada.length})
          </span>
        </button>

        {showAuditoria && (
          <div className="space-y-4">

            <button
              onClick={
                descargarExcelAuditoria
              }
              className="
                px-4 py-2
                bg-green-600
                hover:bg-green-700
                text-white
                rounded-xl
                shadow-lg
                transition
                text-sm
                active:scale-[0.97]
              "
            >
              📊 Descargar auditoría
            </button>

            {/* FILTROS */}

            <div className="flex flex-col md:flex-row gap-4">

              <input
                type="text"
                className="
                  w-full md:w-1/2
                  bg-white/10
                  border border-white/20
                  rounded-xl px-3 py-2
                  text-white
                  placeholder-white/40
                  focus:ring-2
                  focus:ring-blue-400
                  transition
                "
                placeholder="Buscar por módulo, acción o descripción..."
                value={busquedaAud}
                onChange={(e) => {
                  setBusquedaAud(
                    e.target.value
                  );
                  setPaginaAud(0);
                }}
              />

              <input
                type="date"
                className="
                  w-full md:w-1/3
                  bg-white/10
                  border border-white/20
                  rounded-xl px-3 py-2
                  text-white
                  focus:ring-2
                  focus:ring-blue-400
                  transition
                "
                value={filtroFechaAud}
                onChange={(e) => {
                  setFiltroFechaAud(
                    e.target.value
                  );
                  setPaginaAud(0);
                }}
              />
            </div>

            {/* TABLA */}

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white">

                <thead className="bg-white/10 border-b border-white/20">
                  <tr>

                    <th
                      className="p-3 text-left cursor-pointer hover:text-blue-300 transition"
                      onClick={() =>
                        ordenarAud(
                          "fecha"
                        )
                      }
                    >
                      Fecha{" "}
                      {ordenAud.campo ===
                      "fecha"
                        ? ordenAud.asc
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>

                    <th
                      className="p-3 text-left cursor-pointer hover:text-blue-300 transition"
                      onClick={() =>
                        ordenarAud(
                          "modulo"
                        )
                      }
                    >
                      Módulo{" "}
                      {ordenAud.campo ===
                      "modulo"
                        ? ordenAud.asc
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>

                    <th
                      className="p-3 text-left cursor-pointer hover:text-blue-300 transition"
                      onClick={() =>
                        ordenarAud(
                          "accion"
                        )
                      }
                    >
                      Acción{" "}
                      {ordenAud.campo ===
                      "accion"
                        ? ordenAud.asc
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>

                    <th className="p-3 text-left">
                      Descripción
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {auditoriaPaginada.map(
                    (a) => {

                      const key =
                        a.id ??
                        `${a.fecha}-${a.modulo}-${a.accion}`;

                      return (
                        <tr
                          key={String(
                            key
                          )}
                          className="
                            border-b
                            border-white/10
                            hover:bg-white/5
                            transition
                          "
                        >

                          <td className="p-3">
                            {a.fecha || "-"}
                          </td>

                          <td className="p-3">
                            {a.modulo || "-"}
                          </td>

                          <td className="p-3">
                            {iconosAccion[
                              a.accion
                            ] ||
                              iconosAccion.default}{" "}
                            {a.accion || "-"}
                          </td>

                          <td className="p-3">
                            {a.descripcion ||
                              "-"}
                          </td>

                        </tr>
                      );
                    }
                  )}

                  {auditoriaPaginada.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="
                          p-6
                          text-center
                          text-white/50
                        "
                      >
                        No hay registros de
                        auditoría.
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>

            {/* PAGINACIÓN */}

            <div className="flex items-center gap-3 mt-4">

              <button
                disabled={
                  paginaAud === 0
                }
                onClick={() =>
                  setPaginaAud(
                    (prev) =>
                      Math.max(
                        prev - 1,
                        0
                      )
                  )
                }
                className="
                  px-3 py-1
                  bg-white/10
                  border border-white/20
                  rounded-xl
                  disabled:opacity-40
                  hover:bg-white/20
                  transition
                "
              >
                ← Anterior
              </button>

              <span className="text-sm text-white/70">
                Página {paginaAud + 1}
              </span>

              <button
                disabled={
                  (paginaAud + 1) *
                    pageSizeAud >=
                  auditoriaOrdenada.length
                }
                onClick={() =>
                  setPaginaAud(
                    (prev) =>
                      prev + 1
                  )
                }
                className="
                  px-3 py-1
                  bg-white/10
                  border border-white/20
                  rounded-xl
                  disabled:opacity-40
                  hover:bg-white/20
                  transition
                "
              >
                Siguiente →
              </button>

            </div>
          </div>
        )}
      </div>

      {/* ======================================================
          LOGS DEL USUARIO
      ====================================================== */}

      <div
        className="
          bg-white/10 backdrop-blur-xl
          border border-white/20 rounded-2xl
          shadow-xl p-6 space-y-4
        "
      >
        <button
          className="
            text-xl font-semibold
            text-white drop-shadow
            w-full text-left
            hover:text-purple-300
            transition
          "
          onClick={() =>
            setShowLogs(
              (prev) => !prev
            )
          }
        >
          <span className="mr-2">
            {showLogs ? "▼" : "▶"}
          </span>

          Logs del usuario

          <span className="text-white/50 text-sm ml-2">
            ({logsOrdenados.length})
          </span>
        </button>

        {showLogs && (
          <div className="space-y-4">

            <button
              onClick={
                descargarExcelLogs
              }
              className="
                px-4 py-2
                bg-green-600
                hover:bg-green-700
                text-white
                rounded-xl
                shadow-lg
                transition
                text-sm
                active:scale-[0.97]
              "
            >
              📊 Descargar logs
            </button>

            {/* FILTROS */}

            <div className="flex flex-col md:flex-row gap-4">

              <input
                type="text"
                className="
                  w-full md:w-1/2
                  bg-white/10
                  border border-white/20
                  rounded-xl px-3 py-2
                  text-white
                  placeholder-white/40
                  focus:ring-2
                  focus:ring-purple-400
                  transition
                "
                placeholder="Buscar por evento, detalle, IP o fecha..."
                value={busquedaLog}
                onChange={(e) => {
                  setBusquedaLog(
                    e.target.value
                  );
                  setPaginaLog(0);
                }}
              />

              <input
                type="date"
                className="
                  w-full md:w-1/3
                  bg-white/10
                  border border-white/20
                  rounded-xl px-3 py-2
                  text-white
                  focus:ring-2
                  focus:ring-purple-400
                  transition
                "
                value={filtroFechaLog}
                onChange={(e) => {
                  setFiltroFechaLog(
                    e.target.value
                  );
                  setPaginaLog(0);
                }}
              />
            </div>

            {/* TABLA LOGS */}

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white">

                <thead className="bg-white/10 border-b border-white/20">
                  <tr>

                    <th
                      className="
                        p-3
                        text-left
                        cursor-pointer
                        hover:text-purple-300
                        transition
                      "
                      onClick={() =>
                        ordenarLog(
                          "fecha"
                        )
                      }
                    >
                      Fecha{" "}
                      {ordenLog.campo ===
                      "fecha"
                        ? ordenLog.asc
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>

                    <th
                      className="
                        p-3
                        text-left
                        cursor-pointer
                        hover:text-purple-300
                        transition
                      "
                      onClick={() =>
                        ordenarLog(
                          "evento"
                        )
                      }
                    >
                      Evento{" "}
                      {ordenLog.campo ===
                      "evento"
                        ? ordenLog.asc
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>

                    <th className="p-3 text-left">
                      Detalle
                    </th>

                    <th className="p-3 text-left">
                      IP
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {logsPaginados.map(
                    (l) => {

                      const key =
                        l.id ??
                        `${l.fecha}-${l.evento}-${l.detalle}`;

                      return (
                        <tr
                          key={String(
                            key
                          )}
                          className="
                            border-b
                            border-white/10
                            hover:bg-white/5
                            transition
                          "
                        >

                          <td className="p-3">
                            {l.fecha || "-"}
                          </td>

                          <td className="p-3">
                            {iconosEvento[
                              l.evento
                            ] ||
                              iconosEvento.default}{" "}
                            {l.evento || "-"}
                          </td>

                          <td className="p-3">
                            {l.detalle || "-"}
                          </td>

                          <td className="p-3">
                            {l.ip || "-"}
                          </td>

                        </tr>
                      );
                    }
                  )}

                  {logsPaginados.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="
                          p-6
                          text-center
                          text-white/50
                        "
                      >
                        No hay registros de
                        logs.
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>

            {/* PAGINACIÓN */}

            <div className="flex items-center gap-3 mt-4">

              <button
                disabled={
                  paginaLog === 0
                }
                onClick={() =>
                  setPaginaLog(
                    (prev) =>
                      Math.max(
                        prev - 1,
                        0
                      )
                  )
                }
                className="
                  px-3 py-1
                  bg-white/10
                  border border-white/20
                  rounded-xl
                  disabled:opacity-40
                  hover:bg-white/20
                  transition
                "
              >
                ← Anterior
              </button>

              <span className="text-sm text-white/70">
                Página {paginaLog + 1}
              </span>

              <button
                disabled={
                  (paginaLog + 1) *
                    pageSizeLog >=
                  logsOrdenados.length
                }
                onClick={() =>
                  setPaginaLog(
                    (prev) =>
                      prev + 1
                  )
                }
                className="
                  px-3 py-1
                  bg-white/10
                  border border-white/20
                  rounded-xl
                  disabled:opacity-40
                  hover:bg-white/20
                  transition
                "
              >
                Siguiente →
              </button>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
