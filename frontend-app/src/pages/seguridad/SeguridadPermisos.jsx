import {
  useCallback,
  useMemo,
  useState,
} from "react";

import { useSeguridad } from "../../hooks/useSeguridad";


/**
 * ============================================================
 * SEGURIDAD — PERMISOS
 * MOLSAN ERP SAAS PREMIUM 2027
 * ============================================================
 *
 * Cada módulo funciona como acordeón independiente.
 *
 * Cerrado:
 *   - nombre del módulo
 *   - número de permisos
 *   - número de permisos activos
 *   - estado de acceso
 *
 * Abierto:
 *   - permisos individuales
 *   - checkboxes
 * ============================================================
 */


function Chevron({ abierto }) {
  return (
    <svg
      className={`
        w-4
        h-4
        transition-transform
        duration-200
        ${abierto ? "rotate-180" : ""}
      `}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function IconoEscudo() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3L19 6V11C19 16 16 19.5 12 21C8 19.5 5 16 5 11V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M9 12L11 14L15 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export default function SeguridadPermisos() {

  const {
    permisos = [],
    ficha,
    asignarPermisos,
    cargarFicha,
  } = useSeguridad();


  const [busqueda, setBusqueda] =
    useState("");

  const [moduloSeleccionado, setModuloSeleccionado] =
    useState("todos");

  const [procesando, setProcesando] =
    useState(false);

  const [abiertos, setAbiertos] =
    useState({});


  /**
   * ==========================================================
   * EMPLEADO
   * ==========================================================
   */

  const empleado =
    ficha &&
    typeof ficha === "object" &&
    ficha.empleado &&
    typeof ficha.empleado === "object"
      ? ficha.empleado
      : null;


  const empleadoId =
    empleado &&
    Number.isFinite(Number(empleado.id)) &&
    Number(empleado.id) > 0
      ? Number(empleado.id)
      : null;


  /**
   * ==========================================================
   * PERMISOS DEL EMPLEADO
   * ==========================================================
   */

  const permisosEmpleado = useMemo(() => {

    if (
      !ficha ||
      typeof ficha !== "object"
    ) {
      return {};
    }

    if (
      !ficha.permisos_modulo_dict ||
      typeof ficha.permisos_modulo_dict !== "object" ||
      Array.isArray(
        ficha.permisos_modulo_dict
      )
    ) {
      return {};
    }

    return ficha.permisos_modulo_dict;

  }, [ficha]);


  /**
   * ==========================================================
   * AGRUPAR PERMISOS
   * ==========================================================
   */

  const permisosGlobales = useMemo(() => {

    if (!Array.isArray(permisos)) {
      return {};
    }

    return permisos.reduce(
      (acc, permiso) => {

        if (
          !permiso ||
          typeof permiso !== "object" ||
          typeof permiso.modulo !== "string" ||
          typeof permiso.permiso !== "string"
        ) {
          return acc;
        }

        const modulo =
          permiso.modulo.trim();

        const nombrePermiso =
          permiso.permiso.trim();

        if (
          !modulo ||
          !nombrePermiso
        ) {
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


  /**
   * ==========================================================
   * ORDENAR
   * ==========================================================
   */

  const permisosGlobalesOrdenados =
    useMemo(() => {

      const resultado = {};

      Object.keys(
        permisosGlobales
      )
        .sort(
          (a, b) =>
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
            ...(permisosGlobales[modulo] || []),
          ].sort(
            (a, b) =>
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


  /**
   * ==========================================================
   * MÓDULOS
   * ==========================================================
   */

  const modulos = useMemo(
    () =>
      Object.keys(
        permisosGlobalesOrdenados
      ),
    [permisosGlobalesOrdenados]
  );


  /**
   * ==========================================================
   * FILTRADO
   * ==========================================================
   */

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
            permisosCoinciden.length > 0
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


  /**
   * ==========================================================
   * ESTADÍSTICAS
   * ==========================================================
   */

  const estadisticas =
    useMemo(() => {

      const modulos =
        Object.keys(
          permisosGlobalesOrdenados
        );

      const disponibles =
        modulos.reduce(
          (total, modulo) =>
            total +
            (
              permisosGlobalesOrdenados[
                modulo
              ]?.length || 0
            ),
          0
        );

      const asignados =
        modulos.reduce(
          (total, modulo) => {

            const disponiblesModulo =
              permisosGlobalesOrdenados[
                modulo
              ] || [];

            const activos =
              disponiblesModulo.filter(
                (permiso) =>
                  Array.isArray(
                    permisosEmpleado[
                      modulo
                    ]
                  ) &&
                  permisosEmpleado[
                    modulo
                  ].includes(permiso)
              ).length;

            return total + activos;

          },
          0
        );

      return {
        modulos: modulos.length,
        disponibles,
        asignados,
      };

    }, [
      permisosGlobalesOrdenados,
      permisosEmpleado,
    ]);


  /**
   * ==========================================================
   * CAMBIAR PERMISO
   * ==========================================================
   */

  const cambiarPermiso =
    useCallback(
      async (
        modulo,
        permiso
      ) => {

        if (
          !empleadoId ||
          typeof modulo !== "string" ||
          typeof permiso !== "string"
        ) {
          return;
        }

        const nuevo = {
          ...permisosEmpleado,
        };

        if (
          !Array.isArray(
            nuevo[modulo]
          )
        ) {
          nuevo[modulo] = [];
        }

        if (
          nuevo[modulo].includes(
            permiso
          )
        ) {

          nuevo[modulo] =
            nuevo[modulo].filter(
              (p) =>
                p !== permiso
            );

        } else {

          nuevo[modulo] = [
            ...nuevo[modulo],
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


  /**
   * ==========================================================
   * TOGGLE MÓDULO
   * ==========================================================
   */

  const toggleModulo =
    (modulo) => {

      setAbiertos(
        (prev) => ({
          ...prev,
          [modulo]:
            !prev[modulo],
        })
      );

    };


  const abrirTodos = () => {

    const nuevo = {};

    Object.keys(
      permisosFiltrados
    ).forEach(
      (modulo) => {
        nuevo[modulo] = true;
      }
    );

    setAbiertos(nuevo);

  };


  const cerrarTodos = () => {
    setAbiertos({});
  };


  /**
   * ==========================================================
   * SIN FICHA
   * ==========================================================
   */

  if (!ficha || !empleado) {

    return (
      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-[var(--erp-border)]
          bg-[var(--erp-bg)]
          px-5
          py-12
          text-center
        "
      >

        <div
          className="
            w-11
            h-11
            rounded-xl
            bg-[var(--erp-primary-soft)]
            text-[var(--erp-primary)]
            flex
            items-center
            justify-center
            mx-auto
            mb-3
          "
        >
          <IconoEscudo />
        </div>

        <p
          className="
            text-sm
            font-semibold
            text-[var(--erp-text)]
          "
        >
          Selecciona un empleado
        </p>

        <p
          className="
            mt-1
            text-xs
            text-[var(--erp-text-soft)]
          "
        >
          La configuración de permisos aparecerá aquí.
        </p>

      </div>
    );
  }


  /**
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <div
      className="
        w-full
        space-y-4
      "
    >

      {/* FILTROS */}

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
            flex
            flex-col
            lg:flex-row
            gap-3
            lg:items-center
          "
        >

          <div className="flex-1">

            <label
              className="
                block
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.06em]
                text-[var(--erp-text-soft)]
                mb-1.5
              "
            >
              Buscar
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
                h-10
                rounded-xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-surface)]
                px-3
                text-sm
                text-[var(--erp-text)]
                outline-none
                focus:border-[var(--erp-primary)]
                focus:ring-2
                focus:ring-[var(--erp-primary-soft)]
              "
            />

          </div>


          <div className="w-full lg:w-64">

            <label
              className="
                block
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.06em]
                text-[var(--erp-text-soft)]
                mb-1.5
              "
            >
              Módulo
            </label>

            <select
              value={moduloSeleccionado}
              onChange={(e) =>
                setModuloSeleccionado(
                  e.target.value
                )
              }
              className="
                w-full
                h-10
                rounded-xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-surface)]
                px-3
                text-sm
                text-[var(--erp-text)]
                outline-none
                focus:border-[var(--erp-primary)]
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

        </div>


        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
            mt-4
            pt-3
            border-t
            border-[var(--erp-border)]
          "
        >

          <div
            className="
              flex
              flex-wrap
              gap-2
              text-xs
              text-[var(--erp-text-soft)]
            "
          >

            <span>
              {estadisticas.modulos} módulos
            </span>

            <span>·</span>

            <span>
              {estadisticas.asignados} asignados
            </span>

            <span>·</span>

            <span>
              {estadisticas.disponibles} disponibles
            </span>

            {procesando && (
              <>
                <span>·</span>
                <span
                  className="
                    text-[var(--erp-primary)]
                    font-medium
                  "
                >
                  Guardando…
                </span>
              </>
            )}

          </div>


          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <button
              type="button"
              onClick={abrirTodos}
              className="
                px-3
                py-2
                rounded-lg
                border
                border-[var(--erp-border)]
                bg-[var(--erp-surface)]
                text-xs
                font-medium
                text-[var(--erp-text-soft)]
                hover:text-[var(--erp-primary)]
                hover:border-[var(--erp-primary)]
                transition
              "
            >
              Expandir todos
            </button>


            <button
              type="button"
              onClick={cerrarTodos}
              className="
                px-3
                py-2
                rounded-lg
                border
                border-[var(--erp-border)]
                bg-[var(--erp-surface)]
                text-xs
                font-medium
                text-[var(--erp-text-soft)]
                hover:text-[var(--erp-primary)]
                hover:border-[var(--erp-primary)]
                transition
              "
            >
              Contraer todos
            </button>

          </div>

        </div>

      </div>


      {/* MÓDULOS */}

      {Object.keys(
        permisosFiltrados
      ).length === 0 ? (

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-[var(--erp-border)]
            bg-[var(--erp-bg)]
            px-5
            py-10
            text-center
          "
        >

          <p
            className="
              text-sm
              font-semibold
              text-[var(--erp-text)]
            "
          >
            No hay permisos que mostrar
          </p>

          <p
            className="
              mt-1
              text-xs
              text-[var(--erp-text-soft)]
            "
          >
            Prueba con otro módulo o término de búsqueda.
          </p>

        </div>

      ) : (

        <div
          className="
            space-y-2
          "
        >

          {Object.entries(
            permisosFiltrados
          ).map(
            ([
              modulo,
              permisosDisponibles,
            ]) => {

              const permisosActivos =
                permisosDisponibles.filter(
                  (permiso) =>
                    Array.isArray(
                      permisosEmpleado[
                        modulo
                      ]
                    ) &&
                    permisosEmpleado[
                      modulo
                    ].includes(
                      permiso
                    )
                ).length;

              const completo =
                permisosDisponibles.length > 0 &&
                permisosActivos ===
                  permisosDisponibles.length;

              const abierto =
                abiertos[modulo] === true;

              return (
                <section
                  key={modulo}
                  className="
                    rounded-2xl
                    border
                    border-[var(--erp-border)]
                    bg-[var(--erp-surface)]
                    overflow-hidden
                    transition-all
                    duration-200
                  "
                >

                  <button
                    type="button"
                    onClick={() =>
                      toggleModulo(modulo)
                    }
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3.5
                      text-left
                      hover:bg-[var(--erp-primary-soft)]
                      transition
                    "
                    aria-expanded={abierto}
                  >

                    <div
                      className={`
                        w-9
                        h-9
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                        ${
                          completo
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-[var(--erp-primary-soft)] text-[var(--erp-primary)]"
                        }
                      `}
                    >
                      {completo ? (
                        <span className="text-sm font-bold">
                          ✓
                        </span>
                      ) : (
                        <IconoEscudo />
                      )}
                    </div>


                    <div className="min-w-0 flex-1">

                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >

                        <span
                          className="
                            text-sm
                            font-semibold
                            text-[var(--erp-text)]
                          "
                        >
                          {modulo}
                        </span>


                        <span
                          className="
                            px-2
                            py-0.5
                            rounded-md
                            bg-[var(--erp-bg)]
                            border
                            border-[var(--erp-border)]
                            text-[10px]
                            font-medium
                            text-[var(--erp-text-soft)]
                          "
                        >
                          {permisosDisponibles.length} permisos
                        </span>


                        <span
                          className={`
                            px-2
                            py-0.5
                            rounded-md
                            text-[10px]
                            font-semibold
                            ${
                              completo
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-[var(--erp-bg)] text-[var(--erp-text-soft)] border border-[var(--erp-border)]"
                            }
                          `}
                        >
                          {permisosActivos} activos
                        </span>

                      </div>

                    </div>


                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        flex-shrink-0
                      "
                    >

                      <span
                        className="
                          hidden
                          sm:inline
                          text-[11px]
                          text-[var(--erp-text-soft)]
                        "
                      >
                        {completo
                          ? "Acceso completo"
                          : "Configurar"}
                      </span>

                      <div
                        className="
                          w-8
                          h-8
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          text-[var(--erp-text-soft)]
                        "
                      >
                        <Chevron
                          abierto={abierto}
                        />
                      </div>

                    </div>

                  </button>


                  {abierto && (
                    <div
                      className="
                        border-t
                        border-[var(--erp-border)]
                        bg-[var(--erp-bg)]
                        p-4
                      "
                    >

                      <div
                        className="
                          grid
                          grid-cols-1
                          sm:grid-cols-2
                          xl:grid-cols-4
                          gap-2.5
                        "
                      >

                        {permisosDisponibles.map(
                          (permiso) => {

                            const activo =
                              Array.isArray(
                                permisosEmpleado[
                                  modulo
                                ]
                              ) &&
                              permisosEmpleado[
                                modulo
                              ].includes(
                                permiso
                              );

                            return (
                              <label
                                key={permiso}
                                className={`
                                  flex
                                  items-center
                                  gap-3
                                  rounded-xl
                                  border
                                  px-3
                                  py-2.5
                                  cursor-pointer
                                  transition
                                  ${
                                    activo
                                      ? "border-[var(--erp-primary)] bg-[var(--erp-primary-soft)]"
                                      : "border-[var(--erp-border)] bg-[var(--erp-surface)] hover:border-[var(--erp-primary)]"
                                  }
                                `}
                              >

                                <input
                                  type="checkbox"
                                  checked={activo}
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
                                    h-4
                                    w-4
                                    cursor-pointer
                                    accent-[var(--erp-primary)]
                                  "
                                />

                                <span
                                  className={`
                                    text-sm
                                    font-medium
                                    ${
                                      activo
                                        ? "text-[var(--erp-text)]"
                                        : "text-[var(--erp-text-soft)]"
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
                  )}

                </section>
              );

            }
          )}

        </div>

      )}

    </div>
  );
}
