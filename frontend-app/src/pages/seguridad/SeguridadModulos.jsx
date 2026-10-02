import {
  useCallback,
  useMemo,
  useState,
} from "react";

import { useSeguridad } from "../../hooks/useSeguridad";


/**
 * ============================================================
 * SEGURIDAD — MÓDULOS
 * MOLSAN ERP SAAS PREMIUM 2027
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


export default function SeguridadModulos() {

  const {
    permisos = [],
    ficha,
    asignarModulos,
  } = useSeguridad();


  const [listaAbierta, setListaAbierta] =
    useState(true);


  /**
   * ==========================================================
   * EMPLEADO
   * ==========================================================
   */

  const empleado =
    ficha &&
    typeof ficha === "object"
      ? ficha.empleado || {}
      : {};


  const modulosVisiblesRaw =
    empleado.modulos_visibles_list || [];


  /**
   * ==========================================================
   * MÓDULOS VISIBLES
   * ==========================================================
   */

  const modulosVisibles =
    useMemo(() => {

      return Array.isArray(
        modulosVisiblesRaw
      )
        ? modulosVisiblesRaw.filter(
            (modulo) =>
              typeof modulo === "string"
          )
        : [];

    }, [modulosVisiblesRaw]);


  /**
   * ==========================================================
   * MÓDULOS DISPONIBLES
   * ==========================================================
   */

  const modulosGlobales =
    useMemo(() => {

      if (!Array.isArray(permisos)) {
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
              permiso.modulo.trim()
          )
          .filter(Boolean);

      return [
        ...new Set(lista),
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

    }, [permisos]);


  /**
   * ==========================================================
   * CAMBIAR MÓDULO
   * ==========================================================
   */

  const cambiarModulo =
    useCallback(
      (modulo) => {

        if (
          typeof modulo !== "string" ||
          !empleado?.id
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
        empleado?.id,
      ]
    );


  /**
   * ==========================================================
   * SIN FICHA
   * ==========================================================
   */

  if (
    !ficha ||
    typeof ficha !== "object" ||
    !empleado?.id
  ) {

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
          <span className="text-lg">
            🔐
          </span>
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
          La configuración de módulos aparecerá aquí.
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

      {/* RESUMEN */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-3
        "
      >

        <div
          className="
            rounded-2xl
            border
            border-[var(--erp-border)]
            bg-[var(--erp-bg)]
            px-4
            py-4
          "
        >

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.08em]
              font-semibold
              text-[var(--erp-text-soft)]
            "
          >
            Disponibles
          </p>

          <p
            className="
              mt-1
              text-2xl
              font-bold
              text-[var(--erp-text)]
            "
          >
            {modulosGlobales.length}
          </p>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-emerald-100
            bg-emerald-50/60
            px-4
            py-4
          "
        >

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.08em]
              font-semibold
              text-emerald-600
            "
          >
            Visibles
          </p>

          <p
            className="
              mt-1
              text-2xl
              font-bold
              text-emerald-600
            "
          >
            {modulosVisibles.length}
          </p>

        </div>

      </div>


      {/* LISTADO PLEGABLE */}

      <section
        className="
          rounded-2xl
          border
          border-[var(--erp-border)]
          bg-[var(--erp-surface)]
          overflow-hidden
        "
      >

        <button
          type="button"
          onClick={() =>
            setListaAbierta(
              (prev) => !prev
            )
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
          aria-expanded={listaAbierta}
        >

          <div
            className="
              w-9
              h-9
              rounded-xl
              bg-[var(--erp-primary-soft)]
              text-[var(--erp-primary)]
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            <span className="text-base">
              🧩
            </span>
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
                Módulos del sistema
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
                {modulosGlobales.length} disponibles
              </span>

            </div>


            <p
              className="
                text-xs
                text-[var(--erp-text-soft)]
                mt-0.5
              "
            >
              Activa o desactiva el acceso visual a cada módulo.
            </p>

          </div>


          <div
            className="
              w-8
              h-8
              rounded-lg
              flex
              items-center
              justify-center
              text-[var(--erp-text-soft)]
              flex-shrink-0
            "
          >
            <Chevron
              abierto={listaAbierta}
            />
          </div>

        </button>


        {listaAbierta && (

          <div
            className="
              border-t
              border-[var(--erp-border)]
              bg-[var(--erp-bg)]
              p-4
            "
          >

            {modulosGlobales.length === 0 ? (

              <div
                className="
                  rounded-xl
                  border
                  border-dashed
                  border-[var(--erp-border)]
                  bg-[var(--erp-surface)]
                  px-5
                  py-8
                  text-center
                "
              >

                <p
                  className="
                    text-sm
                    font-medium
                    text-[var(--erp-text)]
                  "
                >
                  No hay módulos disponibles.
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[var(--erp-text-soft)]
                  "
                >
                  No se han encontrado módulos configurables.
                </p>

              </div>

            ) : (

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  xl:grid-cols-3
                  gap-2.5
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
                          gap-3
                          rounded-xl
                          border
                          px-3
                          py-3
                          cursor-pointer
                          transition-all
                          duration-200
                          ${
                            activo
                              ? "border-emerald-200 bg-emerald-50/70"
                              : "border-[var(--erp-border)] bg-[var(--erp-surface)] hover:border-[var(--erp-primary)] hover:bg-[var(--erp-primary-soft)]"
                          }
                        `}
                      >

                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                          "
                        >

                          <span
                            className={`
                              w-2.5
                              h-2.5
                              rounded-full
                              flex-shrink-0
                              border
                              ${
                                activo
                                  ? "bg-emerald-500 border-emerald-600"
                                  : "bg-slate-300 border-slate-400"
                              }
                            `}
                          />

                          <span
                            className={`
                              truncate
                              text-sm
                              font-medium
                              ${
                                activo
                                  ? "text-[var(--erp-text)]"
                                  : "text-[var(--erp-text-soft)]"
                              }
                            `}
                            title={modulo}
                          >
                            {modulo}
                          </span>

                        </div>


                        <input
                          type="checkbox"
                          checked={activo}
                          onChange={() =>
                            cambiarModulo(
                              modulo
                            )
                          }
                          className="
                            h-4
                            w-4
                            flex-shrink-0
                            cursor-pointer
                            accent-[var(--erp-primary)]
                          "
                        />

                      </label>
                    );

                  }
                )}

              </div>

            )}

          </div>

        )}

      </section>

    </div>
  );
}
