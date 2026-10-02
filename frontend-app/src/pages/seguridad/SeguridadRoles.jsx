import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSeguridad } from "../../hooks/useSeguridad";


/**
 * ============================================================
 * SEGURIDAD ROLES — MOLSAN ERP SAAS PREMIUM 2027
 * ============================================================
 *
 * IMPORTANTE:
 *
 * Este componente NO realiza cargas globales.
 *
 * La carga de Seguridad se realiza exclusivamente desde:
 *
 * Seguridad.jsx
 *
 * Este módulo solamente consume:
 *
 * - roles
 * - empleados
 * - permisos
 *
 * ============================================================
 */

export default function SeguridadRoles() {

  const {
    roles = [],
    empleados = [],
    permisos = [],
  } = useSeguridad();


  // ============================================================
  // ESTADOS
  // ============================================================

  const [busqueda, setBusqueda] =
    useState("");

  const [orden, setOrden] =
    useState({
      campo: "nombre",
      asc: true,
    });

  const [rolSeleccionado, setRolSeleccionado] =
    useState(null);


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
  // EMPLEADOS POR ROL
  // ============================================================

  const empleadosPorRol = useMemo(() => {

    const mapa = {};

    empleadosSeguros.forEach(
      (empleado) => {

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

        const clave =
          String(rolId);

        if (!mapa[clave]) {
          mapa[clave] = [];
        }

        mapa[clave].push(
          empleado
        );
      }
    );

    return mapa;

  }, [empleadosSeguros]);


  // ============================================================
  // PERMISOS POR MÓDULO
  // ============================================================

  const permisosPorModulo = useMemo(() => {

    const mapa = {};

    permisosSeguros.forEach(
      (permiso) => {

        const modulo =
          permiso.modulo;

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
      }
    );

    return mapa;

  }, [permisosSeguros]);


  // ============================================================
  // CATÁLOGO DE MÓDULOS
  // ============================================================

  const modulosDisponibles =
    useMemo(() => {

      return Object.keys(
        permisosPorModulo
      ).sort(
        (a, b) =>
          a.localeCompare(
            b,
            "es",
            {
              sensitivity:
                "base",
            }
          )
      );

    }, [permisosPorModulo]);


  // ============================================================
  // ENRIQUECER ROLES
  // ============================================================

  const rolesEnriquecidos =
    useMemo(() => {

      return rolesSeguros.map(
        (rol) => {

          const usuarios =
            empleadosPorRol[
              String(rol.id)
            ] || [];


          const permisosRol =
            Array.isArray(
              rol.permisos
            )
              ? rol.permisos
              : Array.isArray(
                  rol.permisos_ids
                )
                ? rol.permisos_ids
                : [];


          const modulosRol =
            Array.isArray(
              rol.modulos
            )
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
                Number(
                  rol.usuarios_count
                )
              )
                ? Number(
                    rol.usuarios_count
                  )
                : usuarios.length,

            permisosCount:
              Number.isFinite(
                Number(
                  rol.permisos_count
                )
              )
                ? Number(
                    rol.permisos_count
                  )
                : permisosRol.length,

            modulosCount:
              Number.isFinite(
                Number(
                  rol.modulos_count
                )
              )
                ? Number(
                    rol.modulos_count
                  )
                : modulosRol.length,

            permisosRol,

            modulosRol,

          };
        }
      );

    }, [
      rolesSeguros,
      empleadosPorRol,
    ]);


  // ============================================================
  // FILTRAR
  // ============================================================

  const rolesFiltrados =
    useMemo(() => {

      const texto =
        busqueda
          .trim()
          .toLowerCase();

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
            .map(
              (valor) =>
                String(
                  valor ?? ""
                ).toLowerCase()
            )
            .join(" ");

          return contenido.includes(
            texto
          );
        }
      );

    }, [
      rolesEnriquecidos,
      busqueda,
    ]);


  // ============================================================
  // ORDENAR
  // ============================================================

  const ordenar =
    useCallback(
      (campo) => {

        setOrden(
          (prev) => ({
            campo,

            asc:
              prev.campo === campo
                ? !prev.asc
                : true,
          })
        );

      },
      []
    );


  const rolesOrdenados =
    useMemo(() => {

      const {
        campo,
        asc,
      } = orden;

      const direccion =
        asc ? 1 : -1;

      return [
        ...rolesFiltrados,
      ].sort(
        (a, b) => {

          let va =
            a?.[campo];

          let vb =
            b?.[campo];


          if (
            typeof va ===
              "number" &&
            typeof vb ===
              "number"
          ) {

            return (
              (va - vb) *
              direccion
            );
          }


          va =
            String(
              va ?? ""
            ).toLowerCase();

          vb =
            String(
              vb ?? ""
            ).toLowerCase();


          if (va < vb) {
            return -1 *
              direccion;
          }

          if (va > vb) {
            return 1 *
              direccion;
          }

          return 0;
        }
      );

    }, [
      rolesFiltrados,
      orden,
    ]);


  // ============================================================
  // SELECCIONAR ROL
  // ============================================================

  const seleccionarRol =
    useCallback(
      (rol) => {

        if (!rol) {
          return;
        }

        setRolSeleccionado(
          rol
        );

      },
      []
    );


  // ============================================================
  // LIMPIAR SELECCIÓN
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
      setRolSeleccionado(
        null
      );
    }

  }, [
    rolesOrdenados,
    rolSeleccionado,
  ]);


  // ============================================================
  // ESTADÍSTICAS
  // ============================================================

  const estadisticas =
    useMemo(() => {

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
          (totalActual, rol) =>
            totalActual +
            Number(
              rol.usuariosCount ||
              0
            ),
          0
        );


      const rolesConPermisos =
        rolesEnriquecidos.filter(
          (rol) =>
            Number(
              rol.permisosCount ||
              0
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

  const obtenerEstadoRol =
    useCallback(
      (rol) => {

        if (
          rol.activo === false ||
          rol.habilitado === false
        ) {

          return {

            texto:
              "INACTIVO",

            clase:
              "border-red-400/20 bg-red-400/10 text-red-300",

            punto:
              "bg-red-400",

          };
        }


        return {

          texto:
            "ACTIVO",

          clase:
            "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",

          punto:
            "bg-emerald-400",

        };

      },
      []
    );


  // ============================================================
  // CARGANDO
  // ============================================================
  //
  // El padre ya controla el loading global.
  //
  // Aquí solamente mostramos un estado vacío si aún
  // no existen roles.
  // ============================================================

  if (!Array.isArray(roles)) {

    return (
      <div
        className="
          p-6
          text-[var(--erp-text-soft)]
          animate-pulse
        "
      >
        Cargando roles…
      </div>
    );
  }


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div
      className="
        w-full
        space-y-6
      "
    >

      {/* ======================================================
          CABECERA
      ====================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-[var(--erp-border)]
          bg-[var(--erp-bg)]
          p-5
        "
      >

        <div
          className="
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-[var(--erp-primary-soft)]
                text-xl
              "
            >
              🛡️
            </div>


            <div>

              <h2
                className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-[var(--erp-text)]
                "
              >
                Roles de seguridad
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-[var(--erp-text-soft)]
                "
              >
                Control centralizado de perfiles y niveles de acceso.
              </p>

            </div>

          </div>


          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-[var(--erp-border)]
              bg-[var(--erp-surface)]
              px-3
              py-1.5
              text-xs
              font-semibold
              text-[var(--erp-text-soft)]
            "
          >

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-500
              "
            />

            {estadisticas.total} roles

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

        <div
          className="
            rounded-2xl
            border
            border-[var(--erp-border)]
            bg-[var(--erp-surface)]
            p-5
          "
        >

          <div className="flex items-center justify-between">

            <span
              className="
                text-sm
                text-[var(--erp-text-soft)]
              "
            >
              Total roles
            </span>

            <span className="text-xl">
              🛡️
            </span>

          </div>

          <div
            className="
              mt-3
              text-3xl
              font-bold
              text-[var(--erp-text)]
            "
          >
            {estadisticas.total}
          </div>

          <div
            className="
              mt-1
              text-xs
              text-[var(--erp-text-soft)]
            "
          >
            Perfiles definidos
          </div>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-[var(--erp-border)]
            bg-[var(--erp-surface)]
            p-5
          "
        >

          <div className="flex items-center justify-between">

            <span
              className="
                text-sm
                text-[var(--erp-text-soft)]
              "
            >
              Roles activos
            </span>

            <span className="text-xl">
              🟢
            </span>

          </div>

          <div
            className="
              mt-3
              text-3xl
              font-bold
              text-[var(--erp-text)]
            "
          >
            {estadisticas.activos}
          </div>

          <div
            className="
              mt-1
              text-xs
              text-[var(--erp-text-soft)]
            "
          >
            Disponibles para uso
          </div>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-[var(--erp-border)]
            bg-[var(--erp-surface)]
            p-5
          "
        >

          <div className="flex items-center justify-between">

            <span
              className="
                text-sm
                text-[var(--erp-text-soft)]
              "
            >
              Usuarios asignados
            </span>

            <span className="text-xl">
              👤
            </span>

          </div>

          <div
            className="
              mt-3
              text-3xl
              font-bold
              text-[var(--erp-text)]
            "
          >
            {estadisticas.usuariosAsignados}
          </div>

          <div
            className="
              mt-1
              text-xs
              text-[var(--erp-text-soft)]
            "
          >
            Distribuidos entre roles
          </div>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-[var(--erp-border)]
            bg-[var(--erp-surface)]
            p-5
          "
        >

          <div className="flex items-center justify-between">

            <span
              className="
                text-sm
                text-[var(--erp-text-soft)]
              "
            >
              Roles con permisos
            </span>

            <span className="text-xl">
              🔐
            </span>

          </div>

          <div
            className="
              mt-3
              text-3xl
              font-bold
              text-[var(--erp-text)]
            "
          >
            {estadisticas.rolesConPermisos}
          </div>

          <div
            className="
              mt-1
              text-xs
              text-[var(--erp-text-soft)]
            "
          >
            Con configuración de acceso
          </div>

        </div>

      </div>


      {/* ======================================================
          TABLA
      ====================================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-[var(--erp-border)]
          bg-[var(--erp-surface)]
        "
      >

        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-[var(--erp-border)]
            p-5
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div>

            <h3
              className="
                text-lg
                font-semibold
                text-[var(--erp-text)]
              "
            >
              Perfiles de seguridad
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-[var(--erp-text-soft)]
              "
            >
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
                rounded-xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-bg)]
                px-4
                py-2.5
                text-sm
                text-[var(--erp-text)]
                placeholder-[var(--erp-text-soft)]
                outline-none
                transition
                focus:border-[var(--erp-primary)]
                focus:ring-2
                focus:ring-[var(--erp-primary-soft)]
              "
            />

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px] text-sm">

            <thead
              className="
                border-b
                border-[var(--erp-border)]
                bg-[var(--erp-bg)]
              "
            >

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
                    text-[var(--erp-text-soft)]
                  "
                  onClick={() =>
                    ordenar("id")
                  }
                >
                  ID{" "}
                  {orden.campo === "id" &&
                    (
                      orden.asc
                        ? "▲"
                        : "▼"
                    )}
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
                    text-[var(--erp-text-soft)]
                  "
                  onClick={() =>
                    ordenar("nombre")
                  }
                >
                  Rol{" "}
                  {orden.campo === "nombre" &&
                    (
                      orden.asc
                        ? "▲"
                        : "▼"
                    )}
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
                    text-[var(--erp-text-soft)]
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
                    text-[var(--erp-text-soft)]
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
                    (
                      orden.asc
                        ? "▲"
                        : "▼"
                    )}
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
                    text-[var(--erp-text-soft)]
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
                    (
                      orden.asc
                        ? "▲"
                        : "▼"
                    )}
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
                    text-[var(--erp-text-soft)]
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
                    (
                      orden.asc
                        ? "▲"
                        : "▼"
                    )}
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
                    text-[var(--erp-text-soft)]
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
                      key={String(rol.id)}
                      onClick={() =>
                        seleccionarRol(
                          rol
                        )
                      }
                      className={`
                        cursor-pointer
                        border-b
                        border-[var(--erp-border)]
                        transition
                        ${
                          seleccionado
                            ? "bg-[var(--erp-primary-soft)]"
                            : "hover:bg-[var(--erp-bg)]"
                        }
                      `}
                    >

                      <td
                        className="
                          px-5
                          py-4
                          text-[var(--erp-text-soft)]
                        "
                      >
                        #{rol.id}
                      </td>


                      <td className="px-5 py-4">

                        <div
                          className="
                            font-semibold
                            text-[var(--erp-text)]
                          "
                        >
                          {rol.nombre}
                        </div>

                        {(rol.descripcion ||
                          rol.codigo) && (

                          <div
                            className="
                              mt-1
                              max-w-md
                              truncate
                              text-xs
                              text-[var(--erp-text-soft)]
                            "
                          >
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
                            border
                            border-[var(--erp-border)]
                            bg-[var(--erp-bg)]
                            px-3
                            py-1.5
                            font-semibold
                            text-[var(--erp-text)]
                          "
                        >
                          {rol.usuariosCount}
                        </span>

                      </td>


                      <td
                        className="
                          px-5
                          py-4
                          text-center
                          text-[var(--erp-text)]
                        "
                      >
                        {rol.modulosCount}
                      </td>


                      <td
                        className="
                          px-5
                          py-4
                          text-center
                          text-[var(--erp-text)]
                        "
                      >
                        {rol.permisosCount}
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
                            border
                            border-[var(--erp-border)]
                            bg-[var(--erp-bg)]
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-[var(--erp-text-soft)]
                            transition
                            hover:bg-[var(--erp-primary-soft)]
                            hover:text-[var(--erp-primary)]
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

                    <p
                      className="
                        mt-3
                        font-semibold
                        text-[var(--erp-text)]
                      "
                    >
                      No hay roles
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-[var(--erp-text-soft)]
                      "
                    >
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
          DETALLE
      ====================================================== */}

      {rolSeleccionado && (

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-[var(--erp-border)]
            bg-[var(--erp-surface)]
          "
        >

          {/* CABECERA */}

          <div
            className="
              flex
              flex-col
              gap-4
              border-b
              border-[var(--erp-border)]
              p-6
              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[var(--erp-primary-soft)]
                  text-2xl
                "
              >
                🛡️
              </div>


              <div>

                <div
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-[var(--erp-text-soft)]
                  "
                >
                  Rol seleccionado
                </div>

                <h2
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    text-[var(--erp-text)]
                  "
                >
                  {rolSeleccionado.nombre}
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-[var(--erp-text-soft)]
                  "
                >
                  ID #{rolSeleccionado.id}
                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={() =>
                setRolSeleccionado(
                  null
                )
              }
              className="
                w-fit
                rounded-xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-bg)]
                px-4
                py-2
                text-sm
                text-[var(--erp-text-soft)]
                transition
                hover:bg-[var(--erp-primary-soft)]
                hover:text-[var(--erp-primary)]
              "
            >
              Cerrar
            </button>

          </div>


          {/* RESUMEN */}

          <div
            className="
              grid
              grid-cols-1
              gap-4
              p-6
              sm:grid-cols-3
            "
          >

            <div
              className="
                rounded-2xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-bg)]
                p-4
              "
            >

              <div
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-[var(--erp-text-soft)]
                "
              >
                Usuarios
              </div>

              <div
                className="
                  mt-2
                  text-2xl
                  font-bold
                  text-[var(--erp-text)]
                "
              >
                {rolSeleccionado.usuariosCount}
              </div>

            </div>


            <div
              className="
                rounded-2xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-bg)]
                p-4
              "
            >

              <div
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-[var(--erp-text-soft)]
                "
              >
                Módulos
              </div>

              <div
                className="
                  mt-2
                  text-2xl
                  font-bold
                  text-[var(--erp-text)]
                "
              >
                {rolSeleccionado.modulosCount}
              </div>

            </div>


            <div
              className="
                rounded-2xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-bg)]
                p-4
              "
            >

              <div
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-[var(--erp-text-soft)]
                "
              >
                Permisos
              </div>

              <div
                className="
                  mt-2
                  text-2xl
                  font-bold
                  text-[var(--erp-text)]
                "
              >
                {rolSeleccionado.permisosCount}
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
              border-[var(--erp-border)]
              p-6
              lg:grid-cols-2
            "
          >

            {/* USUARIOS */}

            <div>

              <div className="mb-3">

                <h3
                  className="
                    font-semibold
                    text-[var(--erp-text)]
                  "
                >
                  👥 Usuarios asignados
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[var(--erp-text-soft)]
                  "
                >
                  Empleados vinculados a este rol.
                </p>

              </div>


              <div className="space-y-2">

                {Array.isArray(
                  rolSeleccionado.usuarios
                ) &&
                  rolSeleccionado.usuarios
                    .slice(0, 10)
                    .map(
                      (empleado) => (

                        <div
                          key={String(
                            empleado.id
                          )}
                          className="
                            flex
                            items-center
                            justify-between
                            rounded-xl
                            border
                            border-[var(--erp-border)]
                            bg-[var(--erp-bg)]
                            px-4
                            py-3
                          "
                        >

                          <div>

                            <div
                              className="
                                font-medium
                                text-[var(--erp-text)]
                              "
                            >
                              {empleado.nombre}
                            </div>

                            <div
                              className="
                                text-xs
                                text-[var(--erp-text-soft)]
                              "
                            >
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
                                  ? "bg-emerald-500"
                                  : "bg-red-500"
                              }
                            `}
                          />

                        </div>

                      )
                    )}


                {(!Array.isArray(
                  rolSeleccionado.usuarios
                ) ||
                  rolSeleccionado
                    .usuarios.length ===
                    0) && (

                  <div
                    className="
                      rounded-xl
                      border
                      border-dashed
                      border-[var(--erp-border)]
                      p-5
                      text-center
                      text-sm
                      text-[var(--erp-text-soft)]
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

                    <div
                      className="
                        text-xs
                        text-[var(--erp-text-soft)]
                      "
                    >
                      Mostrando los primeros 10 usuarios.
                    </div>

                  )}

              </div>

            </div>


            {/* CONFIGURACIÓN DEL ROL */}

            <div>

              <div className="mb-3">

                <h3
                  className="
                    font-semibold
                    text-[var(--erp-text)]
                  "
                >
                  🔐 Configuración del rol
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[var(--erp-text-soft)]
                  "
                >
                  Módulos y permisos asociados al perfil.
                </p>

              </div>


              <div className="space-y-3">

                {/* MÓDULOS DEL ROL */}

                {Array.isArray(
                  rolSeleccionado.modulosRol
                ) &&
                  rolSeleccionado
                    .modulosRol.length >
                    0 && (

                    <div
                      className="
                        rounded-xl
                        border
                        border-[var(--erp-border)]
                        bg-[var(--erp-bg)]
                        p-4
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >

                        <span
                          className="
                            font-medium
                            text-[var(--erp-text)]
                          "
                        >
                          Módulos asignados
                        </span>

                        <span
                          className="
                            rounded-full
                            border
                            border-[var(--erp-border)]
                            bg-[var(--erp-surface)]
                            px-2.5
                            py-1
                            text-[11px]
                            text-[var(--erp-text-soft)]
                          "
                        >
                          {
                            rolSeleccionado
                              .modulosRol
                              .length
                          }
                        </span>

                      </div>


                      <div
                        className="
                          mt-3
                          flex
                          flex-wrap
                          gap-2
                        "
                      >

                        {rolSeleccionado
                          .modulosRol
                          .slice(0, 20)
                          .map(
                            (modulo, index) => (

                              <span
                                key={`${modulo}-${index}`}
                                className="
                                  rounded-lg
                                  border
                                  border-[var(--erp-border)]
                                  bg-[var(--erp-surface)]
                                  px-2.5
                                  py-1.5
                                  text-xs
                                  text-[var(--erp-text-soft)]
                                "
                              >
                                {String(
                                  modulo
                                )}
                              </span>

                            )
                          )}

                      </div>

                    </div>

                  )}


                {/* PERMISOS DEL ROL */}

                {Array.isArray(
                  rolSeleccionado.permisosRol
                ) &&
                  rolSeleccionado
                    .permisosRol.length >
                    0 && (

                    <div
                      className="
                        rounded-xl
                        border
                        border-[var(--erp-border)]
                        bg-[var(--erp-bg)]
                        p-4
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >

                        <span
                          className="
                            font-medium
                            text-[var(--erp-text)]
                          "
                        >
                          Permisos asignados
                        </span>

                        <span
                          className="
                            rounded-full
                            border
                            border-[var(--erp-border)]
                            bg-[var(--erp-surface)]
                            px-2.5
                            py-1
                            text-[11px]
                            text-[var(--erp-text-soft)]
                          "
                        >
                          {
                            rolSeleccionado
                              .permisosRol
                              .length
                          }
                        </span>

                      </div>


                      <div
                        className="
                          mt-3
                          flex
                          flex-wrap
                          gap-2
                        "
                      >

                        {rolSeleccionado
                          .permisosRol
                          .slice(0, 20)
                          .map(
                            (permiso, index) => (

                              <span
                                key={`${permiso}-${index}`}
                                className="
                                  rounded-lg
                                  border
                                  border-[var(--erp-border)]
                                  bg-[var(--erp-surface)]
                                  px-2.5
                                  py-1.5
                                  text-xs
                                  text-[var(--erp-text-soft)]
                                "
                              >
                                {String(
                                  permiso
                                )}
                              </span>

                            )
                          )}

                      </div>

                    </div>

                  )}


                {/* SI NO HAY CONFIGURACIÓN ESPECÍFICA */}

                {(!Array.isArray(
                  rolSeleccionado.modulosRol
                ) ||
                  rolSeleccionado
                    .modulosRol.length ===
                    0) &&
                  (!Array.isArray(
                    rolSeleccionado.permisosRol
                  ) ||
                    rolSeleccionado
                      .permisosRol.length ===
                      0) && (

                    <div
                      className="
                        rounded-xl
                        border
                        border-dashed
                        border-[var(--erp-border)]
                        p-5
                        text-center
                        text-sm
                        text-[var(--erp-text-soft)]
                      "
                    >
                      El backend no proporciona actualmente una configuración específica de módulos y permisos para este rol.
                    </div>

                  )}

              </div>

            </div>

          </div>


          {/* CATÁLOGO GLOBAL */}

          <div
            className="
              border-t
              border-[var(--erp-border)]
              bg-[var(--erp-bg)]
              px-6
              py-5
            "
          >

            <div
              className="
                flex
                flex-col
                gap-2
                md:flex-row
                md:items-center
                md:justify-between
              "
            >

              <div>

                <div
                  className="
                    text-sm
                    font-semibold
                    text-[var(--erp-text)]
                  "
                >
                  Catálogo global disponible
                </div>

                <div
                  className="
                    mt-1
                    text-xs
                    text-[var(--erp-text-soft)]
                  "
                >
                  {modulosDisponibles.length} módulos disponibles en el sistema.
                </div>

              </div>


              <div
                className="
                  inline-flex
                  w-fit
                  rounded-full
                  border
                  border-[var(--erp-border)]
                  bg-[var(--erp-surface)]
                  px-3
                  py-1.5
                  text-[11px]
                  font-semibold
                  text-[var(--erp-text-soft)]
                "
              >
                CATÁLOGO DE PERMISOS
              </div>

            </div>


            {modulosDisponibles.length > 0 && (

              <div
                className="
                  mt-4
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  gap-3
                "
              >

                {modulosDisponibles
                  .slice(0, 12)
                  .map(
                    (modulo) => {

                      const lista =
                        permisosPorModulo[
                          modulo
                        ] || [];


                      return (

                        <div
                          key={modulo}
                          className="
                            rounded-xl
                            border
                            border-[var(--erp-border)]
                            bg-[var(--erp-surface)]
                            p-3
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-2
                            "
                          >

                            <span
                              className="
                                truncate
                                text-sm
                                font-medium
                                text-[var(--erp-text)]
                              "
                              title={modulo}
                            >
                              {modulo}
                            </span>

                            <span
                              className="
                                flex-shrink-0
                                rounded-full
                                border
                                border-[var(--erp-border)]
                                px-2
                                py-0.5
                                text-[10px]
                                text-[var(--erp-text-soft)]
                              "
                            >
                              {lista.length}
                            </span>

                          </div>

                        </div>

                      );

                    }
                  )}

              </div>

            )}

          </div>


          {/* AVISO */}

          <div
            className="
              border-t
              border-[var(--erp-border)]
              bg-[var(--erp-primary-soft)]
              px-6
              py-4
            "
          >

            <div
              className="
                flex
                flex-col
                gap-2
                md:flex-row
                md:items-center
                md:justify-between
              "
            >

              <div>

                <div
                  className="
                    text-sm
                    font-semibold
                    text-[var(--erp-text)]
                  "
                >
                  Configuración avanzada
                </div>

                <div
                  className="
                    mt-1
                    text-xs
                    text-[var(--erp-text-soft)]
                  "
                >
                  La edición completa del rol se centralizará en SeguridadRolEditor.
                </div>

              </div>


              <span
                className="
                  w-fit
                  rounded-full
                  border
                  border-[var(--erp-border)]
                  bg-[var(--erp-surface)]
                  px-3
                  py-1.5
                  text-[11px]
                  font-semibold
                  text-[var(--erp-primary)]
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
