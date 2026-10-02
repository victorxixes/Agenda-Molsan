import {
  useCallback,
  useMemo,
} from "react";

import {
  useSeguridad,
} from "../../hooks/useSeguridad";


/* =========================================================
   SEGURIDAD — MÓDULOS
   MOLSAN ERP SAAS PREMIUM 2027
========================================================= */

export default function SeguridadModulos() {

  const {
    permisos = [],
    ficha,
    asignarModulos,
  } = useSeguridad();


  /* =======================================================
     DATOS EMPLEADO
  ======================================================= */

  const empleado =
    ficha?.empleado ||
    {};


  const modulosVisiblesRaw =
    empleado.modulos_visibles_list ||
    [];


  /* =======================================================
     MÓDULOS VISIBLES
  ======================================================= */

  const modulosVisibles =
    useMemo(
      () => {

        return Array.isArray(
          modulosVisiblesRaw
        )
          ? modulosVisiblesRaw.filter(
              (modulo) =>
                typeof modulo === "string"
            )
          : [];

      },
      [
        modulosVisiblesRaw,
      ]
    );


  /* =======================================================
     MÓDULOS DISPONIBLES
  ======================================================= */

  const modulosGlobales =
    useMemo(
      () => {

        if (
          !Array.isArray(
            permisos
          )
        ) {
          return [];
        }


        const lista =
          permisos

            .filter(
              (permiso) =>
                permiso &&
                typeof permiso === "object" &&
                typeof permiso.modulo === "string"
            )

            .map(
              (permiso) =>
                permiso.modulo
            );


        return [
          ...new Set(
            lista
          ),
        ];

      },
      [
        permisos,
      ]
    );


  /* =======================================================
     CAMBIAR MÓDULO
  ======================================================= */

  const cambiarModulo =
    useCallback(
      (modulo) => {

        if (
          typeof modulo !== "string"
        ) {
          return;
        }


        let nuevo;


        if (
          modulosVisibles.includes(
            modulo
          )
        ) {

          nuevo =
            modulosVisibles.filter(
              (item) =>
                item !== modulo
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


  /* =======================================================
     VALIDACIÓN
  ======================================================= */

  if (
    !ficha ||
    typeof ficha !== "object"
  ) {

    return null;

  }


  /* =======================================================
     ESTADÍSTICAS
  ======================================================= */

  const totalModulos =
    modulosGlobales.length;


  const modulosActivos =
    modulosVisibles.filter(
      (modulo) =>
        modulosGlobales.includes(
          modulo
        )
    ).length;


  const porcentaje =
    totalModulos > 0
      ? Math.round(
          (
            modulosActivos /
            totalModulos
          ) * 100
        )
      : 0;


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div
      className="
        erp-page
        space-y-6
        animate-fade-in
      "
    >

      {/* ===================================================
          CABECERA
      =================================================== */}

      <section
        className="
          erp-card
          p-6
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-6
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                gap-3
                mb-2
              "
            >

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  bg-[var(--erp-primary-soft)]
                  border
                  border-[var(--erp-border)]
                  text-xl
                  shrink-0
                "
              >
                🧩
              </div>


              <div>

                <div
                  className="
                    text-xs
                    uppercase
                    tracking-[0.16em]
                    font-semibold
                    text-[var(--erp-primary)]
                  "
                >
                  Seguridad
                </div>


                <h1
                  className="
                    text-2xl
                    font-semibold
                    text-[var(--erp-text)]
                    mt-0.5
                  "
                >
                  Módulos visibles
                </h1>

              </div>

            </div>


            <p
              className="
                text-sm
                text-[var(--erp-text-soft)]
                max-w-3xl
              "
            >
              Define qué módulos del ERP puede visualizar
              este empleado.
            </p>

          </div>


          {/* =================================================
              RESUMEN
          ================================================= */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
            "
          >

            <div
              className="
                rounded-xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-surface-soft)]
                px-4
                py-3
                min-w-[125px]
              "
            >

              <div
                className="
                  text-[11px]
                  uppercase
                  tracking-wide
                  font-semibold
                  text-[var(--erp-text-soft)]
                "
              >
                Módulos activos
              </div>


              <div
                className="
                  text-xl
                  font-semibold
                  text-[var(--erp-text)]
                  mt-0.5
                "
              >
                {modulosActivos}

                <span
                  className="
                    text-sm
                    font-normal
                    text-[var(--erp-text-soft)]
                  "
                >
                  {" "}
                  / {totalModulos}
                </span>

              </div>

            </div>


            <div
              className="
                rounded-xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-surface-soft)]
                px-4
                py-3
                min-w-[100px]
              "
            >

              <div
                className="
                  text-[11px]
                  uppercase
                  tracking-wide
                  font-semibold
                  text-[var(--erp-text-soft)]
                "
              >
                Acceso
              </div>


              <div
                className="
                  text-xl
                  font-semibold
                  text-[var(--erp-primary)]
                  mt-0.5
                "
              >
                {porcentaje}%
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================
          EMPLEADO
      =================================================== */}

      <section
        className="
          erp-card
          p-5
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
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
                w-10
                h-10
                rounded-xl
                flex
                items-center
                justify-center
                bg-[var(--erp-surface-soft)]
                border
                border-[var(--erp-border)]
                text-lg
                shrink-0
              "
            >
              👤
            </div>


            <div>

              <div
                className="
                  text-sm
                  font-semibold
                  text-[var(--erp-text)]
                "
              >
                {empleado.nombre || "Empleado"}{" "}
                {empleado.apellidos || ""}
              </div>


              <div
                className="
                  text-xs
                  text-[var(--erp-text-soft)]
                  mt-0.5
                "
              >
                Usuario:{" "}
                {empleado.usuario ||
                  "Sin usuario"}
              </div>

            </div>

          </div>


          <div
            className="
              inline-flex
              items-center
              gap-2
              text-xs
              font-medium
              text-[var(--erp-text-soft)]
            "
          >

            <span
              className="
                w-2
                h-2
                rounded-full
                bg-emerald-500
              "
            />

            Configuración de acceso

          </div>

        </div>

      </section>


      {/* ===================================================
          MÓDULOS
      =================================================== */}

      <section
        className="
          erp-card
          p-6
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            mb-5
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-semibold
                text-[var(--erp-text)]
              "
            >
              Módulos del sistema
            </h2>


            <p
              className="
                text-xs
                text-[var(--erp-text-soft)]
                mt-1
              "
            >
              Activa o desactiva la visibilidad
              de cada módulo.
            </p>

          </div>

        </div>


        {modulosGlobales.length === 0 ? (

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-[var(--erp-border)]
              bg-[var(--erp-surface-soft)]
              px-6
              py-10
              text-center
            "
          >

            <div
              className="
                text-3xl
                mb-3
              "
            >
              🧩
            </div>


            <div
              className="
                text-sm
                font-semibold
                text-[var(--erp-text)]
              "
            >
              No hay módulos disponibles
            </div>


            <div
              className="
                text-xs
                text-[var(--erp-text-soft)]
                mt-1
              "
            >
              No se han encontrado módulos configurables
              para este empleado.
            </div>

          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-4
            "
          >

            {modulosGlobales.map(
              (modulo) => {

                const activo =
                  modulosVisibles.includes(
                    modulo
                  );


                return (

                  <label
                    key={modulo}
                    className={`
                      group
                      flex
                      items-center
                      justify-between
                      gap-4
                      rounded-2xl
                      border
                      px-4
                      py-4
                      cursor-pointer
                      transition-all
                      duration-200

                      ${
                        activo
                          ? `
                            border-[var(--erp-primary)]
                            bg-[var(--erp-primary-soft)]
                          `
                          : `
                            border-[var(--erp-border)]
                            bg-[var(--erp-surface-soft)]
                            hover:border-[var(--erp-primary)]
                            hover:bg-[var(--erp-surface)]
                          `
                      }
                    `}
                  >

                    {/* =====================================
                        INFORMACIÓN MÓDULO
                    ===================================== */}

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        min-w-0
                      "
                    >

                      <div
                        className={`
                          w-10
                          h-10
                          rounded-xl
                          flex
                          items-center
                          justify-center
                          shrink-0
                          border
                          transition
                          ${
                            activo
                              ? `
                                bg-[var(--erp-primary)]
                                border-[var(--erp-primary)]
                                text-white
                              `
                              : `
                                bg-[var(--erp-surface)]
                                border-[var(--erp-border)]
                                text-[var(--erp-text-soft)]
                              `
                          }
                        `}
                      >
                        {activo
                          ? "✓"
                          : "○"}
                      </div>


                      <div
                        className="
                          min-w-0
                        "
                      >

                        <div
                          className="
                            text-sm
                            font-semibold
                            text-[var(--erp-text)]
                            truncate
                          "
                        >
                          {modulo}
                        </div>


                        <div
                          className="
                            text-[11px]
                            text-[var(--erp-text-soft)]
                            mt-0.5
                          "
                        >
                          {activo
                            ? "Módulo visible"
                            : "Módulo oculto"}
                        </div>

                      </div>

                    </div>


                    {/* =====================================
                        CHECKBOX REAL
                    ===================================== */}

                    <input
                      type="checkbox"
                      checked={activo}
                      onChange={() =>
                        cambiarModulo(
                          modulo
                        )
                      }
                      className="
                        sr-only
                      "
                    />


                    {/* =====================================
                        SWITCH
                    ===================================== */}

                    <div
                      className={`
                        relative
                        w-11
                        h-6
                        rounded-full
                        shrink-0
                        transition-colors
                        duration-200
                        ${
                          activo
                            ? "bg-[var(--erp-primary)]"
                            : "bg-slate-300"
                        }
                      `}
                    >

                      <div
                        className={`
                          absolute
                          top-1
                          left-0
                          w-4
                          h-4
                          rounded-full
                          bg-white
                          shadow-sm
                          transition-transform
                          duration-200
                          ${
                            activo
                              ? "translate-x-6"
                              : "translate-x-1"
                          }
                        `}
                      />

                    </div>

                  </label>

                );

              }
            )}

          </div>

        )}

      </section>

    </div>

  );
}
