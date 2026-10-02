import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

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
  // ESTADOS
  // ============================================================

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [nuevoRol, setNuevoRol] = useState("");

  const [showModulos, setShowModulos] = useState(true);
  const [showPermisos, setShowPermisos] = useState(true);
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
  // FICHA SEGURA
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
  // EMPLEADO
  // ============================================================

  const empleado = fichaSegura?.empleado || null;

  const empleadoValido =
    empleado &&
    typeof empleado === "object" &&
    typeof empleado.id === "number" &&
    typeof empleado.nombre === "string";

  // ============================================================
  // ROL
  // ============================================================

  const nombreRol = useMemo(() => {
    if (!empleadoValido) {
      return "-";
    }

    if (
      empleado.rol &&
      typeof empleado.rol === "object" &&
      typeof empleado.rol.nombre === "string"
    ) {
      return empleado.rol.nombre;
    }

    return "-";
  }, [empleadoValido, empleado]);

  // ============================================================
  // MÓDULOS VISIBLES
  // ============================================================

  const modulosVisibles = useMemo(() => {
    if (!fichaSegura) {
      return [];
    }

    if (!Array.isArray(fichaSegura.modulos_visibles)) {
      return [];
    }

    return fichaSegura.modulos_visibles.filter(
      (modulo) => typeof modulo === "string"
    );
  }, [fichaSegura]);

  // ============================================================
  // PERMISOS DEL EMPLEADO
  // ============================================================

  const permisosEmpleado = useMemo(() => {
    if (
      !fichaSegura ||
      !fichaSegura.permisos_modulo ||
      typeof fichaSegura.permisos_modulo !== "object" ||
      Array.isArray(fichaSegura.permisos_modulo)
    ) {
      return {};
    }

    return fichaSegura.permisos_modulo;
  }, [fichaSegura]);

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

      if (!acc[p.modulo].includes(p.permiso)) {
        acc[p.modulo].push(p.permiso);
      }

      return acc;
    }, {});
  }, [permisos]);

  // ============================================================
  // MÓDULOS DISPONIBLES
  // ============================================================

  const modulosDisponibles = useMemo(() => {
    const conjunto = new Set();

    Object.keys(permisosGlobales || {}).forEach(
      (modulo) => {
        if (typeof modulo === "string") {
          conjunto.add(modulo);
        }
      }
    );

    modulosVisibles.forEach((modulo) => {
      if (typeof modulo === "string") {
        conjunto.add(modulo);
      }
    });

    return Array.from(conjunto).sort(
      (a, b) =>
        a.localeCompare(b, "es", {
          sensitivity: "base",
        })
    );
  }, [
    permisosGlobales,
    modulosVisibles,
  ]);

  // ============================================================
  // CAMBIAR PERMISO
  // ============================================================

  const cambiarPermiso = useCallback(
    async (modulo, permiso) => {
      if (
        !empleadoValido ||
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

      try {
        await asignarPermisos(
          empleado.id,
          nuevo
        );

        await cargarFicha(empleado.id);
      } catch (error) {
        console.error(
          "Error asignando permiso:",
          error
        );
      }
    },
    [
      empleadoValido,
      empleado,
      permisosEmpleado,
      asignarPermisos,
      cargarFicha,
    ]
  );

  // ============================================================
  // CAMBIAR MÓDULO
  // ============================================================

  const cambiarModulo = useCallback(
    async (modulo) => {
      if (
        !empleadoValido ||
        typeof modulo !== "string"
      ) {
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

      try {
        await asignarModulos(
          empleado.id,
          nuevo
        );

        await cargarFicha(empleado.id);
      } catch (error) {
        console.error(
          "Error asignando módulo:",
          error
        );
      }
    },
    [
      empleadoValido,
      empleado,
      modulosVisibles,
      asignarModulos,
      cargarFicha,
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
        String(a.usuario || "")
          .toLowerCase()
          .includes(texto) ||
        String(a.modulo || "")
          .toLowerCase()
          .includes(texto) ||
        a.accion
          .toLowerCase()
          .includes(texto) ||
        a.descripcion
          .toLowerCase()
          .includes(texto) ||
        a.fecha
          .toLowerCase()
          .includes(texto);

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

  const ordenarAud = useCallback(
    (campo) => {
      setOrdenAud((prev) => ({
        campo,
        asc:
          prev.campo === campo
            ? !prev.asc
            : true,
      }));
    },
    []
  );

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

  // ============================================================
  // PAGINAR AUDITORÍA
  // ============================================================

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
        l.evento
          .toLowerCase()
          .includes(texto) ||
        l.detalle
          .toLowerCase()
          .includes(texto) ||
        String(l.ip || "")
          .toLowerCase()
          .includes(texto) ||
        l.fecha
          .toLowerCase()
          .includes(texto);

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

  const ordenarLog = useCallback(
    (campo) => {
      setOrdenLog((prev) => ({
        campo,
        asc:
          prev.campo === campo
            ? !prev.asc
            : true,
      }));
    },
    []
  );

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

  // ============================================================
  // PAGINAR LOGS
  // ============================================================

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
  // ICONOS
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
  // EXPORTAR AUDITORÍA
  // ============================================================

  const descargarExcelAuditoria =
    useCallback(() => {
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
            .map(
              (valor) =>
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
      enlace.download = `auditoria_${
        empleado?.usuario ||
        empleado?.id ||
        "empleado"
      }.csv`;

      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();

      URL.revokeObjectURL(url);
    }, [
      auditoriaOrdenada,
      empleado,
    ]);

  // ============================================================
  // EXPORTAR LOGS
  // ============================================================

  const descargarExcelLogs =
    useCallback(() => {
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
            .map(
              (valor) =>
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
      enlace.download = `logs_${
        empleado?.usuario ||
        empleado?.id ||
        "empleado"
      }.csv`;

      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();

      URL.revokeObjectURL(url);
    }, [
      logsOrdenados,
      empleado,
    ]);

  // ============================================================
  // RESET PASSWORD
  // ============================================================

  const ejecutarResetPassword =
    useCallback(async () => {
      const password =
        nuevaPassword.trim();

      if (
        !empleadoValido ||
        !password
      ) {
        return;
      }

      try {
        await resetPassword(
          empleado.id,
          password
        );

        setNuevaPassword("");
      } catch (error) {
        console.error(
          "Error reseteando contraseña:",
          error
        );
      }
    }, [
      empleadoValido,
      empleado,
      nuevaPassword,
      resetPassword,
    ]);

  // ============================================================
  // ASIGNAR ROL
  // ============================================================

  const ejecutarAsignarRol =
    useCallback(async () => {
      const rolNum =
        Number(nuevoRol);

      if (
        !Number.isFinite(rolNum) ||
        !empleadoValido
      ) {
        return;
      }

      try {
        await asignarRol(
          empleado.id,
          rolNum
        );

        setNuevoRol("");

        await cargarFicha(empleado.id);
      } catch (error) {
        console.error(
          "Error asignando rol:",
          error
        );
      }
    }, [
      empleadoValido,
      empleado,
      nuevoRol,
      asignarRol,
      cargarFicha,
    ]);

  // ============================================================
  // CARGANDO
  // ============================================================

  if (!fichaSegura) {
    return (
      <div className="w-full p-6 text-white">
        <div
          className="
            rounded-3xl
            border border-white/10
            bg-white/[0.05]
            backdrop-blur-2xl
            p-8
            shadow-[0_20px_70px_rgba(0,0,0,0.25)]
          "
        >
          <div className="animate-pulse">
            <div className="h-8 w-72 rounded-lg bg-white/10" />
            <div className="mt-4 h-4 w-96 max-w-full rounded bg-white/10" />
            <div className="mt-8 h-32 rounded-2xl bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // EMPLEADO INVÁLIDO
  // ============================================================

  if (!empleadoValido) {
    return (
      <div className="w-full p-6 text-white">
        <div
          className="
            rounded-3xl
            border border-red-400/20
            bg-red-500/10
            p-8
            text-red-200
          "
        >
          No se han podido cargar los datos de seguridad del empleado.
        </div>
      </div>
    );
  }

  // ============================================================
  // MÉTRICAS
  // ============================================================

  const totalPermisos = Object.values(
    permisosEmpleado || {}
  ).reduce(
    (total, lista) =>
      total +
      (Array.isArray(lista)
        ? lista.length
        : 0),
    0
  );

  const totalAuditoria =
    auditoriaOrdenada.length;

  const totalLogs =
    logsOrdenados.length;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="
        w-full
        space-y-6
        text-white
        animate-fade-in
      "
    >

      {/* ======================================================
          CABECERA PRINCIPAL
      ====================================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-3xl
          border border-white/15
          bg-white/[0.06]
          backdrop-blur-2xl
          shadow-[0_20px_70px_rgba(0,0,0,0.28)]
          p-6
        "
      >

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            left-1/3
            h-56
            w-56
            rounded-full
            bg-purple-500/10
            blur-3xl
          "
        />

        <div className="relative">

          <div
            className="
              flex
              flex-col
              gap-5
              xl:flex-row
              xl:items-center
              xl:justify-between
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border border-white/15
                  bg-white/10
                  text-2xl
                  shadow-lg
                "
              >
                🛡️
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300/80">
                  Centro de seguridad
                </div>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Ficha de seguridad
                </h1>

                <p className="mt-1 text-sm text-white/50">
                  Control de acceso, credenciales, permisos y trazabilidad del empleado.
                </p>
              </div>

            </div>

            <div
              className={`
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                px-4
                py-2
                text-xs
                font-semibold
                ${
                  empleado.activo
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : "border-red-400/20 bg-red-400/10 text-red-300"
                }
              `}
            >

              <span
                className={`
                  h-2
                  w-2
                  rounded-full
                  ${
                    empleado.activo
                      ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                      : "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]"
                  }
                `}
              />

              {empleado.activo
                ? "CUENTA ACTIVA"
                : "CUENTA BLOQUEADA"}

            </div>

          </div>

          {/* PERFIL */}

          <div
            className="
              mt-7
              grid
              grid-cols-1
              gap-6
              xl:grid-cols-[auto_1fr]
            "
          >

            <div className="flex justify-center xl:justify-start">

              <div className="relative">

                <img
                  src={
                    typeof empleado.foto === "string" &&
                    empleado.foto !== "-"
                      ? empleado.foto
                      : "/no-foto.png"
                  }
                  alt="Foto empleado"
                  className="
                    h-32
                    w-32
                    rounded-3xl
                    border
                    border-white/15
                    object-cover
                    bg-white/10
                    shadow-2xl
                  "
                />

                <span
                  className={`
                    absolute
                    -bottom-2
                    -right-2
                    rounded-full
                    border-4
                    border-slate-900/70
                    px-3
                    py-1
                    text-[10px]
                    font-bold
                    ${
                      empleado.activo
                        ? "bg-emerald-400 text-emerald-950"
                        : "bg-red-400 text-red-950"
                    }
                  `}
                >
                  {empleado.activo
                    ? "ACTIVO"
                    : "BLOQUEADO"}
                </span>

              </div>

            </div>

            <div>

              <div className="flex flex-col gap-1">

                <h2 className="text-2xl font-bold text-white">
                  {empleado.nombre}
                  {empleado.apellidos
                    ? ` ${empleado.apellidos}`
                    : ""}
                </h2>

                <div className="text-sm text-white/50">
                  @{empleado.usuario || "-"}
                </div>

              </div>

              <div
                className="
                  mt-5
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                  lg:grid-cols-4
                "
              >

                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <div className="text-[11px] uppercase tracking-wider text-white/40">
                    ID empleado
                  </div>
                  <div className="mt-1 font-semibold text-white">
                    {empleado.id}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <div className="text-[11px] uppercase tracking-wider text-white/40">
                    DNI
                  </div>
                  <div className="mt-1 font-semibold text-white">
                    {empleado.dni || "-"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <div className="text-[11px] uppercase tracking-wider text-white/40">
                    Rol
                  </div>
                  <div className="mt-1 font-semibold text-blue-300">
                    {nombreRol}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <div className="text-[11px] uppercase tracking-wider text-white/40">
                    Estado
                  </div>
                  <div
                    className={`
                      mt-1
                      font-semibold
                      ${
                        empleado.activo
                          ? "text-emerald-300"
                          : "text-red-300"
                      }
                    `}
                  >
                    {empleado.activo
                      ? "Operativo"
                      : "Bloqueado"}
                  </div>
                </div>

              </div>

              <div className="mt-4 text-sm text-white/60">
                <span className="text-white/40">
                  Email:
                </span>{" "}
                {empleado.email_empresa || "-"}
              </div>

            </div>

          </div>

          {/* ACCIONES */}

          <div
            className="
              relative
              mt-7
              flex
              flex-wrap
              gap-3
              border-t
              border-white/10
              pt-5
            "
          >

            {empleado.activo ? (
              <button
                type="button"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-red-400/20
                  bg-red-500/10
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-red-300
                  transition
                  hover:bg-red-500/20
                  active:scale-[0.97]
                "
                onClick={() =>
                  bloquear(empleado.id)
                }
              >
                🔒 Bloquear usuario
              </button>
            ) : (
              <button
                type="button"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-emerald-400/20
                  bg-emerald-500/10
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-emerald-300
                  transition
                  hover:bg-emerald-500/20
                  active:scale-[0.97]
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

      </section>

      {/* ======================================================
          RESUMEN DE SEGURIDAD
      ====================================================== */}

      <section
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Módulos
            </span>
            <span className="text-xl">📦</span>
          </div>

          <div className="mt-3 text-3xl font-bold text-white">
            {modulosVisibles.length}
          </div>

          <div className="mt-1 text-xs text-white/40">
            módulos visibles
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Permisos
            </span>
            <span className="text-xl">🔧</span>
          </div>

          <div className="mt-3 text-3xl font-bold text-white">
            {totalPermisos}
          </div>

          <div className="mt-1 text-xs text-white/40">
            permisos asignados
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Auditoría
            </span>
            <span className="text-xl">📊</span>
          </div>

          <div className="mt-3 text-3xl font-bold text-white">
            {totalAuditoria}
          </div>

          <div className="mt-1 text-xs text-white/40">
            eventos registrados
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Logs
            </span>
            <span className="text-xl">📝</span>
          </div>

          <div className="mt-3 text-3xl font-bold text-white">
            {totalLogs}
          </div>

          <div className="mt-1 text-xs text-white/40">
            registros técnicos
          </div>
        </div>

      </section>

      {/* ======================================================
          CREDENCIALES
      ====================================================== */}

      <section
        className="
          rounded-3xl
          border border-white/10
          bg-white/[0.05]
          p-6
          backdrop-blur-2xl
          shadow-[0_20px_70px_rgba(0,0,0,0.22)]
        "
      >

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10 text-xl">
            🔐
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Credenciales y acceso
            </h2>

            <p className="mt-1 text-sm text-white/45">
              Operaciones sensibles sobre la cuenta del empleado.
            </p>
          </div>

        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">

          {/* PASSWORD */}

          <div
            className="
              rounded-2xl
              border border-white/10
              bg-black/10
              p-5
            "
          >

            <div className="text-sm font-semibold text-white">
              🔑 Restablecer contraseña
            </div>

            <p className="mt-1 text-xs text-white/40">
              Establece una nueva contraseña para la cuenta.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">

              <input
                type="password"
                value={nuevaPassword}
                onChange={(e) =>
                  setNuevaPassword(
                    e.target.value
                  )
                }
                placeholder="Nueva contraseña"
                className="
                  min-w-0
                  flex-1
                  rounded-xl
                  border border-white/10
                  bg-white/[0.06]
                  px-4
                  py-2.5
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-white/30
                  transition
                  focus:border-blue-400/40
                  focus:ring-2
                  focus:ring-blue-400/10
                "
              />

              <button
                type="button"
                onClick={
                  ejecutarResetPassword
                }
                disabled={
                  !nuevaPassword.trim()
                }
                className="
                  rounded-xl
                  border border-blue-400/20
                  bg-blue-500/10
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-blue-300
                  transition
                  hover:bg-blue-500/20
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                Resetear
              </button>

            </div>

          </div>

          {/* ROL */}

          <div
            className="
              rounded-2xl
              border border-white/10
              bg-black/10
              p-5
            "
          >

            <div className="text-sm font-semibold text-white">
              👤 Asignar rol
            </div>

            <p className="mt-1 text-xs text-white/40">
              Rol actualmente asignado:{" "}
              <span className="text-purple-300">
                {nombreRol}
              </span>
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">

              <input
                type="number"
                value={nuevoRol}
                onChange={(e) =>
                  setNuevoRol(
                    e.target.value
                  )
                }
                placeholder="ID del nuevo rol"
                className="
                  min-w-0
                  flex-1
                  rounded-xl
                  border border-white/10
                  bg-white/[0.06]
                  px-4
                  py-2.5
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-white/30
                  transition
                  focus:border-purple-400/40
                  focus:ring-2
                  focus:ring-purple-400/10
                "
              />

              <button
                type="button"
                onClick={
                  ejecutarAsignarRol
                }
                disabled={
                  !nuevoRol
                }
                className="
                  rounded-xl
                  border border-purple-400/20
                  bg-purple-500/10
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-purple-300
                  transition
                  hover:bg-purple-500/20
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                Asignar rol
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          MÓDULOS VISIBLES
      ====================================================== */}

      <section
        className="
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-white/[0.05]
          backdrop-blur-2xl
          shadow-[0_20px_70px_rgba(0,0,0,0.22)]
        "
      >

        <button
          type="button"
          className="
            flex
            w-full
            items-center
            justify-between
            p-6
            text-left
            transition
            hover:bg-white/[0.025]
          "
          onClick={() =>
            setShowModulos(
              (prev) => !prev
            )
          }
        >

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-xl">
              📦
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Módulos visibles
              </h2>

              <p className="mt-1 text-xs text-white/40">
                Control de los módulos disponibles para este empleado.
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
              {modulosVisibles.length}
            </span>

            <span className="text-white/40">
              {showModulos
                ? "▼"
                : "▶"}
            </span>

          </div>

        </button>

        {showModulos && (
          <div className="border-t border-white/10 p-6">

            <div
              className="
                grid
                grid-cols-1
                gap-3
                md:grid-cols-2
                xl:grid-cols-3
              "
            >

              {modulosDisponibles.map(
                (modulo) => {

                  const visible =
                    modulosVisibles.includes(
                      modulo
                    );

                  return (
                    <label
                      key={modulo}
                      className={`
                        flex
                        cursor-pointer
                        items-center
                        justify-between
                        gap-4
                        rounded-2xl
                        border
                        px-4
                        py-4
                        transition
                        ${
                          visible
                            ? "border-blue-400/20 bg-blue-400/10"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                        }
                      `}
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <span className="text-lg">
                          {visible
                            ? "🟢"
                            : "⚪"}
                        </span>

                        <span className="truncate text-sm font-medium text-white">
                          {modulo}
                        </span>

                      </div>

                      <input
                        type="checkbox"
                        checked={visible}
                        onChange={() =>
                          cambiarModulo(
                            modulo
                          )
                        }
                        className="
                          h-5
                          w-5
                          shrink-0
                          cursor-pointer
                          accent-blue-500
                        "
                      />

                    </label>
                  );
                }
              )}

            </div>

            {modulosDisponibles.length ===
              0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-white/40">
                No hay módulos disponibles.
              </div>
            )}

          </div>
        )}

      </section>

      {/* ======================================================
          PERMISOS
      ====================================================== */}

      <section
        className="
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-white/[0.05]
          backdrop-blur-2xl
          shadow-[0_20px_70px_rgba(0,0,0,0.22)]
        "
      >

        <button
          type="button"
          className="
            flex
            w-full
            items-center
            justify-between
            p-6
            text-left
            transition
            hover:bg-white/[0.025]
          "
          onClick={() =>
            setShowPermisos(
              (prev) => !prev
            )
          }
        >

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-400/10 text-xl">
              🔧
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Permisos por módulo
              </h2>

              <p className="mt-1 text-xs text-white/40">
                Control granular de las capacidades del empleado.
              </p>
            </div>

          </div>

          <span className="text-white/40">
            {showPermisos
              ? "▼"
              : "▶"}
          </span>

        </button>

        {showPermisos && (
          <div className="border-t border-white/10 p-6">

            <div className="space-y-6">

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
                    <div
                      key={modulo}
                      className="
                        rounded-2xl
                        border border-white/10
                        bg-black/10
                        p-5
                      "
                    >

                      <div className="flex items-center justify-between">

                        <div>
                          <div className="font-semibold text-white">
                            {modulo}
                          </div>

                          <div className="mt-1 text-xs text-white/40">
                            {listaPerms.length} permisos disponibles
                          </div>
                        </div>

                        <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs font-semibold text-purple-300">
                          {Array.isArray(
                            permisosEmpleado[
                              modulo
                            ]
                          )
                            ? permisosEmpleado[
                                modulo
                              ].length
                            : 0}
                        </span>

                      </div>

                      <div
                        className="
                          mt-4
                          grid
                          grid-cols-1
                          gap-3
                          sm:grid-cols-2
                          lg:grid-cols-4
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
                                className={`
                                  flex
                                  cursor-pointer
                                  items-center
                                  gap-3
                                  rounded-xl
                                  border
                                  px-3
                                  py-3
                                  text-sm
                                  transition
                                  ${
                                    checked
                                      ? "border-purple-400/20 bg-purple-400/10 text-purple-200"
                                      : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
                                  }
                                `}
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
                                    h-4
                                    w-4
                                    cursor-pointer
                                    accent-purple-500
                                  "
                                />

                                <span className="truncate">
                                  {perm}
                                </span>

                              </label>
                            );
                          }
                        )}

                      </div>

                    </div>
                  );
                }
              )}

              {Object.keys(
                permisosGlobales || {}
              ).length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-white/40">
                  No hay permisos disponibles.
                </div>
              )}

            </div>

          </div>
        )}

      </section>

      {/* ======================================================
          AUDITORÍA
      ====================================================== */}

      <section
        className="
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-white/[0.05]
          backdrop-blur-2xl
          shadow-[0_20px_70px_rgba(0,0,0,0.22)]
        "
      >

        <button
          type="button"
          className="
            flex
            w-full
            items-center
            justify-between
            p-6
            text-left
            transition
            hover:bg-white/[0.025]
          "
          onClick={() =>
            setShowAuditoria(
              (prev) => !prev
            )
          }
        >

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-xl">
              📊
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Auditoría del usuario
              </h2>

              <p className="mt-1 text-xs text-white/40">
                Trazabilidad de las acciones realizadas por este empleado.
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
              {auditoriaOrdenada.length}
            </span>

            <span className="text-white/40">
              {showAuditoria
                ? "▼"
                : "▶"}
            </span>

          </div>

        </button>

        {showAuditoria && (
          <div className="space-y-5 border-t border-white/10 p-6">

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex flex-col gap-3 md:flex-row">

                <input
                  type="text"
                  value={busquedaAud}
                  onChange={(e) => {
                    setBusquedaAud(
                      e.target.value
                    );
                    setPaginaAud(0);
                  }}
                  placeholder="Buscar módulo, acción o descripción..."
                  className="
                    w-full
                    rounded-xl
                    border border-white/10
                    bg-white/[0.05]
                    px-4
                    py-2.5
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-white/30
                    focus:border-blue-400/30
                    focus:ring-2
                    focus:ring-blue-400/10
                    md:w-80
                  "
                />

                <input
                  type="date"
                  value={filtroFechaAud}
                  onChange={(e) => {
                    setFiltroFechaAud(
                      e.target.value
                    );
                    setPaginaAud(0);
                  }}
                  className="
                    rounded-xl
                    border border-white/10
                    bg-white/[0.05]
                    px-4
                    py-2.5
                    text-sm
                    text-white
                    outline-none
                    focus:border-blue-400/30
                  "
                />

              </div>

              <button
                type="button"
                onClick={
                  descargarExcelAuditoria
                }
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-xl
                  border border-emerald-400/20
                  bg-emerald-500/10
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-emerald-300
                  transition
                  hover:bg-emerald-500/20
                "
              >
                📊 Exportar auditoría
              </button>

            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">

              <table className="w-full min-w-[760px] text-sm">

                <thead className="bg-white/[0.06]">

                  <tr>

                    <th
                      className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-semibold text-white/70 hover:text-white"
                      onClick={() =>
                        ordenarAud("fecha")
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
                      className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-semibold text-white/70 hover:text-white"
                      onClick={() =>
                        ordenarAud("modulo")
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
                      className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-semibold text-white/70 hover:text-white"
                      onClick={() =>
                        ordenarAud("accion")
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

                    <th className="px-4 py-3 text-left font-semibold text-white/70">
                      Descripción
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {auditoriaPaginada.map(
                    (a, index) => {

                      const key =
                        a.id ??
                        `${a.fecha}-${a.modulo}-${a.accion}-${index}`;

                      return (
                        <tr
                          key={String(key)}
                          className="
                            border-t
                            border-white/10
                            transition
                            hover:bg-white/[0.035]
                          "
                        >

                          <td className="whitespace-nowrap px-4 py-3 text-white/65">
                            {a.fecha || "-"}
                          </td>

                          <td className="px-4 py-3 text-white/80">
                            {a.modulo || "-"}
                          </td>

                          <td className="px-4 py-3">

                            <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-white/70">

                              {iconosAccion[
                                a.accion
                              ] ||
                                iconosAccion.default}

                              {a.accion || "-"}

                            </span>

                          </td>

                          <td className="px-4 py-3 text-white/65">
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
                        className="px-6 py-10 text-center text-sm text-white/35"
                      >
                        No hay registros de auditoría.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">

              <span className="text-xs text-white/40">
                Mostrando{" "}
                {auditoriaPaginada.length}{" "}
                de{" "}
                {auditoriaOrdenada.length}{" "}
                registros
              </span>

              <div className="flex items-center gap-2">

                <button
                  type="button"
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
                    rounded-xl
                    border border-white/10
                    bg-white/[0.05]
                    px-3
                    py-2
                    text-xs
                    text-white/70
                    transition
                    hover:bg-white/10
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  ← Anterior
                </button>

                <span className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/60">
                  Página {paginaAud + 1}
                </span>

                <button
                  type="button"
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
                    rounded-xl
                    border border-white/10
                    bg-white/[0.05]
                    px-3
                    py-2
                    text-xs
                    text-white/70
                    transition
                    hover:bg-white/10
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  Siguiente →
                </button>

              </div>

            </div>

          </div>
        )}

      </section>

      {/* ======================================================
          LOGS
      ====================================================== */}

      <section
        className="
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-white/[0.05]
          backdrop-blur-2xl
          shadow-[0_20px_70px_rgba(0,0,0,0.22)]
        "
      >

        <button
          type="button"
          className="
            flex
            w-full
            items-center
            justify-between
            p-6
            text-left
            transition
            hover:bg-white/[0.025]
          "
          onClick={() =>
            setShowLogs(
              (prev) => !prev
            )
          }
        >

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/10 text-xl">
              📝
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Logs técnicos del usuario
              </h2>

              <p className="mt-1 text-xs text-white/40">
                Eventos técnicos, autenticación, errores y actividad sensible.
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
              {logsOrdenados.length}
            </span>

            <span className="text-white/40">
              {showLogs
                ? "▼"
                : "▶"}
            </span>

          </div>

        </button>

        {showLogs && (
          <div className="space-y-5 border-t border-white/10 p-6">

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex flex-col gap-3 md:flex-row">

                <input
                  type="text"
                  value={busquedaLog}
                  onChange={(e) => {
                    setBusquedaLog(
                      e.target.value
                    );
                    setPaginaLog(0);
                  }}
                  placeholder="Buscar evento, detalle, IP o fecha..."
                  className="
                    w-full
                    rounded-xl
                    border border-white/10
                    bg-white/[0.05]
                    px-4
                    py-2.5
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-white/30
                    focus:border-purple-400/30
                    focus:ring-2
                    focus:ring-purple-400/10
                    md:w-80
                  "
                />

                <input
                  type="date"
                  value={filtroFechaLog}
                  onChange={(e) => {
                    setFiltroFechaLog(
                      e.target.value
                    );
                    setPaginaLog(0);
                  }}
                  className="
                    rounded-xl
                    border border-white/10
                    bg-white/[0.05]
                    px-4
                    py-2.5
                    text-sm
                    text-white
                    outline-none
                    focus:border-purple-400/30
                  "
                />

              </div>

              <button
                type="button"
                onClick={
                  descargarExcelLogs
                }
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-xl
                  border border-orange-400/20
                  bg-orange-500/10
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-orange-300
                  transition
                  hover:bg-orange-500/20
                "
              >
                📊 Exportar logs
              </button>

            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">

              <table className="w-full min-w-[820px] text-sm">

                <thead className="bg-white/[0.06]">

                  <tr>

                    <th
                      className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-semibold text-white/70 hover:text-white"
                      onClick={() =>
                        ordenarLog("fecha")
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
                      className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-semibold text-white/70 hover:text-white"
                      onClick={() =>
                        ordenarLog("evento")
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

                    <th className="px-4 py-3 text-left font-semibold text-white/70">
                      Detalle
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-white/70">
                      IP
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {logsPaginados.map(
                    (l, index) => {

                      const key =
                        l.id ??
                        `${l.fecha}-${l.evento}-${l.detalle}-${index}`;

                      return (
                        <tr
                          key={String(key)}
                          className="
                            border-t
                            border-white/10
                            transition
                            hover:bg-white/[0.035]
                          "
                        >

                          <td className="whitespace-nowrap px-4 py-3 text-white/65">
                            {l.fecha || "-"}
                          </td>

                          <td className="px-4 py-3">

                            <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-white/70">

                              {iconosEvento[
                                l.evento
                              ] ||
                                iconosEvento.default}

                              {l.evento || "-"}

                            </span>

                          </td>

                          <td className="px-4 py-3 text-white/65">
                            {l.detalle || "-"}
                          </td>

                          <td className="px-4 py-3 font-mono text-xs text-white/50">
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
                        className="px-6 py-10 text-center text-sm text-white/35"
                      >
                        No hay registros de logs.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">

              <span className="text-xs text-white/40">
                Mostrando{" "}
                {logsPaginados.length}{" "}
                de{" "}
                {logsOrdenados.length}{" "}
                registros
              </span>

              <div className="flex items-center gap-2">

                <button
                  type="button"
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
                    rounded-xl
                    border border-white/10
                    bg-white/[0.05]
                    px-3
                    py-2
                    text-xs
                    text-white/70
                    transition
                    hover:bg-white/10
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  ← Anterior
                </button>

                <span className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/60">
                  Página {paginaLog + 1}
                </span>

                <button
                  type="button"
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
                    rounded-xl
                    border border-white/10
                    bg-white/[0.05]
                    px-3
                    py-2
                    text-xs
                    text-white/70
                    transition
                    hover:bg-white/10
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  Siguiente →
                </button>

              </div>

            </div>

          </div>
        )}

      </section>

    </div>
  );
}
