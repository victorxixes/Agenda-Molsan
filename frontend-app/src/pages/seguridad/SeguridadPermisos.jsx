import {
  useMemo,
  useCallback,
  useState,
} from "react";

import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadPermisos() {
  const {
    permisos = [],
    ficha,
    asignarPermisos,
    cargarFicha,
  } = useSeguridad();

  // =========================================================
  // ESTADOS
  // =========================================================

  const [busqueda, setBusqueda] = useState("");
  const [moduloSeleccionado, setModuloSeleccionado] =
    useState("todos");

  const [procesando, setProcesando] = useState(false);

  // =========================================================
  // EMPLEADO
  // =========================================================

  const empleado = useMemo(() => {
    if (
      !ficha ||
      typeof ficha !== "object"
    ) {
      return null;
    }

    if (
      !ficha.empleado ||
      typeof ficha.empleado !== "object"
    ) {
      return null;
    }

    return ficha.empleado;
  }, [ficha]);

  // =========================================================
  // ID EMPLEADO
  // =========================================================

  const empleadoId = useMemo(() => {
    if (!empleado) {
      return null;
    }

    const id = Number(empleado.id);

    return Number.isFinite(id) && id > 0
      ? id
      : null;
  }, [empleado]);

  // =========================================================
  // PERMISOS DEL EMPLEADO
  // =========================================================

  const permisosEmpleado = useMemo(() => {
    if (
      !ficha ||
      typeof ficha !== "object"
    ) {
      return {};
    }

    if (
      !ficha.permisos_modulo_dict ||
      typeof ficha.permisos_modulo_dict !==
        "object" ||
      Array.isArray(
        ficha.permisos_modulo_dict
      )
    ) {
      return {};
    }

    return ficha.permisos_modulo_dict;
  }, [ficha]);

  // =========================================================
  // AGRUPAR PERMISOS GLOBALES
  // =========================================================

  const permisosGlobales = useMemo(() => {
    if (!Array.isArray(permisos)) {
      return {};
    }

    return permisos.reduce(
      (acc, permiso) => {
        if (
          !permiso ||
          typeof permiso !== "object"
        ) {
          return acc;
        }

        if (
          typeof permiso.modulo !== "string" ||
          typeof permiso.permiso !== "string"
        ) {
          return acc;
        }

        const modulo =
          permiso.modulo.trim();

        const nombrePermiso =
          permiso.permiso.trim();

        if (!modulo || !nombrePermiso) {
          return acc;
        }

        if (!acc[modulo]) {
          acc[modulo] = [];
        }

        if (
          !acc[modulo].includes(
            nombrePermiso
          )
        ) {
          acc[modulo].push(
            nombrePermiso
          );
        }

        return acc;
      },
      {}
    );
  }, [permisos]);

  // =========================================================
  // ORDENAR PERMISOS
  // =========================================================

  const permisosGlobalesOrdenados =
    useMemo(() => {
      const resultado = {};

      Object.keys(
        permisosGlobales || {}
      )
        .sort((a, b) =>
          a.localeCompare(
            b,
            "es",
            {
              sensitivity: "base",
            }
          )
        )
        .forEach((modulo) => {
          resultado[modulo] = [
            ...(permisosGlobales[
              modulo
            ] || []),
          ].sort((a, b) =>
            a.localeCompare(
              b,
              "es",
              {
                sensitivity: "base",
              }
            )
          );
        });

      return resultado;
    }, [permisosGlobales]);

  // =========================================================
  // LISTA DE MÓDULOS
  // =========================================================

  const modulos = useMemo(
    () =>
      Object.keys(
        permisosGlobalesOrdenados
      ),
    [permisosGlobalesOrdenados]
  );

  // =========================================================
  // FILTRADO
  // =========================================================

  const permisosFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();

      const resultado = {};

      Object.entries(
        permisosGlobalesOrdenados
      ).forEach(
        ([
          modulo,
          listaPermisos,
        ]) => {
          if (
            moduloSeleccionado !==
              "todos" &&
            modulo !==
              moduloSeleccionado
          ) {
            return;
          }

          const moduloCoincide =
            modulo
              .toLowerCase()
              .includes(texto);

          const permisosCoinciden =
            listaPermisos.filter(
              (permiso) =>
                permiso
                  .toLowerCase()
                  .includes(texto)
            );

          if (
            !texto ||
            moduloCoincide
          ) {
            resultado[modulo] =
              listaPermisos;
            return;
          }

          if (
            permisosCoinciden.length >
            0
          ) {
            resultado[modulo] =
              permisosCoinciden;
          }
        }
      );

      return resultado;
    }, [
      permisosGlobalesOrdenados,
      busqueda,
      moduloSeleccionado,
    ]);

  // =========================================================
  // CONTADORES
  // =========================================================

  const totalModulos =
    modulos.length;

  const totalPermisos =
    Object.values(
      permisosGlobalesOrdenados
    ).reduce(
      (total, lista) =>
        total +
        lista.length,
      0
    );

  const permisosAsignados =
    Object.values(
      permisosEmpleado || {}
    ).reduce(
      (total, lista) =>
        total +
        (Array.isArray(lista)
          ? lista.length
          : 0),
      0
    );

  const porcentajeAsignado =
    totalPermisos > 0
      ? Math.round(
          (permisosAsignados /
            totalPermisos) *
            100
        )
      : 0;

  // =========================================================
  // CAMBIAR PERMISO
  // =========================================================

  const cambiarPermiso =
    useCallback(
      async (
        modulo,
        permiso
      ) => {
        if (
          !empleadoId ||
          typeof modulo !==
            "string" ||
          typeof permiso !==
            "string"
        ) {
          return;
        }

        const nuevo = {
          ...(permisosEmpleado ||
            {}),
        };

        const actuales =
          Array.isArray(
            nuevo[modulo]
          )
            ? [
                ...nuevo[
                  modulo
                ],
              ]
            : [];

        if (
          actuales.includes(
            permiso
          )
        ) {
          nuevo[modulo] =
            actuales.filter(
              (p) =>
                p !== permiso
            );
        } else {
          nuevo[modulo] = [
            ...actuales,
            permiso,
          ];
        }

        try {
          setProcesando(true);

          await asignarPermisos(
            empleadoId,
            nuevo
          );

          if (
            typeof cargarFicha ===
            "function"
          ) {
            await cargarFicha(
              empleadoId
            );
          }
        } catch (error) {
          console.error(
            "Error asignando permiso:",
            error
          );
        } finally {
          setProcesando(false);
        }
      },
      [
        empleadoId,
        permisosEmpleado,
        asignarPermisos,
        cargarFicha,
      ]
    );

  // =========================================================
  // CAMBIAR TODOS LOS PERMISOS DEL MÓDULO
  // =========================================================

  const cambiarTodosModulo =
    useCallback(
      async (
        modulo
      ) => {
        if (
          !empleadoId ||
          typeof modulo !==
            "string"
        ) {
          return;
        }

        const disponibles =
          Array.isArray(
            permisosGlobalesOrdenados[
              modulo
            ]
          )
            ? permisosGlobalesOrdenados[
                modulo
              ]
            : [];

        if (
          disponibles.length ===
          0
        ) {
          return;
        }

        const actuales =
          Array.isArray(
            permisosEmpleado?.[
              modulo
            ]
          )
            ? permisosEmpleado[
                modulo
              ]
            : [];

        const todosActivos =
          disponibles.every(
            (permiso) =>
              actuales.includes(
                permiso
              )
          );

        const nuevo = {
          ...(permisosEmpleado ||
            {}),
        };

        nuevo[modulo] =
          todosActivos
            ? []
            : [...disponibles];

        try {
          setProcesando(true);

          await asignarPermisos(
            empleadoId,
            nuevo
          );

          if (
            typeof cargarFicha ===
            "function"
          ) {
            await cargarFicha(
              empleadoId
            );
          }
        } catch (error) {
          console.error(
            "Error actualizando permisos del módulo:",
            error
          );
        } finally {
          setProcesando(false);
        }
      },
      [
        empleadoId,
        permisosEmpleado,
        permisosGlobalesOrdenados,
        asignarPermisos,
        cargarFicha,
      ]
    );

  // =========================================================
  // SIN FICHA
  // =========================================================

  if (
    !ficha ||
    typeof ficha !== "object"
  ) {
    return (
      <div
        className="
          flex
          min-h-[320px]
          items-center
          justify-center
          rounded-3xl
          border
          border-white/10
          bg-white/[0.04]
          p-8
          text-white
          backdrop-blur-xl
        "
      >
        <div className="text-center">
          <div className="mb-4 text-5xl">
            🔑
          </div>

          <p className="font-semibold text-white/80">
            Selecciona un empleado
          </p>

          <p className="mt-2 text-sm text-white/45">
            La configuración de permisos
            aparecerá aquí.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
        w-full
        space-y-6
        text-white
        animate-fade-in
      "
    >
      {/* =====================================================
          CABECERA
      ===================================================== */}

      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white/15
          bg-white/[0.06]
          px-6
          py-6
          backdrop-blur-2xl
          shadow-[0_20px_70px_rgba(0,0,0,0.28)]
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
            gap-5
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-purple-400/20
                bg-purple-500/10
                text-2xl
                shadow-lg
              "
            >
              🔑
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
                Permisos por módulo
              </h1>

              <p className="mt-1 text-sm text-white/50">
                Gestiona las acciones autorizadas
                para cada empleado.
              </p>
            </div>
          </div>

          <div
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-purple-400/20
              bg-purple-400/10
              px-4
              py-2
              text-xs
              font-semibold
              text-purple-300
            "
          >
            <span className="text-base">
              👤
            </span>

            {empleado?.nombre ||
              "Empleado"}
          </div>
        </div>
      </div>

      {/* =====================================================
          RESUMEN
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {/* MÓDULOS */}

        <div
          className="
            rounded-2xl
            border
            border-white/10
            bg-white/[0.045]
            p-5
            backdrop-blur-xl
            shadow-lg
          "
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-white/40
            "
          >
            Módulos
          </p>

          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-bold">
              {totalModulos}
            </p>

            <span className="text-xl">
              🧩
            </span>
          </div>
        </div>

        {/* DISPONIBLES */}

        <div
          className="
            rounded-2xl
            border
            border-blue-400/15
            bg-blue-400/[0.05]
            p-5
            backdrop-blur-xl
            shadow-lg
          "
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-blue-300/60
            "
          >
            Disponibles
          </p>

          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-bold text-blue-300">
              {totalPermisos}
            </p>

            <span className="text-xl">
              ⚙️
            </span>
          </div>
        </div>

        {/* ASIGNADOS */}

        <div
          className="
            rounded-2xl
            border
            border-emerald-400/15
            bg-emerald-400/[0.05]
            p-5
            backdrop-blur-xl
            shadow-lg
          "
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-emerald-300/60
            "
          >
            Asignados
          </p>

          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-bold text-emerald-300">
              {permisosAsignados}
            </p>

            <span className="text-xl">
              ✓
            </span>
          </div>
        </div>

        {/* COBERTURA */}

        <div
          className="
            rounded-2xl
            border
            border-purple-400/15
            bg-purple-400/[0.05]
            p-5
            backdrop-blur-xl
            shadow-lg
          "
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-purple-300/60
            "
          >
            Cobertura
          </p>

          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-bold text-purple-300">
              {porcentajeAsignado}%
            </p>

            <span className="text-xl">
              🛡️
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="
                h-full
                rounded-full
                bg-purple-400
                transition-all
              "
              style={{
                width: `${Math.min(
                  Math.max(
                    porcentajeAsignado,
                    0
                  ),
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          FILTROS
      ===================================================== */}

      <div
        className="
          rounded-3xl
          border
          border-white/15
          bg-white/[0.045]
          p-5
          backdrop-blur-2xl
          shadow-[0_20px_70px_rgba(0,0,0,0.22)]
          md:p-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-end
          "
        >
          <div className="flex-1">
            <label
              className="
                mb-2
                block
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-white/40
              "
            >
              Buscar permiso
            </label>

            <input
              type="text"
              value={busqueda}
              onChange={(e) =>
                setBusqueda(
                  e.target.value
                )
              }
              placeholder="Buscar módulo o permiso..."
              className="
                w-full
                rounded-xl
                border
                border-white/15
                bg-white/[0.06]
                px-4
                py-3
                text-sm
                text-white
                outline-none
                placeholder:text-white/30
                transition
                focus:border-purple-400/40
                focus:ring-2
                focus:ring-purple-400/20
              "
            />
          </div>

          <div className="w-full lg:w-64">
            <label
              className="
                mb-2
                block
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-white/40
              "
            >
              Módulo
            </label>

            <select
              value={
                moduloSeleccionado
              }
              onChange={(e) =>
                setModuloSeleccionado(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-white/15
                bg-slate-900/80
                px-4
                py-3
                text-sm
                text-white
                outline-none
                transition
                focus:border-purple-400/40
                focus:ring-2
                focus:ring-purple-400/20
              "
            >
              <option value="todos">
                Todos los módulos
              </option>

              {modulos.map(
                (modulo) => (
                  <option
                    key={modulo}
                    value={modulo}
                  >
                    {modulo}
                  </option>
                )
              )}
            </select>
          </div>

          {(busqueda ||
            moduloSeleccionado !==
              "todos") && (
            <button
              type="button"
              onClick={() => {
                setBusqueda("");
                setModuloSeleccionado(
                  "todos"
                );
              }}
              className="
                rounded-xl
                border
                border-white/10
                bg-white/[0.05]
                px-4
                py-3
                text-sm
                font-medium
                text-white/70
                transition
                hover:bg-white/10
                hover:text-white
              "
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          CONFIGURACIÓN
      ===================================================== */}

      <div
        className="
          rounded-3xl
          border
          border-white/15
          bg-white/[0.045]
          p-5
          backdrop-blur-2xl
          shadow-[0_20px_70px_rgba(0,0,0,0.22)]
          md:p-6
        "
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
            Configuración de permisos
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Activa o desactiva individualmente las
            operaciones permitidas.
          </p>
        </div>

        {Object.keys(
          permisosFiltrados
        ).length === 0 ? (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-white/10
              bg-black/10
              px-5
              py-12
              text-center
            "
          >
            <div className="mb-3 text-4xl">
              🔍
            </div>

            <p className="font-medium text-white/60">
              No se han encontrado permisos.
            </p>

            <p className="mt-1 text-sm text-white/35">
              Prueba con otro término de búsqueda
              o módulo.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(
              permisosFiltrados
            ).map(
              ([
                modulo,
                permisosDisponibles,
              ]) => {
                const permisosActivos =
                  Array.isArray(
                    permisosEmpleado?.[
                      modulo
                    ]
                  )
                    ? permisosEmpleado[
                        modulo
                      ]
                    : [];

                const cantidadActiva =
                  permisosDisponibles.filter(
                    (permiso) =>
                      permisosActivos.includes(
                        permiso
                      )
                  ).length;

                const todosActivos =
                  permisosDisponibles.length >
                    0 &&
                  cantidadActiva ===
                    permisosDisponibles.length;

                return (
                  <div
                    key={modulo}
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/10
                      bg-black/10
                    "
                  >
                    {/* CABECERA MÓDULO */}

                    <div
                      className="
                        flex
                        flex-col
                        gap-4
                        border-b
                        border-white/10
                        bg-white/[0.035]
                        px-4
                        py-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            text-sm
                            font-bold
                            ${
                              todosActivos
                                ? "bg-emerald-400/15 text-emerald-300"
                                : "bg-purple-400/10 text-purple-300"
                            }
                          `}
                        >
                          {todosActivos
                            ? "✓"
                            : "🔑"}
                        </div>

                        <div>
                          <h3 className="font-semibold text-white">
                            {modulo}
                          </h3>

                          <p className="text-xs text-white/35">
                            {cantidadActiva} de{" "}
                            {permisosDisponibles.length}{" "}
                            permisos activos
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {todosActivos && (
                          <span
                            className="
                              rounded-full
                              border
                              border-emerald-400/20
                              bg-emerald-400/10
                              px-3
                              py-1
                              text-[11px]
                              font-bold
                              uppercase
                              tracking-wider
                              text-emerald-300
                            "
                          >
                            Acceso completo
                          </span>
                        )}

                        <button
                          type="button"
                          disabled={
                            procesando
                          }
                          onClick={() =>
                            cambiarTodosModulo(
                              modulo
                            )
                          }
                          className="
                            rounded-xl
                            border
                            border-white/10
                            bg-white/[0.05]
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-white/65
                            transition
                            hover:bg-white/10
                            hover:text-white
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                          "
                        >
                          {todosActivos
                            ? "Desactivar todos"
                            : "Activar todos"}
                        </button>
                      </div>
                    </div>

                    {/* PERMISOS */}

                    <div
                      className="
                        grid
                        grid-cols-1
                        gap-3
                        p-4
                        sm:grid-cols-2
                        lg:grid-cols-4
                      "
                    >
                      {permisosDisponibles.map(
                        (permiso) => {
                          const activo =
                            permisosActivos.includes(
                              permiso
                            );

                          return (
                            <label
                              key={`${modulo}-${permiso}`}
                              className={`
                                group
                                flex
                                cursor-pointer
                                items-center
                                gap-3
                                rounded-xl
                                border
                                px-4
                                py-3
                                transition-all
                                duration-200
                                ${
                                  activo
                                    ? `
                                      border-emerald-400/25
                                      bg-emerald-400/[0.08]
                                    `
                                    : `
                                      border-white/10
                                      bg-white/[0.025]
                                      hover:border-white/20
                                      hover:bg-white/[0.055]
                                    `
                                }
                              `}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  activo
                                }
                                disabled={
                                  procesando
                                }
                                onChange={() =>
                                  cambiarPermiso(
                                    modulo,
                                    permiso
                                  )
                                }
                                className="
                                  h-5
                                  w-5
                                  shrink-0
                                  cursor-pointer
                                  accent-emerald-500
                                "
                              />

                              <span
                                className={`
                                  text-sm
                                  font-medium
                                  ${
                                    activo
                                      ? "text-white"
                                      : "text-white/55"
                                  }
                                `}
                              >
                                {permiso}
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
          </div>
        )}
      </div>
    </div>
  );
}
