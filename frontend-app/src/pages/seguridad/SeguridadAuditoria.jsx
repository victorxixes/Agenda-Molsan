import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import axios from "../../api/axios";

const API = import.meta.env.VITE_API_URL;


/**
 * ============================================================
 * SEGURIDAD AUDITORÍA — MOLSAN ERP SAAS PREMIUM 2027
 * ============================================================
 *
 * Módulo independiente de auditoría.
 *
 * Backend:
 *
 * GET  /seguridad/auditoria/
 * GET  /seguridad/auditoria/empleado/{empleado_id}
 * GET  /seguridad/auditoria/metricas
 *
 * Responsabilidades:
 *
 * - Auditoría global
 * - Métricas
 * - Últimos logins
 * - Filtros
 * - Consulta por empleado
 * - Vista detallada de registros
 *
 * ============================================================
 */


/**
 * ============================================================
 * ICONO
 * ============================================================
 */

const Icono = ({
  name,
  className = "w-5 h-5",
}) => (
  <svg
    className={`${className} flex-shrink-0`}
    aria-hidden="true"
  >
    <use href={`/icons/icons.svg#${name}`} />
  </svg>
);


/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

function arraySeguro(valor) {
  return Array.isArray(valor)
    ? valor
    : [];
}


function textoSeguro(valor) {
  if (
    valor === null ||
    valor === undefined
  ) {
    return "";
  }

  return String(valor);
}


function numeroSeguro(valor) {
  const numero = Number(valor);

  return Number.isFinite(numero)
    ? numero
    : 0;
}


function formatearNumero(valor) {
  return numeroSeguro(valor).toLocaleString(
    "es-ES"
  );
}


