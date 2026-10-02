import { useMemo, useState } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";


/**
 * ============================================================
 * SEGURIDAD — ROLES
 * MOLSAN ERP SAAS PREMIUM 2027
 * ============================================================
 *
 * - No realiza cargarTodo().
 * - Utiliza los datos cargados por Seguridad.jsx.
 * - Diseño claro compatible con el ERP.
 * - Roles desplegables para reducir altura.
 * ============================================================
 */


function texto(valor, fallback = "") {
  if (
    valor === null ||
    typeof valor === "undefined"
  ) {
    return fallback;
  }

  return String(valor);
}


function estadoBooleano(valor) {
  if (valor === true || valor === 1) {
    return true;
  }

  if (
    typeof valor === "string" &&
    ["true", "1", "si", "sí", "activo", "habilitado"]
      .includes(valor.trim().toLowerCase())
  ) {
    return true;
  }

  return false;
}


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


function IconoUsuario() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M4 21a8 8 0 0 1 16 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}


function CampoDetalle({
  etiqueta,
  valor,
}) {
  if (
    valor === null ||
    typeof valor === "undefined" ||
    valor === ""
  ) {
    return null;
  }

  return (
    <div
      className="
        rounded-xl
        border
        border-[var(--erp-border)]
        bg-[var(--erp-bg)]
        px-3
        py-2.5
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
        {etiqueta}
      </p>

      <p
        className="
          mt-1
          text-sm
          font-medium
          text-[var(--erp-text)]
          break-words
        "
      >
        {texto(valor)}
      </p>
    </div>
  );
}


function RolItem({
  rol,
  abierto,
  onToggle,
}) {
  const activo =
    rol?.activo === false ||
    rol?.habilitado === false
      ? false
      : true;

  const usuariosCount =
    Number(rol?.usuariosCount ?? 0);

  const permisosCount =
    Number(rol?.permisosCount ?? 0);

  return (
    <div
      className="
        rounded-2xl
        border
        border-[var(--erp-border)]
        bg-[var(--erp-surface)]
        overflow-hidden
        transition-all
        duration-200
        hover:shadow-sm
      "
    >

      <button
        type="button"
        onClick={onToggle}
        className="
          w-full
          flex
          items-center
          gap-3
          px-4
          py-3.5
          text-left
          transition
          hover:bg-[var(--erp-primary-soft)]
        "
        aria-expanded={abierto}
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
          <IconoUsuario />
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
              {texto(rol?.nombre, "Sin nombre")}
            </span>


            <span
              className="
                inline-flex
                items-center
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
              ID {texto(rol?.id, "-")}
            </span>


            <span
              className={`
                inline-flex
                items-center
                gap-1.5
                px-2
                py-0.5
                rounded-md
                text-[10px]
                font-semibold
                border
                ${
                  activo
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-red-50 border-red-100 text-red-700"
                }
              `}
            >

              <span
                className={`
                  w-1.5
                  h-1.5
                  rounded-full
                  ${
                    activo
                      ? "bg-emerald-500"
                      : "bg-red-500"
                  }
                `}
              />

              {activo ? "Activo" : "Inactivo"}

            </span>

          </div>


          <div
            className="
              flex
              flex-wrap
              gap-x-4
              gap-y-1
              mt-1
              text-[11px]
              text-[var(--erp-text-soft)]
            "
          >

            <span>
              {usuariosCount} usuario
              {usuariosCount === 1 ? "" : "s"}
            </span>

            <span>
              {permisosCount} permiso
              {permisosCount === 1 ? "" : "s"}
            </span>

          </div>

        </div>


        <div
          className="
            flex
            items-center
            justify-center
            w-8
            h-8
            rounded-lg
            text-[var(--erp-text-soft)]
            flex-shrink-0
          "
        >
          <Chevron abierto={abierto} />
        </div>

      </button>


      {abierto && (
        <div
          className="
            border-t
            border-[var(--erp-border)]
            bg-[var(--erp-bg)]
            px-4
            py-4
          "
        >

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-3
            "
          >

            <CampoDetalle
              etiqueta="Identificador"
              valor={rol?.id}
            />

            <CampoDetalle
              etiqueta="Nombre"
              valor={rol?.nombre}
            />

            <CampoDetalle
              etiqueta="Código"
              valor={rol?.codigo}
            />

            <CampoDetalle
              etiqueta="Descripción"
              valor={rol?.descripcion}
            />

            <CampoDetalle
              etiqueta="Usuarios asignados"
              valor={
                Number.isFinite(usuariosCount)
                  ? usuariosCount
                  : undefined
              }
            />

            <CampoDetalle
              etiqueta="Permisos"
              valor={
                Number.isFinite(permisosCount)
                  ? permisosCount
                  : undefined
              }
            />

            {typeof rol?.activo !== "undefined" && (
              <CampoDetalle
                etiqueta="Activo"
                valor={
                  estadoBooleano(rol.activo)
                    ? "Sí"
                    : "No"
                }
              />
            )}

            {typeof rol?.habilitado !== "undefined" && (
              <CampoDetalle
                etiqueta="Habilitado"
                valor={
                  estadoBooleano(rol.habilitado)
                    ? "Sí"
                    : "No"
                }
              />
            )}

          </div>

        </div>
      )}

    </div>
  );
}


export default function SeguridadRoles() {

  const {
    roles = [],
  } = useSeguridad();


  const [abiertos, setAbiertos] =
    useState({});


  const rolesSeguros = useMemo(() => {

    if (!Array.isArray(roles)) {
      return [];
    }

    return roles
      .filter(
        (rol) =>
          rol &&
          typeof rol === "object" &&
          typeof rol.id !== "undefined" &&
          typeof rol.nombre === "string"
      )
      .sort(
        (a, b) =>
          String(a.nombre)
            .localeCompare(
              String(b.nombre),
              "es",
              {
                sensitivity: "base",
              }
            )
      );

  }, [roles]);


  const toggleRol = (id) => {

    const clave = String(id);

    setAbiertos((prev) => ({
      ...prev,
      [clave]: !prev[clave],
    }));
  };


  const abrirTodos = () => {

    const estado = {};

    rolesSeguros.forEach((rol) => {
      estado[String(rol.id)] = true;
    });

    setAbiertos(estado);
  };


  const cerrarTodos = () => {
    setAbiertos({});
  };


  return (
    <div
      className="
        w-full
        space-y-4
      "
    >

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-3
        "
      >

        <div>

          <p
            className="
              text-sm
              font-semibold
              text-[var(--erp-text)]
            "
          >
            {rolesSeguros.length} roles configurados
          </p>

          <p
            className="
              text-xs
              text-[var(--erp-text-soft)]
              mt-0.5
            "
          >
            Pulsa un rol para consultar sus detalles.
          </p>

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


      {rolesSeguros.length === 0 ? (

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
              font-medium
              text-[var(--erp-text)]
            "
          >
            No hay roles disponibles.
          </p>

          <p
            className="
              text-xs
              text-[var(--erp-text-soft)]
              mt-1
            "
          >
            No se han encontrado roles configurados.
          </p>

        </div>

      ) : (

        <div
          className="
            space-y-2
          "
        >

          {rolesSeguros.map((rol) => (

            <RolItem
              key={String(rol.id)}
              rol={rol}
              abierto={
                abiertos[String(rol.id)] === true
              }
              onToggle={() =>
                toggleRol(rol.id)
              }
            />

          ))}

        </div>

      )}

    </div>
  );
}
