import { useCallback, useMemo } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadModulos() {
  const {
    permisos = [],
    ficha,
    asignarModulos,
  } = useSeguridad();

  const empleado =
    ficha && typeof ficha === "object"
      ? ficha.empleado || {}
      : {};

  const modulosVisiblesRaw =
    empleado.modulos_visibles_list || [];

  // =========================================================
  // MÓDULOS VISIBLES
  // =========================================================

  const modulosVisibles = useMemo(() => {
    return Array.isArray(modulosVisiblesRaw)
      ? modulosVisiblesRaw.filter(
          (m) => typeof m === "string"
        )
      : [];
  }, [modulosVisiblesRaw]);

  // =========================================================
  // MÓDULOS DISPONIBLES
  // =========================================================

  const modulosGlobales = useMemo(() => {
    if (!Array.isArray(permisos)) {
      return [];
    }

    const lista = permisos
      .filter(
        (p) =>
          p &&
          typeof p === "object" &&
          typeof p.modulo === "string"
      )
      .map((p) => p.modulo);

    return [...new Set(lista)];
  }, [permisos]);

  // =========================================================
  // CAMBIAR MÓDULO
  // =========================================================

  const cambiarModulo = useCallback(
    (modulo) => {
      if (
        typeof modulo !== "string" ||
        !empleado?.id
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

      asignarModulos(
        empleado.id,
        nuevo
      );
    },
    [
      modulosVisibles,
      asignarModulos,
      empleado?.id,
    ]
  );

  // =========================================================
  // SIN FICHA
  // =========================================================

  if (!ficha || typeof ficha !== "object") {
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
            🔐
          </div>

          <p className="font-semibold text-white/80">
            Selecciona un empleado
          </p>

          <p className="mt-1 text-sm text-white/45">
            La configuración de módulos aparecerá aquí.
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
            h-48
            w-48
            rounded-full
            bg-cyan-500/10
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
                border border-blue-400/20
                bg-blue-500/10
                text-2xl
                shadow-lg
              "
            >
              🧩
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
                Módulos visibles
              </h2>

              <p className="mt-1 text-sm text-white/50">
                Configura los módulos que puede visualizar este empleado.
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
              border border-blue-400/20
              bg-blue-400/10
              px-4
              py-2
              text-xs
              font-semibold
              text-blue-300
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Disponibles
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {modulosGlobales.length}
              </p>
            </div>

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-white/10
                text-xl
              "
            >
              🧩
            </div>
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300/60">
                Visibles
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-300">
                {modulosVisibles.length}
              </p>
            </div>

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-emerald-400/10
                text-xl
              "
            >
              ✓
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          LISTADO
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
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-white">
            Módulos del sistema
          </h3>

          <p className="mt-1 text-sm text-white/40">
            Activa o desactiva el acceso visual a cada módulo.
          </p>
        </div>

        {modulosGlobales.length === 0 ? (
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
              🧩
            </div>

            <p className="font-medium text-white/60">
              No hay módulos disponibles.
            </p>

            <p className="mt-1 text-sm text-white/35">
              No se han encontrado módulos configurables.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {modulosGlobales.map((modulo) => {
              const activo =
                modulosVisibles.includes(modulo);

              return (
                <label
                  key={modulo}
                  className={`
                    group
                    flex
                    cursor-pointer
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    px-4
                    py-4
                    transition-all
                    duration-200
                    ${
                      activo
                        ? `
                          border-emerald-400/25
                          bg-emerald-400/[0.08]
                          shadow-[0_8px_30px_rgba(16,185,129,0.08)]
                        `
                        : `
                          border-white/10
                          bg-white/[0.025]
                          hover:border-white/20
                          hover:bg-white/[0.06]
                        `
                    }
                  `}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        text-sm
                        font-bold
                        transition
                        ${
                          activo
                            ? "bg-emerald-400/15 text-emerald-300"
                            : "bg-white/10 text-white/45"
                        }
                      `}
                    >
                      {activo ? "✓" : "•"}
                    </div>

                    <span
                      className={`
                        truncate
                        font-semibold
                        ${
                          activo
                            ? "text-white"
                            : "text-white/65"
                        }
                      `}
                    >
                      {modulo}
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={() =>
                      cambiarModulo(modulo)
                    }
                    className="
                      h-5
                      w-5
                      cursor-pointer
                      accent-emerald-500
                    "
                  />
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
