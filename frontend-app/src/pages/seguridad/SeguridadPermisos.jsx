import { useMemo, useCallback } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadPermisos() {
  const {
    permisos = [],
    ficha,
    asignarPermisos,
  } = useSeguridad();

  const empleado =
    ficha &&
    typeof ficha === "object"
      ? ficha.empleado || {}
      : {};

  const permisosEmpleado =
    ficha &&
    typeof ficha === "object" &&
    ficha.permisos_modulo_dict &&
    typeof ficha.permisos_modulo_dict === "object"
      ? ficha.permisos_modulo_dict
      : {};

  // =========================================================
  // AGRUPAR PERMISOS
  // =========================================================

  const permisosGlobales = useMemo(() => {
    if (!Array.isArray(permisos)) {
      return {};
    }

    return permisos.reduce(
      (acc, p) => {
        if (
          !p ||
          typeof p !== "object" ||
          typeof p.modulo !== "string" ||
          typeof p.permiso !== "string"
        ) {
          return acc;
        }

        if (!acc[p.modulo]) {
          acc[p.modulo] = [];
        }

        if (
          !acc[p.modulo].includes(
            p.permiso
          )
        ) {
          acc[p.modulo].push(
            p.permiso
          );
        }

        return acc;
      },
      {}
    );
  }, [permisos]);

  // =========================================================
  // CAMBIAR PERMISO
  // =========================================================

  const cambiarPermiso = useCallback(
    (modulo, permiso) => {
      if (
        typeof modulo !== "string" ||
        typeof permiso !== "string" ||
        !empleado?.id
      ) {
        return;
      }

      const nuevo = {
        ...permisosEmpleado,
      };

      if (!Array.isArray(nuevo[modulo])) {
        nuevo[modulo] = [];
      }

      if (
        nuevo[modulo].includes(
          permiso
        )
      ) {
        nuevo[modulo] =
          nuevo[modulo].filter(
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
      empleado?.id,
    ]
  );

  // =========================================================
  // CONTADORES
  // =========================================================

  const totalModulos =
    Object.keys(
      permisosGlobales
    ).length;

  const totalPermisos =
    Object.values(
      permisosGlobales
    ).reduce(
      (total, lista) =>
        total + lista.length,
      0
    );

  const permisosAsignados =
    Object.values(
      permisosEmpleado
    ).reduce(
      (total, lista) =>
        total +
        (Array.isArray(lista)
          ? lista.length
          : 0),
      0
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
          min-h-[300px]
          items-center
          justify-center
          rounded-3xl
          border border-white/10
          bg-white/[0.04]
          p-8
          text-white
          backdrop-blur-xl
        "
      >
        <div className="text-center">
          <div className="mb-3 text-4xl">
            🔑
          </div>

          <p className="font-semibold text-white/80">
            Selecciona un empleado
          </p>

          <p className="mt-1 text-sm text-white/45">
            La configuración de permisos aparecerá aquí.
          </p>
        </div>
      </div>
    );
  }

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
          border border-white/15
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

        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
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
                border border-purple-400/20
                bg-purple-500/10
                text-2xl
                shadow-lg
              "
            >
              🔑
            </div>

            <div>
              <h2
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                Permisos por módulo
              </h2>

              <p className="mt-1 text-sm text-white/50">
                Gestiona las acciones que puede realizar cada empleado.
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
              border border-purple-400/20
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

            {empleado.nombre || "Empleado"}
          </div>
        </div>
      </div>

      {/* =====================================================
          RESUMEN
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          className="
            rounded-2xl
            border border-white/10
            bg-white/[0.045]
            p-5
            backdrop-blur-xl
            shadow-lg
          "
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
            Módulos
          </p>

          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-bold text-white">
              {totalModulos}
            </p>

            <span className="text-xl">
              🧩
            </span>
          </div>
        </div>

        <div
          className="
            rounded-2xl
            border border-blue-400/15
            bg-blue-400/[0.05]
            p-5
            backdrop-blur-xl
            shadow-lg
          "
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-300/60">
            Permisos disponibles
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

        <div
          className="
            rounded-2xl
            border border-emerald-400/15
            bg-emerald-400/[0.05]
            p-5
            backdrop-blur-xl
            shadow-lg
          "
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300/60">
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
      </div>

      {/* =====================================================
          PERMISOS
      ===================================================== */}

      <div
        className="
          rounded-3xl
          border border-white/15
          bg-white/[0.045]
          p-5
          backdrop-blur-2xl
          shadow-[0_20px_70px_rgba(0,0,0,0.22)]
          md:p-6
        "
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">
            Configuración de permisos
          </h3>

          <p className="mt-1 text-sm text-white/40">
            Selecciona las operaciones permitidas para cada módulo.
          </p>
        </div>

        {Object.keys(
          permisosGlobales
        ).length === 0 ? (
          <div
            className="
              rounded-2xl
              border border-dashed border-white/10
              bg-black/10
              px-5
              py-10
              text-center
            "
          >
            <div className="mb-3 text-3xl">
              🔑
            </div>

            <p className="font-medium text-white/60">
              No hay permisos disponibles.
            </p>

            <p className="mt-1 text-sm text-white/35">
              No se han encontrado permisos configurables.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(
              permisosGlobales
            ).map(
              ([
                modulo,
                permsDisponibles,
              ]) => {
                const permisosActivos =
                  Array.isArray(
                    permisosEmpleado[
                      modulo
                    ]
                  )
                    ? permisosEmpleado[
                        modulo
                      ]
                    : [];

                const cantidadActiva =
                  permisosActivos.filter(
                    (permiso) =>
                      permsDisponibles.includes(
                        permiso
                      )
                  ).length;

                const todosActivos =
                  permsDisponibles.length >
                    0 &&
                  cantidadActiva ===
                    permsDisponibles.length;

                return (
                  <div
                    key={modulo}
                    className="
                      overflow-hidden
                      rounded-2xl
                      border border-white/10
                      bg-black/10
                    "
                  >
                    {/* Cabecera módulo */}

                    <div
                      className="
                        flex
                        flex-col
                        gap-3
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
                          <h4 className="font-semibold text-white">
                            {modulo}
                          </h4>

                          <p className="text-xs text-white/35">
                            {cantidadActiva} de{" "}
                            {permsDisponibles.length}{" "}
                            permisos activos
                          </p>
                        </div>
                      </div>

                      {todosActivos && (
                        <span
                          className="
                            w-fit
                            rounded-full
                            border border-emerald-400/20
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
                    </div>

                    {/* Permisos */}

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
                      {permsDisponibles.map(
                        (perm) => {
                          const activo =
                            permisosActivos.includes(
                              perm
                            );

                          return (
                            <label
                              key={perm}
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
                                checked={activo}
                                onChange={() =>
                                  cambiarPermiso(
                                    modulo,
                                    perm
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
                                  capitalize
                                  ${
                                    activo
                                      ? "text-white"
                                      : "text-white/55"
                                  }
                                `}
                              >
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
          </div>
        )}
      </div>
    </div>
  );
}
