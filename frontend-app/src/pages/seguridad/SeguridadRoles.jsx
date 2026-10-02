import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadRoles() {
  const {
    roles = [],
    empleados = [],
    permisos = [],
    cargarTodo,
  } = useSeguridad();

  // ============================================================
  // ESTADOS
  // ============================================================

  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState({
    campo: "nombre",
    asc: true,
  });

  const [rolSeleccionado, setRolSeleccionado] =
    useState(null);

  // ============================================================
  // CARGAR DATOS
  // ============================================================

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  // ============================================================
  // ROLES SEGUROS
  // ============================================================

  const rolesSeguros = useMemo(() => {
    if (!Array.isArray(roles)) {
      return [];
    }

    return roles.filter(
      (rol) =>
        rol &&
        typeof rol === "object" &&
        typeof rol.id !== "undefined" &&
        typeof rol.nombre === "string"
    );
  }, [roles]);

  // ============================================================
  // EMPLEADOS SEGUROS
  // ============================================================

  const empleadosSeguros = useMemo(() => {
    if (!Array.isArray(empleados)) {
      return [];
    }

    return empleados.filter(
      (empleado) =>
        empleado &&
        typeof empleado === "object" &&
        typeof empleado.id === "number" &&
        typeof empleado.nombre === "string"
    );
  }, [empleados]);

  // ============================================================
  // PERMISOS SEGUROS
  // ============================================================

  const permisosSeguros = useMemo(() => {
    if (!Array.isArray(permisos)) {
      return [];
    }

    return permisos.filter(
      (permiso) =>
        permiso &&
        typeof permiso === "object" &&
        typeof permiso.modulo === "string" &&
        typeof permiso.permiso === "string"
    );
  }, [permisos]);

  // ============================================================
  // BUSCAR EMPLEADOS DE UN ROL
  //
  // El backend puede devolver:
  //
  // empleado.rol
  // empleado.rol_id
  // empleado.id_rol
  //
  // Soportamos las variantes sin romper la pantalla.
  // ============================================================

  const empleadosPorRol = useMemo(() => {
    const mapa = {};

    empleadosSeguros.forEach((empleado) => {
      const rol =
        empleado.rol &&
        typeof empleado.rol === "object"
          ? empleado.rol
          : null;

      const rolId =
        empleado.rol_id ??
        empleado.id_rol ??
        rol?.id ??
        null;

      if (
        rolId === null ||
        typeof rolId === "undefined"
      ) {
        return;
      }

      const clave = String(rolId);

      if (!mapa[clave]) {
        mapa[clave] = [];
      }

      mapa[clave].push(empleado);
    });

    return mapa;
  }, [empleadosSeguros]);

  // ============================================================
  // PERMISOS POR MÓDULO
  // ============================================================

  const permisosPorModulo = useMemo(() => {
    const mapa = {};

    permisosSeguros.forEach((permiso) => {
      const modulo = permiso.modulo;

      if (!mapa[modulo]) {
        mapa[modulo] = [];
      }

      if (
        !mapa[modulo].includes(
          permiso.permiso
        )
      ) {
        mapa[modulo].push(
          permiso.permiso
        );
      }
    });

    return mapa;
  }, [permisosSeguros]);

  // ============================================================
  // MÓDULOS
  // ============================================================

  const modulosDisponibles = useMemo(() => {
    return Object.keys(
      permisosPorModulo
    ).sort((a, b) =>
      a.localeCompare(b, "es", {
        sensitivity: "base",
      })
    );
  }, [permisosPorModulo]);

  // ============================================================
  // DATOS ENRIQUECIDOS DE ROLES
  // ============================================================

  const rolesEnriquecidos = useMemo(() => {
    return rolesSeguros.map((rol) => {
      const usuarios =
        empleadosPorRol[String(rol.id)] ||
        [];

      const permisosRol =
        Array.isArray(rol.permisos)
          ? rol.permisos
          : Array.isArray(
              rol.permisos_ids
            )
          ? rol.permisos_ids
          : [];

      const modulosRol =
        Array.isArray(rol.modulos)
          ? rol.modulos
          : Array.isArray(
              rol.modulos_visibles
            )
          ? rol.modulos_visibles
          : [];

      return {
        ...rol,

        usuarios,

        usuariosCount:
          Number.isFinite(
            Number(rol.usuarios_count)
          )
            ? Number(
                rol.usuarios_count
              )
            : usuarios.length,

        permisosCount:
          Number.isFinite(
            Number(rol.permisos_count)
          )
            ? Number(
                rol.permisos_count
              )
            : permisosRol.length,

        modulosCount:
          Number.isFinite(
            Number(rol.modulos_count)
          )
            ? Number(
                rol.modulos_count
              )
            : modulosRol.length,

        permisosRol,

        modulosRol,
      };
    });
  }, [
    rolesSeguros,
    empleadosPorRol,
  ]);

  // ============================================================
  // FILTRAR
  // ============================================================

  const rolesFiltrados = useMemo(() => {
    const texto =
      busqueda.trim().toLowerCase();

    if (!texto) {
      return rolesEnriquecidos;
    }

    return rolesEnriquecidos.filter(
      (rol) => {
        const contenido = [
          rol.id,
          rol.nombre,
          rol.descripcion,
          rol.codigo,
        ]
          .map((valor) =>
            String(
              valor ?? ""
            ).toLowerCase()
          )
          .join(" ");

        return contenido.includes(texto);
      }
    );
  }, [
    rolesEnriquecidos,
    busqueda,
  ]);

  // ============================================================
  // ORDENAR
  // ============================================================

  const ordenar = useCallback(
    (campo) => {
      setOrden((prev) => ({
        campo,
        asc:
          prev.campo === campo
            ? !prev.asc
            : true,
      }));
    },
    []
  );

  const rolesOrdenados = useMemo(() => {
    const {
      campo,
      asc,
    } = orden;

    const direccion =
      asc ? 1 : -1;

    return [
      ...rolesFiltrados,
    ].sort((a, b) => {
      let va = a?.[campo];
      let vb = b?.[campo];

      if (
        typeof va === "number" &&
        typeof vb === "number"
      ) {
        return (
          (va - vb) *
          direccion
        );
      }

      va = String(
        va ?? ""
      ).toLowerCase();

      vb = String(
        vb ?? ""
      ).toLowerCase();

      if (va < vb) {
        return -1 * direccion;
      }

      if (va > vb) {
        return 1 * direccion;
      }

      return 0;
    });
  }, [
    rolesFiltrados,
    orden,
  ]);

  // ============================================================
  // SELECCIONAR ROL
  // ============================================================

  const seleccionarRol = useCallback(
    (rol) => {
      if (!rol) {
        return;
      }

      setRolSeleccionado(rol);
    },
    []
  );

  // ============================================================
  // LIMPIAR SELECCIÓN SI DESAPARECE
  // ============================================================

  useEffect(() => {
    if (!rolSeleccionado) {
      return;
    }

    const sigueExistiendo =
      rolesOrdenados.some(
        (rol) =>
          String(rol.id) ===
          String(
            rolSeleccionado.id
          )
      );

    if (!sigueExistiendo) {
      setRolSeleccionado(null);
    }
  }, [
    rolesOrdenados,
    rolSeleccionado,
  ]);

  // ============================================================
  // ESTADÍSTICAS
  // ============================================================

  const estadisticas = useMemo(() => {
    const total =
      rolesEnriquecidos.length;

    const activos =
      rolesEnriquecidos.filter(
        (rol) =>
          rol.activo !== false &&
          rol.habilitado !== false
      ).length;

    const usuariosAsignados =
      rolesEnriquecidos.reduce(
        (total, rol) =>
          total +
          Number(
            rol.usuariosCount || 0
          ),
        0
      );

    const rolesConPermisos =
      rolesEnriquecidos.filter(
        (rol) =>
          Number(
            rol.permisosCount || 0
          ) > 0
      ).length;

    return {
      total,
      activos,
      usuariosAsignados,
      rolesConPermisos,
    };
  }, [
    rolesEnriquecidos,
  ]);

  // ============================================================
  // ESTADO DEL ROL
  // ============================================================

  const obtenerEstadoRol = useCallback(
    (rol) => {
      if (
        rol.activo === false ||
        rol.habilitado === false
      ) {
        return {
          texto: "INACTIVO",
          clase:
            "border-red-400/20 bg-red-400/10 text-red-300",
          punto: "bg-red-400",
        };
      }

      return {
        texto: "ACTIVO",
        clase:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        punto: "bg-emerald-400",
      };
    },
    []
  );

  // ============================================================
  // CARGANDO
  // ============================================================

  if (
    !Array.isArray(roles)
  ) {
    return (
      <div className="p-6 text-white/70 animate-pulse">
        Cargando roles…
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="w-full space-y-6 text-white animate-fade-in">

      {/* ======================================================
          CABECERA
      ====================================================== */}

      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border border-white/15
          bg-white/[0.06]
          backdrop-blur-2xl
          shadow-[0_20px_70px_rgba(0,0,0,0.28)]
          px-6
          py-6
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-24
            h-64
            w-64
            rounded-full
            bg-purple-500/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            left-1/3
            h-48
            w-48
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
        />

        <div
          className="
            relative
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div>
            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border border-white/15
                  bg-white/10
                  text-2xl
                  shadow-lg
                "
              >
                👥
              </div>

              <div>
                <h1
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-white
                    md:text-3xl
                  "
                >
                  Roles de seguridad
                </h1>

                <p className="mt-1 text-sm text-white/55">
                  Control centralizado de perfiles y niveles de acceso del ERP.
                </p>
              </div>

            </div>
          </div>

          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border border-purple-400/20
              bg-purple-400/10
              px-4
              py-2
              text-xs
              font-semibold
              text-purple-300
            "
          >
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-purple-400
                shadow-[0_0_10px_rgba(192,132,252,0.8)]
              "
            />

            CONTROL DE ROLES
          </div>

        </div>
      </div>

      {/* ======================================================
          KPIs
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-4
        "
      >

        {/* TOTAL */}

        <div
          className="
            rounded-3xl
            border border-white/15
            bg-white/[0.05]
            backdrop-blur-2xl
            p-5
            shadow-[0_15px_50px_rgba(0,0,0,0.18)]
          "
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/55">
              Total roles
            </span>

            <span className="text-xl">
              🛡️
            </span>
          </div>

          <div className="mt-3 text-3xl font-bold">
            {estadisticas.total}
          </div>

          <div className="mt-1 text-xs text-white/40">
            Perfiles definidos
          </div>
        </div>

        {/* ACTIVOS */}

        <div
          className="
            rounded-3xl
            border border-white/15
            bg-white/[0.05]
            backdrop-blur-2xl
            p-5
            shadow-[0_15px_50px_rgba(0,0,0,0.18)]
          "
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/55">
              Roles activos
            </span>

            <span className="text-xl">
              🟢
            </span>
          </div>

          <div className="mt-3 text-3xl font-bold">
            {estadisticas.activos}
          </div>

          <div className="mt-1 text-xs text-white/40">
            Disponibles para uso
          </div>
        </div>

        {/* USUARIOS */}

        <div
          className="
            rounded-3xl
            border border-white/15
            bg-white/[0.05]
            backdrop-blur-2xl
            p-5
            shadow-[0_15px_50px_rgba(0,0,0,0.18)]
          "
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/55">
              Usuarios asignados
            </span>

            <span className="text-xl">
              👤
            </span>
          </div>

          <div className="mt-3 text-3xl font-bold">
            {estadisticas.usuariosAsignados}
          </div>

          <div className="mt-1 text-xs text-white/40">
            Distribuidos entre roles
          </div>
        </div>

        {/* PERMISOS */}

        <div
          className="
            rounded-3xl
            border border-white/15
            bg-white/[0.05]
            backdrop-blur-2xl
            p-5
            shadow-[0_15px_50px_rgba(0,0,0,0.18)]
          "
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/55">
              Roles con permisos
            </span>

            <span className="text-xl">
              🔐
            </span>
          </div>

          <div className="mt-3 text-3xl font-bold">
            {estadisticas.rolesConPermisos}
          </div>

          <div className="mt-1 text-xs text-white/40">
            Con configuración de acceso
          </div>
        </div>

      </div>

      {/* ======================================================
          MONITOR PRINCIPAL
      ====================================================== */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          border border-white/15
          bg-white/[0.045]
          backdrop-blur-2xl
          shadow-[0_20px_70px_rgba(0,0,0,0.24)]
        "
      >

        {/* CABECERA TABLA */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-b border-white/10
            p-5
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div>
            <h2 className="text-lg font-semibold">
              Perfiles de seguridad
            </h2>

            <p className="mt-1 text-sm text-white/45">
              Selecciona un rol para inspeccionar su configuración.
            </p>
          </div>

          <div className="w-full md:w-80">

            <input
              type="text"
              value={busqueda}
              onChange={(e) =>
                setBusqueda(
                  e.target.value
                )
              }
              placeholder="Buscar rol..."
              className="
                w-full
                rounded-2xl
                border border-white/15
                bg-white/[0.07]
                px-4
                py-2.5
                text-sm
                text-white
                placeholder-white/35
                outline-none
                transition
                focus:border-blue-400/40
                focus:ring-2
                focus:ring-blue-400/20
              "
            />

          </div>

        </div>

        {/* TABLA */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px] text-sm">

            <thead className="border-b border-white/10 bg-white/[0.035]">

              <tr>

                <th
                  className="
                    cursor-pointer
                    px-5
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-white/45
                    transition
                    hover:text-white
                  "
                  onClick={() =>
                    ordenar("id")
                  }
                >
                  ID{" "}
                  {orden.campo === "id" &&
                    (orden.asc
                      ? "▲"
                      : "▼")}
                </th>

                <th
                  className="
                    cursor-pointer
                    px-5
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-white/45
                    transition
                    hover:text-white
                  "
                  onClick={() =>
                    ordenar("nombre")
                  }
                >
                  Rol{" "}
                  {orden.campo ===
                    "nombre" &&
                    (orden.asc
                      ? "▲"
                      : "▼")}
                </th>

                <th
                  className="
                    px-5
                    py-4
                    text-center
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-white/45
                  "
                >
                  Estado
                </th>

                <th
                  className="
                    cursor-pointer
                    px-5
                    py-4
                    text-center
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-white/45
                    transition
                    hover:text-white
                  "
                  onClick={() =>
                    ordenar(
                      "usuariosCount"
                    )
                  }
                >
                  Usuarios{" "}
                  {orden.campo ===
                    "usuariosCount" &&
                    (orden.asc
                      ? "▲"
                      : "▼")}
                </th>

                <th
                  className="
                    cursor-pointer
                    px-5
                    py-4
                    text-center
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-white/45
                    transition
                    hover:text-white
                  "
                  onClick={() =>
                    ordenar(
                      "modulosCount"
                    )
                  }
                >
                  Módulos{" "}
                  {orden.campo ===
                    "modulosCount" &&
                    (orden.asc
                      ? "▲"
                      : "▼")}
                </th>

                <th
                  className="
                    cursor-pointer
                    px-5
                    py-4
                    text-center
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-white/45
                    transition
                    hover:text-white
                  "
                  onClick={() =>
                    ordenar(
                      "permisosCount"
                    )
                  }
                >
                  Permisos{" "}
                  {orden.campo ===
                    "permisosCount" &&
                    (orden.asc
                      ? "▲"
                      : "▼")}
                </th>

                <th
                  className="
                    px-5
                    py-4
                    text-right
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-white/45
                  "
                >
                  Control
                </th>

              </tr>

            </thead>

            <tbody>

              {rolesOrdenados.map(
                (rol) => {
                  const estado =
                    obtenerEstadoRol(
                      rol
                    );

                  const seleccionado =
                    rolSeleccionado &&
                    String(
                      rolSeleccionado.id
                    ) ===
                      String(
                        rol.id
                      );

                  return (
                    <tr
                      key={String(
                        rol.id
                      )}
                      onClick={() =>
                        seleccionarRol(
                          rol
                        )
                      }
                      className={`
                        cursor-pointer
                        border-b
                        border-white/10
                        transition
                        ${
                          seleccionado
                            ? "bg-blue-400/[0.09]"
                            : "hover:bg-white/[0.045]"
                        }
                      `}
                    >

                      <td className="px-5 py-4 text-white/45">
                        #{rol.id}
                      </td>

                      <td className="px-5 py-4">

                        <div className="font-semibold text-white">
                          {rol.nombre}
                        </div>

                        {(rol.descripcion ||
                          rol.codigo) && (
                          <div className="mt-1 max-w-md truncate text-xs text-white/40">
                            {rol.descripcion ||
                              rol.codigo}
                          </div>
                        )}

                      </td>

                      <td className="px-5 py-4 text-center">

                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            px-3
                            py-1
                            text-[11px]
                            font-semibold
                            ${estado.clase}
                          `}
                        >
                          <span
                            className={`
                              h-1.5
                              w-1.5
                              rounded-full
                              ${estado.punto}
                            `}
                          />

                          {estado.texto}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-center">

                        <span
                          className="
                            inline-flex
                            min-w-10
                            items-center
                            justify-center
                            rounded-xl
                            border border-white/10
                            bg-white/[0.05]
                            px-3
                            py-1.5
                            font-semibold
                          "
                        >
                          {rol.usuariosCount}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-center">

                        <span className="text-white/75">
                          {rol.modulosCount}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-center">

                        <span className="text-white/75">
                          {rol.permisosCount}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();

                            seleccionarRol(
                              rol
                            );
                          }}
                          className="
                            rounded-xl
                            border border-white/15
                            bg-white/[0.06]
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-white/75
                            transition
                            hover:bg-white/10
                            hover:text-white
                          "
                        >
                          👁️ Inspeccionar
                        </button>

                      </td>

                    </tr>
                  );
                }
              )}

              {rolesOrdenados.length ===
                0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="
                      px-6
                      py-14
                      text-center
                    "
                  >
                    <div className="text-4xl">
                      🛡️
                    </div>

                    <p className="mt-3 font-semibold text-white/70">
                      No hay roles
                    </p>

                    <p className="mt-1 text-sm text-white/40">
                      No se han encontrado perfiles que coincidan con la búsqueda.
                    </p>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ======================================================
          DETALLE DEL ROL
      ====================================================== */}

      {rolSeleccionado && (
        <div
          className="
            overflow-hidden
            rounded-3xl
            border border-white/15
            bg-white/[0.05]
            backdrop-blur-2xl
            shadow-[0_20px_70px_rgba(0,0,0,0.24)]
          "
        >

          {/* CABECERA */}

          <div
            className="
              flex
              flex-col
              gap-4
              border-b border-white/10
              p-6
              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border border-purple-400/20
                  bg-purple-400/10
                  text-2xl
                "
              >
                🛡️
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-white/40">
                  Rol seleccionado
                </div>

                <h2 className="mt-1 text-2xl font-bold">
                  {rolSeleccionado.nombre}
                </h2>

                <p className="mt-1 text-sm text-white/45">
                  ID #{rolSeleccionado.id}
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                setRolSeleccionado(null)
              }
              className="
                w-fit
                rounded-xl
                border border-white/15
                bg-white/[0.06]
                px-4
                py-2
                text-sm
                text-white/65
                transition
                hover:bg-white/10
                hover:text-white
              "
            >
              Cerrar
            </button>

          </div>

          {/* RESUMEN */}

          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">

            <div
              className="
                rounded-2xl
                border border-white/10
                bg-white/[0.035]
                p-4
              "
            >
              <div className="text-xs uppercase tracking-wide text-white/40">
                Usuarios
              </div>

              <div className="mt-2 text-2xl font-bold">
                {
                  rolSeleccionado.usuariosCount
                }
              </div>
            </div>

            <div
              className="
                rounded-2xl
                border border-white/10
                bg-white/[0.035]
                p-4
              "
            >
              <div className="text-xs uppercase tracking-wide text-white/40">
                Módulos
              </div>

              <div className="mt-2 text-2xl font-bold">
                {
                  rolSeleccionado.modulosCount
                }
              </div>
            </div>

            <div
              className="
                rounded-2xl
                border border-white/10
                bg-white/[0.035]
                p-4
              "
            >
              <div className="text-xs uppercase tracking-wide text-white/40">
                Permisos
              </div>

              <div className="mt-2 text-2xl font-bold">
                {
                  rolSeleccionado.permisosCount
                }
              </div>
            </div>

          </div>

          {/* INFORMACIÓN */}

          <div
            className="
              grid
              grid-cols-1
              gap-6
              border-t
              border-white/10
              p-6
              lg:grid-cols-2
            "
          >

            {/* USUARIOS */}

            <div>

              <div className="mb-3">
                <h3 className="font-semibold">
                  👥 Usuarios asignados
                </h3>

                <p className="mt-1 text-xs text-white/40">
                  Empleados vinculados a este rol.
                </p>
              </div>

              <div className="space-y-2">

                {rolSeleccionado.usuarios
                  ?.slice(0, 10)
                  .map((empleado) => (
                    <div
                      key={String(
                        empleado.id
                      )}
                      className="
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border border-white/10
                        bg-white/[0.035]
                        px-4
                        py-3
                      "
                    >
                      <div>
                        <div className="font-medium">
                          {empleado.nombre}
                        </div>

                        <div className="text-xs text-white/40">
                          {empleado.usuario ||
                            `ID ${empleado.id}`}
                        </div>
                      </div>

                      <span
                        className={`
                          h-2
                          w-2
                          rounded-full
                          ${
                            empleado.activo
                              ? "bg-emerald-400"
                              : "bg-red-400"
                          }
                        `}
                      />
                    </div>
                  ))}

                {(!Array.isArray(
                  rolSeleccionado.usuarios
                ) ||
                  rolSeleccionado
                    .usuarios.length ===
                    0) && (
                  <div
                    className="
                      rounded-xl
                      border border-dashed
                      border-white/10
                      p-5
                      text-center
                      text-sm
                      text-white/40
                    "
                  >
                    No hay usuarios vinculados identificados.
                  </div>
                )}

                {Array.isArray(
                  rolSeleccionado.usuarios
                ) &&
                  rolSeleccionado
                    .usuarios.length >
                    10 && (
                    <div className="text-xs text-white/35">
                      Mostrando los primeros 10 usuarios.
                    </div>
                  )}

              </div>

            </div>

            {/* PERMISOS */}

            <div>

              <div className="mb-3">
                <h3 className="font-semibold">
                  🔐 Capacidad de acceso
                </h3>

                <p className="mt-1 text-xs text-white/40">
                  Información disponible en el catálogo global de permisos.
                </p>
              </div>

              <div className="space-y-3">

                {modulosDisponibles
                  .slice(0, 8)
                  .map((modulo) => {

                    const lista =
                      permisosPorModulo[
                        modulo
                      ] || [];

                    return (
                      <div
                        key={modulo}
                        className="
                          rounded-xl
                          border border-white/10
                          bg-white/[0.035]
                          p-4
                        "
                      >

                        <div className="flex items-center justify-between gap-3">

                          <span className="font-medium">
                            {modulo}
                          </span>

                          <span
                            className="
                              rounded-full
                              border border-white/10
                              bg-white/[0.05]
                              px-2.5
                              py-1
                              text-[11px]
                              text-white/50
                            "
                          >
                            {lista.length} permisos
                          </span>

                        </div>

                      </div>
                    );
                  })}

                {modulosDisponibles.length ===
                  0 && (
                  <div
                    className="
                      rounded-xl
                      border border-dashed
                      border-white/10
                      p-5
                      text-center
                      text-sm
                      text-white/40
                    "
                  >
                    No hay catálogo global de permisos disponible.
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* AVISO EDITOR */}

          <div
            className="
              border-t
              border-white/10
              bg-purple-400/[0.045]
              px-6
              py-4
            "
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

              <div>
                <div className="text-sm font-semibold text-purple-200">
                  Configuración avanzada
                </div>

                <div className="mt-1 text-xs text-white/40">
                  La edición completa del rol se centralizará en SeguridadRolEditor.
                </div>
              </div>

              <span
                className="
                  w-fit
                  rounded-full
                  border border-purple-400/20
                  bg-purple-400/10
                  px-3
                  py-1.5
                  text-[11px]
                  font-semibold
                  text-purple-300
                "
              >
                EDITOR DE ROLES
              </span>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