function formatearFecha(valor) {

  if (!valor) {
    return "-";
  }

  try {

    const fecha =
      new Date(valor);

    if (
      Number.isNaN(
        fecha.getTime()
      )
    ) {
      return textoSeguro(valor);
    }

    return fecha.toLocaleString(
      "es-ES",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  } catch {

    return textoSeguro(valor);
  }
}


/**
 * ============================================================
 * BADGE ACCIÓN
 * ============================================================
 */

function BadgeAccion({
  accion,
}) {

  const valor =
    textoSeguro(
      accion
    ).trim();

  const normalizado =
    valor.toLowerCase();


  let classes =
    "bg-[var(--erp-primary-soft)] text-[var(--erp-primary)] border-[var(--erp-primary)]";


  if (
    normalizado.includes("error") ||
    normalizado.includes("fall")
  ) {

    classes =
      "bg-red-50 text-red-700 border-red-200";

  } else if (
    normalizado.includes("login")
  ) {

    classes =
      "bg-emerald-50 text-emerald-700 border-emerald-200";

  } else if (
    normalizado.includes("delete") ||
    normalizado.includes("eliminar") ||
    normalizado.includes("borrar")
  ) {

    classes =
      "bg-red-50 text-red-700 border-red-200";

  } else if (
    normalizado.includes("update") ||
    normalizado.includes("editar") ||
    normalizado.includes("modificar")
  ) {

    classes =
      "bg-amber-50 text-amber-700 border-amber-200";
  }


  return (
    <span
      className={`
        inline-flex
        items-center
        px-2.5
        py-1
        rounded-lg
        border
        text-[11px]
        font-semibold
        whitespace-nowrap
        ${classes}
      `}
    >
      {valor || "Actividad"}
    </span>
  );
}


/**
 * ============================================================
 * TARJETA KPI
 * ============================================================
 */

function KPI({
  icon,
  titulo,
  valor,
  descripcion,
  accent = "primary",
}) {

  const accents = {

    primary: {
      bg:
        "bg-[var(--erp-primary-soft)]",
      color:
        "text-[var(--erp-primary)]",
    },

    success: {
      bg:
        "bg-emerald-50",
      color:
        "text-emerald-600",
    },

    warning: {
      bg:
        "bg-amber-50",
      color:
        "text-amber-600",
    },

    danger: {
      bg:
        "bg-red-50",
      color:
        "text-red-600",
    },

  };


  const style =
    accents[accent] ||
    accents.primary;


  return (
    <div
      className="
        bg-[var(--erp-surface)]
        border
        border-[var(--erp-border)]
        rounded-2xl
        shadow-sm
        p-5
        transition
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >

        <div className="min-w-0">

          <p
            className="
              text-xs
              uppercase
              tracking-wide
              font-medium
              text-[var(--erp-text-soft)]
            "
          >
            {titulo}
          </p>

          <p
            className="
              text-2xl
              font-bold
              text-[var(--erp-text)]
              mt-1
            "
          >
            {valor}
          </p>

          <p
            className="
              text-xs
              text-[var(--erp-text-soft)]
              mt-1
            "
          >
            {descripcion}
          </p>

        </div>


        <div
          className={`
            w-10
            h-10
            rounded-xl
            ${style.bg}
            ${style.color}
            flex
            items-center
            justify-center
            flex-shrink-0
          `}
        >

          <Icono
            name={icon}
            className="w-5 h-5"
          />

        </div>

      </div>

    </div>
  );
}


/**
 * ============================================================
 * MÉTRICAS
 * ============================================================
 */

function PanelMetricas({
  metricas,
}) {

  const porModulo =
    arraySeguro(
      metricas?.por_modulo
    );

  const porAccion =
    arraySeguro(
      metricas?.por_accion
    );


  return (
    <div
      className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-5
      "
    >

      {/* POR MÓDULO */}

      <section
        className="
          bg-[var(--erp-surface)]
          border
          border-[var(--erp-border)]
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >

        <div
          className="
            px-5
            py-4
            border-b
            border-[var(--erp-border)]
          "
        >

          <h2
            className="
              text-base
              font-semibold
              text-[var(--erp-text)]
            "
          >
            Actividad por módulo
          </h2>

          <p
            className="
              text-xs
              text-[var(--erp-text-soft)]
              mt-0.5
            "
          >
            Distribución de registros de auditoría
          </p>

        </div>


        <div className="p-5">

          {porModulo.length === 0 ? (

            <p
              className="
                text-sm
                text-[var(--erp-text-soft)]
              "
            >
              No hay métricas disponibles.
            </p>

          ) : (

            <div className="space-y-3">

              {porModulo
                .slice(0, 8)
                .map(
                  (item, index) => {

                    const cantidad =
                      numeroSeguro(
                        item?.cantidad
                      );

                    const total =
                      numeroSeguro(
                        metricas?.total_registros
                      );

                    const porcentaje =
                      total > 0
                        ? Math.min(
                            100,
                            (cantidad / total) * 100
                          )
                        : 0;

                    return (
                      <div
                        key={
                          `${item?.modulo ?? "modulo"}-${index}`
                        }
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            mb-1
                          "
                        >

                          <span
                            className="
                              text-sm
                              text-[var(--erp-text)]
                              truncate
                            "
                          >
                            {textoSeguro(
                              item?.modulo
                            ) || "Sin módulo"}
                          </span>

                          <span
                            className="
                              text-xs
                              font-semibold
                              text-[var(--erp-text-soft)]
                            "
                          >
                            {formatearNumero(
                              cantidad
                            )}
                          </span>

                        </div>


                        <div
                          className="
                            h-2
                            rounded-full
                            bg-[var(--erp-bg)]
                            overflow-hidden
                          "
                        >

                          <div
                            className="
                              h-full
                              rounded-full
                              bg-[var(--erp-primary)]
                            "
                            style={{
                              width:
                                `${porcentaje}%`,
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )}

            </div>

          )}

        </div>

      </section>


      {/* POR ACCIÓN */}

      <section
        className="
          bg-[var(--erp-surface)]
          border
          border-[var(--erp-border)]
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >

        <div
          className="
            px-5
            py-4
            border-b
            border-[var(--erp-border)]
          "
        >

          <h2
            className="
              text-base
              font-semibold
              text-[var(--erp-text)]
            "
          >
            Actividad por acción
          </h2>

          <p
            className="
              text-xs
              text-[var(--erp-text-soft)]
              mt-0.5
            "
          >
            Operaciones registradas
          </p>

        </div>


        <div className="p-5">

          {porAccion.length === 0 ? (

            <p
              className="
                text-sm
                text-[var(--erp-text-soft)]
              "
            >
              No hay métricas disponibles.
            </p>

          ) : (

            <div className="flex flex-wrap gap-2">

              {porAccion
                .slice(0, 12)
                .map(
                  (item, index) => (

                    <div
                      key={
                        `${item?.accion ?? "accion"}-${index}`
                      }
                      className="
                        flex
                        items-center
                        gap-2
                        px-3
                        py-2
                        rounded-xl
                        border
                        border-[var(--erp-border)]
                        bg-[var(--erp-bg)]
                      "
                    >

                      <span
                        className="
                          text-sm
                          text-[var(--erp-text)]
                        "
                      >
                        {textoSeguro(
                          item?.accion
                        ) || "Actividad"}
                      </span>

                      <span
                        className="
                          text-xs
                          font-bold
                          text-[var(--erp-primary)]
                        "
                      >
                        {formatearNumero(
                          item?.cantidad
                        )}
                      </span>

                    </div>

                  )
                )}

            </div>

          )}

        </div>

      </section>

    </div>
  );
}


/**
 * ============================================================
 * ÚLTIMOS LOGINS
 * ============================================================
 */

function UltimosLogins({
  registros,
}) {

  const datos =
    arraySeguro(
      registros
    );


  return (
    <section
      className="
        bg-[var(--erp-surface)]
        border
        border-[var(--erp-border)]
        rounded-2xl
        shadow-sm
        overflow-hidden
      "
    >

      <div
        className="
          px-5
          py-4
          border-b
          border-[var(--erp-border)]
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

          <div>

            <h2
              className="
                text-base
                font-semibold
                text-[var(--erp-text)]
              "
            >
              Últimos accesos
            </h2>

            <p
              className="
                text-xs
                text-[var(--erp-text-soft)]
                mt-0.5
              "
            >
              Últimos eventos de login registrados
            </p>

          </div>

          <Icono
            name="user-group"
            className="
              w-5
              h-5
              text-[var(--erp-primary)]
            "
          />

        </div>

      </div>


      {datos.length === 0 ? (

        <div
          className="
            p-8
            text-center
            text-sm
            text-[var(--erp-text-soft)]
          "
        >
          No hay accesos registrados.
        </div>

      ) : (

        <div
          className="
            divide-y
            divide-[var(--erp-border)]
          "
        >

          {datos.map(
            (registro, index) => (

              <div
                key={
                  registro?.id ??
                  `login-${index}`
                }
                className="
                  px-5
                  py-3.5
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    min-w-0
                  "
                >

                  <div
                    className="
                      w-9
                      h-9
                      rounded-xl
                      bg-emerald-50
                      text-emerald-600
                      flex
                      items-center
                      justify-center
                      flex-shrink-0
                    "
                  >

                    <Icono
                      name="user-group"
                      className="w-4 h-4"
                    />

                  </div>


                  <div className="min-w-0">

                    <p
                      className="
                        text-sm
                        font-medium
                        text-[var(--erp-text)]
                      "
                    >
                      {textoSeguro(
                        registro?.usuario
                      ) || "Usuario desconocido"}
                    </p>

                    <p
                      className="
                        text-xs
                        text-[var(--erp-text-soft)]
                        mt-0.5
                      "
                    >
                      {textoSeguro(
                        registro?.ip
                      ) || "IP no disponible"}
                    </p>

                  </div>

                </div>


                <div
                  className="
                    text-xs
                    text-[var(--erp-text-soft)]
                    sm:text-right
                  "
                >
                  {formatearFecha(
                    registro?.fecha
                  )}
                </div>

              </div>

            )
          )}

        </div>

      )}

    </section>
  );
}


/**
 * ============================================================
 * TABLA AUDITORÍA
 * ============================================================
 */

function TablaAuditoria({
  registros,
  onSeleccionar,
}) {

  const datos =
    arraySeguro(
      registros
    );


  if (datos.length === 0) {

    return (
      <div
        className="
          py-14
          text-center
        "
      >

        <div
          className="
            w-12
            h-12
            rounded-2xl
            bg-[var(--erp-primary-soft)]
            text-[var(--erp-primary)]
            flex
            items-center
            justify-center
            mx-auto
            mb-3
          "
        >

          <Icono
            name="clipboard"
            className="w-6 h-6"
          />

        </div>

        <p
          className="
            text-sm
            font-semibold
            text-[var(--erp-text)]
          "
        >
          No hay registros
        </p>

        <p
          className="
            text-xs
            text-[var(--erp-text-soft)]
            mt-1
          "
        >
          No se encontraron operaciones con los filtros actuales.
        </p>

      </div>
    );
  }


  return (
    <div
      className="
        overflow-x-auto
      "
    >

      <table
        className="
          w-full
          text-sm
        "
      >

        <thead>

          <tr
            className="
              border-b
              border-[var(--erp-border)]
              bg-[var(--erp-bg)]
            "
          >

            <th
              className="
                px-4
                py-3
                text-left
                text-[11px]
                uppercase
                tracking-wide
                font-semibold
                text-[var(--erp-text-soft)]
                whitespace-nowrap
              "
            >
              Fecha
            </th>

            <th
              className="
                px-4
                py-3
                text-left
                text-[11px]
                uppercase
                tracking-wide
                font-semibold
                text-[var(--erp-text-soft)]
              "
            >
              Usuario
            </th>

            <th
              className="
                px-4
                py-3
                text-left
                text-[11px]
                uppercase
                tracking-wide
                font-semibold
                text-[var(--erp-text-soft)]
              "
            >
              Módulo
            </th>

            <th
              className="
                px-4
                py-3
                text-left
                text-[11px]
                uppercase
                tracking-wide
                font-semibold
                text-[var(--erp-text-soft)]
              "
            >
              Acción
            </th>

            <th
              className="
                px-4
                py-3
                text-left
                text-[11px]
                uppercase
                tracking-wide
                font-semibold
                text-[var(--erp-text-soft)]
              "
            >
              Descripción
            </th>

            <th
              className="
                px-4
                py-3
                text-left
                text-[11px]
                uppercase
                tracking-wide
                font-semibold
                text-[var(--erp-text-soft)]
              "
            >
              IP
            </th>

          </tr>

        </thead>


        <tbody>

          {datos.map(
            (registro, index) => (

              <tr
                key={
                  registro?.id ??
                  `auditoria-${index}`
                }
                onClick={() =>
                  onSeleccionar(
                    registro
                  )
                }
                className="
                  border-b
                  border-[var(--erp-border)]
                  last:border-b-0
                  hover:bg-[var(--erp-primary-soft)]
                  transition
                  cursor-pointer
                "
              >

                <td
                  className="
                    px-4
                    py-3.5
                    whitespace-nowrap
                    text-xs
                    text-[var(--erp-text-soft)]
                  "
                >
                  {formatearFecha(
                    registro?.fecha
                  )}
                </td>


                <td
                  className="
                    px-4
                    py-3.5
                    whitespace-nowrap
                  "
                >

                  <span
                    className="
                      font-medium
                      text-[var(--erp-text)]
                    "
                  >
                    {textoSeguro(
                      registro?.usuario
                    ) || "Sistema"}
                  </span>

                </td>


                <td
                  className="
                    px-4
                    py-3.5
                    whitespace-nowrap
                  "
                >

                  <span
                    className="
                      inline-flex
                      px-2
                      py-1
                      rounded-lg
                      bg-[var(--erp-bg)]
                      border
                      border-[var(--erp-border)]
                      text-xs
                      text-[var(--erp-text-soft)]
                    "
                  >
                    {textoSeguro(
                      registro?.modulo
                    ) || "Sistema"}
                  </span>

                </td>


                <td
                  className="
                    px-4
                    py-3.5
                    whitespace-nowrap
                  "
                >

                  <BadgeAccion
                    accion={
                      registro?.accion
                    }
                  />

                </td>


                <td
                  className="
                    px-4
                    py-3.5
                    min-w-[280px]
                    max-w-[420px]
                  "
                >

                  <p
                    className="
                      text-sm
                      text-[var(--erp-text)]
                      truncate
                    "
                    title={
                      textoSeguro(
                        registro?.descripcion
                      )
                    }
                  >
                    {textoSeguro(
                      registro?.descripcion
                    ) || "-"}
                  </p>

                </td>


                <td
                  className="
                    px-4
                    py-3.5
                    whitespace-nowrap
                    text-xs
                    font-mono
                    text-[var(--erp-text-soft)]
                  "
                >
                  {textoSeguro(
                    registro?.ip
                  ) || "-"}
                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>
  );
}


/**
 * ============================================================
 * DETALLE
 * ============================================================
 */

function DetalleAuditoria({
  registro,
  onCerrar,
}) {

  if (!registro) {
    return null;
  }


  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        p-4
        bg-black/30
      "
      onClick={onCerrar}
    >

      <div
        className="
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          bg-[var(--erp-surface)]
          border
          border-[var(--erp-border)]
          rounded-2xl
          shadow-2xl
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <div
          className="
            px-5
            py-4
            border-b
            border-[var(--erp-border)]
            flex
            items-center
            justify-between
            gap-3
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
              Detalle de auditoría
            </h2>

            <p
              className="
                text-xs
                text-[var(--erp-text-soft)]
                mt-0.5
              "
            >
              Registro #{textoSeguro(
                registro.id
              ) || "-"}
            </p>

          </div>


          <button
            type="button"
            onClick={onCerrar}
            className="
              w-9
              h-9
              rounded-xl
              bg-[var(--erp-bg)]
              border
              border-[var(--erp-border)]
              text-[var(--erp-text-soft)]
              hover:text-[var(--erp-text)]
              transition
            "
            aria-label="Cerrar"
          >
            ×
          </button>

        </div>


        <div
          className="
            p-5
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-4
          "
        >

          <div>

            <p
              className="
                text-[11px]
                uppercase
                tracking-wide
                text-[var(--erp-text-soft)]
              "
            >
              Fecha
            </p>

            <p
              className="
                text-sm
                font-medium
                text-[var(--erp-text)]
                mt-1
              "
            >
              {formatearFecha(
                registro.fecha
              )}
            </p>

          </div>


          <div>

            <p
              className="
                text-[11px]
                uppercase
                tracking-wide
                text-[var(--erp-text-soft)]
              "
            >
              Usuario
            </p>

            <p
              className="
                text-sm
                font-medium
                text-[var(--erp-text)]
                mt-1
              "
            >
              {textoSeguro(
                registro.usuario
              ) || "Sistema"}
            </p>

          </div>


          <div>

            <p
              className="
                text-[11px]
                uppercase
                tracking-wide
                text-[var(--erp-text-soft)]
              "
            >
              Módulo
            </p>

            <p
              className="
                text-sm
                font-medium
                text-[var(--erp-text)]
                mt-1
              "
            >
              {textoSeguro(
                registro.modulo
              ) || "Sistema"}
            </p>

          </div>


          <div>

            <p
              className="
                text-[11px]
                uppercase
                tracking-wide
                text-[var(--erp-text-soft)]
              "
            >
              Acción
            </p>

            <div className="mt-1">
              <BadgeAccion
                accion={
                  registro.accion
                }
              />
            </div>

          </div>


          <div>

            <p
              className="
                text-[11px]
                uppercase
                tracking-wide
                text-[var(--erp-text-soft)]
              "
            >
              Dirección IP
            </p>

            <p
              className="
                text-sm
                font-mono
                text-[var(--erp-text)]
                mt-1
              "
            >
              {textoSeguro(
                registro.ip
              ) || "-"}
            </p>

          </div>


          <div
            className="
              sm:col-span-2
            "
          >

            <p
              className="
                text-[11px]
                uppercase
                tracking-wide
                text-[var(--erp-text-soft)]
              "
            >
              Descripción
            </p>

            <div
              className="
                mt-2
                p-4
                rounded-xl
                bg-[var(--erp-bg)]
                border
                border-[var(--erp-border)]
                text-sm
                leading-6
                text-[var(--erp-text)]
                whitespace-pre-wrap
                break-words
              "
            >
              {textoSeguro(
                registro.descripcion
              ) || "Sin descripción"}
            </div>

          </div>

        </div>


        <div
          className="
            px-5
            py-4
            border-t
            border-[var(--erp-border)]
            flex
            justify-end
          "
        >

          <button
            type="button"
            onClick={onCerrar}
            className="
              px-4
              py-2
              rounded-xl
              bg-[var(--erp-primary)]
              text-white
              text-sm
              font-medium
              hover:opacity-90
              transition
            "
          >
            Cerrar
          </button>

        </div>

      </div>

    </div>
  );
}


/**
 * ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================
 */

export default function SeguridadAuditoria() {

  const [
    auditoria,
    setAuditoria,
  ] = useState([]);

  const [
    metricas,
    setMetricas,
  ] = useState(null);

  const [
    empleados,
    setEmpleados,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    busqueda,
    setBusqueda,
  ] = useState("");

  const [
    filtroModulo,
    setFiltroModulo,
  ] = useState("");

  const [
    filtroAccion,
    setFiltroAccion,
  ] = useState("");

  const [
    filtroUsuario,
    setFiltroUsuario,
  ] = useState("");

  const [
    filtroEmpleado,
    setFiltroEmpleado,
  ] = useState("");

  const [
    registroSeleccionado,
    setRegistroSeleccionado,
  ] = useState(null);


  /**
   * ==========================================================
   * CARGAR DATOS
   * ==========================================================
   */

  useEffect(() => {

    let activo = true;


    async function cargar() {

      setLoading(true);
      setError("");


      try {

        const [
          auditoriaRes,
          metricasRes,
          empleadosRes,
        ] = await Promise.all([

          axios.get(
            `${API}/seguridad/auditoria/`
          ),

          axios.get(
            `${API}/seguridad/auditoria/metricas`
          ),

          axios.get(
            `${API}/empleados/`
          ),

        ]);


        if (!activo) {
          return;
        }


        const auditoriaData =
          Array.isArray(
            auditoriaRes.data
          )
            ? auditoriaRes.data
            : [];


        const empleadosData =
          Array.isArray(
            empleadosRes.data
          )
            ? empleadosRes.data
            : Array.isArray(
                empleadosRes.data?.empleados
              )
              ? empleadosRes.data.empleados
              : [];


        setAuditoria(
          auditoriaData
        );

        setMetricas(
          metricasRes.data &&
          typeof metricasRes.data === "object"
            ? metricasRes.data
            : null
        );

        setEmpleados(
          empleadosData
        );

      } catch (err) {

        console.error(
          "AUDITORÍA — ERROR CARGANDO DATOS:",
          err
        );


        if (activo) {

          setError(
            "No se ha podido cargar la auditoría."
          );

        }

      } finally {

        if (activo) {
          setLoading(false);
        }

      }

    }


    cargar();


    return () => {
      activo = false;
    };

  }, []);


  /**
   * ==========================================================
   * OPCIONES DE FILTRO
   * ==========================================================
   */

  const modulos =
    useMemo(() => {

      const valores =
        auditoria
          .map(
            (registro) =>
              textoSeguro(
                registro?.modulo
              ).trim()
          )
          .filter(Boolean);


      return [
        ...new Set(
          valores
        ),
      ].sort(
        (a, b) =>
          a.localeCompare(
            b,
            "es"
          )
      );

    }, [auditoria]);


  const acciones =
    useMemo(() => {

      const valores =
        auditoria
          .map(
            (registro) =>
              textoSeguro(
                registro?.accion
              ).trim()
          )
          .filter(Boolean);


      return [
        ...new Set(
          valores
        ),
      ].sort(
        (a, b) =>
          a.localeCompare(
            b,
            "es"
          )
      );

    }, [auditoria]);


  const usuarios =
    useMemo(() => {

      const valores =
        auditoria
          .map(
            (registro) =>
              textoSeguro(
                registro?.usuario
              ).trim()
          )
          .filter(Boolean);


      return [
        ...new Set(
          valores
        ),
      ].sort(
        (a, b) =>
          a.localeCompare(
            b,
            "es"
          )
      );

    }, [auditoria]);


  /**
   * ==========================================================
   * FILTRADO
   * ==========================================================
   */

  const registrosFiltrados =
    useMemo(() => {

      const texto =
        busqueda
          .trim()
          .toLowerCase();


      return auditoria.filter(
        (registro) => {

          const usuario =
            textoSeguro(
              registro?.usuario
            ).toLowerCase();

          const modulo =
            textoSeguro(
              registro?.modulo
            ).toLowerCase();

          const accion =
            textoSeguro(
              registro?.accion
            ).toLowerCase();

          const descripcion =
            textoSeguro(
              registro?.descripcion
            ).toLowerCase();

          const ip =
            textoSeguro(
              registro?.ip
            ).toLowerCase();


          if (
            texto &&
            !usuario.includes(texto) &&
            !modulo.includes(texto) &&
            !accion.includes(texto) &&
            !descripcion.includes(texto) &&
            !ip.includes(texto)
          ) {
            return false;
          }


          if (
            filtroModulo &&
            textoSeguro(
              registro?.modulo
            ) !== filtroModulo
          ) {
            return false;
          }


          if (
            filtroAccion &&
            textoSeguro(
              registro?.accion
            ) !== filtroAccion
          ) {
            return false;
          }


          if (
            filtroUsuario &&
            textoSeguro(
              registro?.usuario
            ) !== filtroUsuario
          ) {
            return false;
          }


          return true;

        }
      );

    }, [
      auditoria,
      busqueda,
      filtroModulo,
      filtroAccion,
      filtroUsuario,
    ]);


  /**
   * ==========================================================
   * HISTÓRICO POR EMPLEADO
   * ==========================================================
   */

  useEffect(() => {

    if (!filtroEmpleado) {
      return;
    }


    let activo = true;


    async function cargarEmpleado() {

      try {

        const respuesta =
          await axios.get(
            `${API}/seguridad/auditoria/empleado/${filtroEmpleado}`
          );


        if (!activo) {
          return;
        }


        const datos =
          Array.isArray(
            respuesta.data
          )
            ? respuesta.data
            : [];


        setAuditoria(
          datos
        );

      } catch (err) {

        console.error(
          "AUDITORÍA — ERROR CARGANDO EMPLEADO:",
          err
        );


        if (activo) {

          setError(
            "No se ha podido cargar el histórico del empleado."
          );

        }

      }

    }


    cargarEmpleado();


    return () => {
      activo = false;
    };

  }, [filtroEmpleado]);


  /**
   * ==========================================================
   * LIMPIAR FILTROS
   * ==========================================================
   */

  const limpiarFiltros = () => {

    setBusqueda("");
    setFiltroModulo("");
    setFiltroAccion("");
    setFiltroUsuario("");
    setFiltroEmpleado("");

  };


  /**
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (loading) {

    return (
      <div
        className="
          min-h-[400px]
          flex
          items-center
          justify-center
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            gap-3
            text-[var(--erp-text-soft)]
          "
        >

          <div
            className="
              w-8
              h-8
              rounded-full
              border-2
              border-[var(--erp-border)]
              border-t-[var(--erp-primary)]
              animate-spin
            "
          />

          <span className="text-sm">
            Cargando auditoría…
          </span>

        </div>

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
        space-y-6
        animate-fade-in
      "
    >

      {/* ======================================================
          CABECERA
          ====================================================== */}

      <section
        className="
          bg-[var(--erp-surface)]
          border
          border-[var(--erp-border)]
          rounded-2xl
          shadow-sm
          px-6
          py-5
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-5
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
                w-12
                h-12
                rounded-2xl
                bg-[var(--erp-primary-soft)]
                text-[var(--erp-primary)]
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >

              <Icono
                name="clipboard"
                className="w-6 h-6"
              />

            </div>


            <div>

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >

                <h1
                  className="
                    text-2xl
                    font-bold
                    text-[var(--erp-text)]
                  "
                >
                  Auditoría
                </h1>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-2.5
                    py-1
                    rounded-lg
                    bg-emerald-50
                    border
                    border-emerald-100
                    text-emerald-700
                    text-[11px]
                    font-medium
                  "
                >

                  <span
                    className="
                      w-1.5
                      h-1.5
                      rounded-full
                      bg-emerald-500
                    "
                  />

                  Registro activo

                </span>

              </div>


              <p
                className="
                  text-sm
                  text-[var(--erp-text-soft)]
                  mt-1
                "
              >
                Histórico de operaciones y actividad de seguridad del ERP.
              </p>

            </div>

          </div>


          <Link
            to="/seguridad"
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-xl
              border
              border-[var(--erp-border)]
              bg-[var(--erp-bg)]
              text-sm
              font-medium
              text-[var(--erp-text)]
              hover:border-[var(--erp-primary)]
              hover:text-[var(--erp-primary)]
              transition
              w-fit
            "
          >

            ← Seguridad

          </Link>

        </div>

      </section>


      {/* ======================================================
          ERROR
          ====================================================== */}

      {error && (

        <div
          className="
            px-4
            py-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            text-red-700
            text-sm
          "
        >
          {error}
        </div>

      )}


      {/* ======================================================
          KPIs
          ====================================================== */}

      <section>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-4
          "
        >

          <KPI
            icon="clipboard"
            titulo="Registros"
            valor={
              formatearNumero(
                metricas?.total_registros ??
                auditoria.length
              )
            }
            descripcion="Eventos registrados"
          />


          <KPI
            icon="user-group"
            titulo="Usuarios"
            valor={
              formatearNumero(
                usuarios.length
              )
            }
            descripcion="Usuarios con actividad"
            accent="success"
          />


          <KPI
            icon="shield"
            titulo="Módulos"
            valor={
              formatearNumero(
                modulos.length
              )
            }
            descripcion="Áreas con actividad"
          />


          <KPI
            icon="clipboard"
            titulo="Acciones"
            valor={
              formatearNumero(
                acciones.length
              )
            }
            descripcion="Tipos de operación"
            accent="warning"
          />

        </div>

      </section>


      {/* ======================================================
          MÉTRICAS
          ====================================================== */}

      <PanelMetricas
        metricas={metricas}
      />


      {/* ======================================================
          ÚLTIMOS LOGINS
          ====================================================== */}

      <UltimosLogins
        registros={
          metricas?.ultimos_logins
        }
      />


      {/* ======================================================
          FILTROS
          ====================================================== */}

      <section
        className="
          bg-[var(--erp-surface)]
          border
          border-[var(--erp-border)]
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >

        <div
          className="
            px-5
            py-4
            border-b
            border-[var(--erp-border)]
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

            <div>

              <h2
                className="
                  text-base
                  font-semibold
                  text-[var(--erp-text)]
                "
              >
                Filtros de auditoría
              </h2>

              <p
                className="
                  text-xs
                  text-[var(--erp-text-soft)]
                  mt-0.5
                "
              >
                Localiza rápidamente cualquier operación registrada.
              </p>

            </div>


            <button
              type="button"
              onClick={limpiarFiltros}
              className="
                text-xs
                font-medium
                text-[var(--erp-primary)]
                hover:underline
              "
            >
              Limpiar filtros
            </button>

          </div>

        </div>


        <div
          className="
            p-5
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-5
            gap-4
          "
        >

          {/* BUSCADOR */}

          <div className="xl:col-span-2">

            <label
              className="
                block
                text-xs
                font-medium
                text-[var(--erp-text-soft)]
                mb-1.5
              "
            >
              Buscar
            </label>

            <input
              type="text"
              value={busqueda}
              onChange={(event) =>
                setBusqueda(
                  event.target.value
                )
              }
              placeholder="Usuario, descripción, IP, módulo..."
              className="
                w-full
                px-3
                py-2.5
                rounded-xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-bg)]
                text-sm
                text-[var(--erp-text)]
                outline-none
                focus:border-[var(--erp-primary)]
              "
            />

          </div>


          {/* MÓDULO */}

          <div>

            <label
              className="
                block
                text-xs
                font-medium
                text-[var(--erp-text-soft)]
                mb-1.5
              "
            >
              Módulo
            </label>

            <select
              value={filtroModulo}
              onChange={(event) =>
                setFiltroModulo(
                  event.target.value
                )
              }
              className="
                w-full
                px-3
                py-2.5
                rounded-xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-bg)]
                text-sm
                text-[var(--erp-text)]
                outline-none
                focus:border-[var(--erp-primary)]
              "
            >

              <option value="">
                Todos
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


          {/* ACCIÓN */}

          <div>

            <label
              className="
                block
                text-xs
                font-medium
                text-[var(--erp-text-soft)]
                mb-1.5
              "
            >
              Acción
            </label>

            <select
              value={filtroAccion}
              onChange={(event) =>
                setFiltroAccion(
                  event.target.value
                )
              }
              className="
                w-full
                px-3
                py-2.5
                rounded-xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-bg)]
                text-sm
                text-[var(--erp-text)]
                outline-none
                focus:border-[var(--erp-primary)]
              "
            >

              <option value="">
                Todas
              </option>

              {acciones.map(
                (accion) => (
                  <option
                    key={accion}
                    value={accion}
                  >
                    {accion}
                  </option>
                )
              )}

            </select>

          </div>


          {/* USUARIO */}

          <div>

            <label
              className="
                block
                text-xs
                font-medium
                text-[var(--erp-text-soft)]
                mb-1.5
              "
            >
              Usuario
            </label>

            <select
              value={filtroUsuario}
              onChange={(event) =>
                setFiltroUsuario(
                  event.target.value
                )
              }
              className="
                w-full
                px-3
                py-2.5
                rounded-xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-bg)]
                text-sm
                text-[var(--erp-text)]
                outline-none
                focus:border-[var(--erp-primary)]
              "
            >

              <option value="">
                Todos
              </option>

              {usuarios.map(
                (usuario) => (
                  <option
                    key={usuario}
                    value={usuario}
                  >
                    {usuario}
                  </option>
                )
              )}

            </select>

          </div>


          {/* EMPLEADO */}

          <div className="md:col-span-2 xl:col-span-2">

            <label
              className="
                block
                text-xs
                font-medium
                text-[var(--erp-text-soft)]
                mb-1.5
              "
            >
              Histórico de empleado
            </label>

            <select
              value={filtroEmpleado}
              onChange={(event) =>
                setFiltroEmpleado(
                  event.target.value
                )
              }
              className="
                w-full
                px-3
                py-2.5
                rounded-xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-bg)]
                text-sm
                text-[var(--erp-text)]
                outline-none
                focus:border-[var(--erp-primary)]
              "
            >

              <option value="">
                Auditoría global
              </option>

              {empleados
                .filter(
                  (empleado) =>
                    empleado &&
                    empleado.id !== null &&
                    empleado.id !== undefined
                )
                .map(
                  (empleado) => (

                    <option
                      key={
                        empleado.id
                      }
                      value={
                        empleado.id
                      }
                    >
                      {textoSeguro(
                        empleado.nombre
                      )}{" "}
                      {textoSeguro(
                        empleado.apellidos
                      )}
                      {" — "}
                      {textoSeguro(
                        empleado.usuario
                      )}
                    </option>

                  )
                )}

            </select>

          </div>


          <div
            className="
              md:col-span-2
              xl:col-span-3
              flex
              items-end
            "
          >

            <div
              className="
                px-3
                py-2.5
                rounded-xl
                bg-[var(--erp-primary-soft)]
                text-[var(--erp-primary)]
                text-xs
                w-full
              "
            >
              Mostrando{" "}
              <strong>
                {formatearNumero(
                  registrosFiltrados.length
                )}
              </strong>{" "}
              registros.
            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          TABLA
          ====================================================== */}

      <section
        className="
          bg-[var(--erp-surface)]
          border
          border-[var(--erp-border)]
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >

        <div
          className="
            px-5
            py-4
            border-b
            border-[var(--erp-border)]
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-2
          "
        >

          <div>

            <h2
              className="
                text-base
                font-semibold
                text-[var(--erp-text)]
              "
            >
              Registro de actividad
            </h2>

            <p
              className="
                text-xs
                text-[var(--erp-text-soft)]
                mt-0.5
              "
            >
              Haz clic sobre una operación para consultar su detalle.
            </p>

          </div>


          <span
            className="
              text-xs
              text-[var(--erp-text-soft)]
            "
          >
            Máximo histórico disponible: 200 registros
          </span>

        </div>


        <TablaAuditoria
          registros={
            registrosFiltrados
          }
          onSeleccionar={
            setRegistroSeleccionado
          }
        />

      </section>


      {/* ======================================================
          DETALLE
          ====================================================== */}

      <DetalleAuditoria
        registro={
          registroSeleccionado
        }
        onCerrar={() =>
          setRegistroSeleccionado(
            null
          )
        }
      />

    </div>
  );
}
