import { useEffect, useState, useMemo, useCallback } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

/**
 * ============================================================
 * AUDITORÍA DEL SISTEMA — MOLSAN ERP SAAS PREMIUM 2027
 * ============================================================
 *
 * - Búsqueda
 * - Filtro por fecha
 * - Ordenación
 * - Paginación
 * - Exportación Excel
 * - Protección frente a datos corruptos
 * - Diseño ERP Premium
 * ============================================================
 */

const Icono = ({ name, className = "w-5 h-5" }) => (
  <svg
    className={`${className} flex-shrink-0`}
    aria-hidden="true"
  >
    <use href={`/icons/icons.svg#${name}`} />
  </svg>
);


/**
 * ============================================================
 * ICONOS DE ACCIÓN
 * ============================================================
 */

const ICONOS_ACCION = {
  login: "lock",
  login_error: "shield",
  acceso: "folder",
  update: "edit",
  delete: "trash",
  permiso: "shield",
  modulo: "folder",
  default: "clipboard",
};


/**
 * ============================================================
 * ETIQUETA DE ACCIÓN
 * ============================================================
 */

function AccionBadge({ accion }) {
  const icon =
    ICONOS_ACCION[accion] ||
    ICONOS_ACCION.default;

  return (
    <span
      className="
        inline-flex
        items-center
        gap-2
        px-2.5
        py-1
        rounded-lg
        bg-[var(--erp-primary-soft)]
        text-[var(--erp-primary)]
        border
        border-[var(--erp-border)]
        text-xs
        font-medium
        whitespace-nowrap
      "
    >
      <Icono
        name={icon}
        className="w-3.5 h-3.5"
      />

      {accion}
    </span>
  );
}


/**
 * ============================================================
 * CABECERA ORDENABLE
 * ============================================================
 */

function CabeceraOrden({
  campo,
  titulo,
  orden,
  onOrdenar,
}) {
  const activa = orden.campo === campo;

  return (
    <th
      scope="col"
      className="
        px-4
        py-3
        text-left
        text-xs
        font-semibold
        uppercase
        tracking-wide
        text-[var(--erp-text-soft)]
        whitespace-nowrap
      "
    >
      <button
        type="button"
        onClick={() => onOrdenar(campo)}
        className="
          inline-flex
          items-center
          gap-2
          hover:text-[var(--erp-primary)]
          transition
        "
      >
        {titulo}

        <span
          className={`
            text-[10px]
            ${
              activa
                ? "text-[var(--erp-primary)]"
                : "text-[var(--erp-text-soft)] opacity-50"
            }
          `}
        >
          {activa
            ? orden.asc
              ? "▲"
              : "▼"
            : "↕"}
        </span>
      </button>
    </th>
  );
}


/**
 * ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================
 */

export default function SeguridadAuditoria() {

  const {
    auditoria = [],
    cargarTodo,
  } = useSeguridad();


  const [pagina, setPagina] = useState(0);

  const pageSize = 20;

  const [busqueda, setBusqueda] =
    useState("");

  const [filtroFecha, setFiltroFecha] =
    useState("");

  const [orden, setOrden] = useState({
    campo: "fecha",
    asc: false,
  });


  /**
   * ==========================================================
   * ORDENACIÓN
   * ==========================================================
   */

  const ordenar = useCallback((campo) => {

    setOrden((prev) => ({
      campo,
      asc:
        prev.campo === campo
          ? !prev.asc
          : true,
    }));

    setPagina(0);

  }, []);


  /**
   * ==========================================================
   * CARGA
   * ==========================================================
   */

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);


  /**
   * ==========================================================
   * BLINDAJE DE DATOS
   * ==========================================================
   */

  const auditoriaSegura = useMemo(() => {

    if (!Array.isArray(auditoria)) {
      return [];
    }

    return auditoria.filter((a) => {

      return (
        a &&
        typeof a === "object" &&
        typeof a.id !== "undefined" &&
        typeof a.fecha === "string" &&
        typeof a.usuario === "string" &&
        typeof a.modulo === "string" &&
        typeof a.accion === "string" &&
        typeof a.descripcion === "string"
      );

    });

  }, [auditoria]);


  /**
   * ==========================================================
   * FILTRADO
   * ==========================================================
   */

  const auditoriaFiltrada = useMemo(() => {

    const texto =
      busqueda
        .toLowerCase()
        .trim();

    return auditoriaSegura.filter((a) => {

      const coincideBusqueda =
        a.usuario
          .toLowerCase()
          .includes(texto) ||

        a.modulo
          .toLowerCase()
          .includes(texto) ||

        a.accion
          .toLowerCase()
          .includes(texto) ||

        a.descripcion
          .toLowerCase()
          .includes(texto) ||

        a.fecha
          .toLowerCase()
          .includes(texto);

      const coincideFecha =
        filtroFecha
          ? a.fecha.startsWith(filtroFecha)
          : true;

      return (
        coincideBusqueda &&
        coincideFecha
      );

    });

  }, [
    auditoriaSegura,
    busqueda,
    filtroFecha,
  ]);


  /**
   * ==========================================================
   * ORDENACIÓN DE RESULTADOS
   * ==========================================================
   */

  const auditoriaOrdenada = useMemo(() => {

    const {
      campo,
      asc,
    } = orden;

    const dir = asc ? 1 : -1;

    return [...auditoriaFiltrada].sort(
      (a, b) => {

        const va = a[campo];
        const vb = b[campo];

        if (va < vb) {
          return -1 * dir;
        }

        if (va > vb) {
          return 1 * dir;
        }

        return 0;

      }
    );

  }, [
    auditoriaFiltrada,
    orden,
  ]);


  /**
   * ==========================================================
   * PAGINACIÓN
   * ==========================================================
   */

  const auditoriaPaginada = useMemo(() => {

    return auditoriaOrdenada.slice(
      pagina * pageSize,
      pagina * pageSize + pageSize
    );

  }, [
    auditoriaOrdenada,
    pagina,
  ]);


  const totalPaginas =
    Math.max(
      1,
      Math.ceil(
        auditoriaOrdenada.length /
          pageSize
      )
    );


  /**
   * ==========================================================
   * EXPORTACIÓN EXCEL
   * ==========================================================
   */

  const descargarExcel = useCallback(() => {

    const encabezados = [
      "ID",
      "Usuario",
      "Módulo",
      "Acción",
      "Descripción",
      "Fecha",
    ];

    const filas =
      auditoriaOrdenada.map((a) => [
        a.id,
        a.usuario,
        a.modulo,
        a.accion,
        a.descripcion,
        a.fecha,
      ]);

    const contenido = [
      encabezados,
      ...filas,
    ]
      .map((fila) =>
        fila.join("\t")
      )
      .join("\n");

    const blob = new Blob(
      [contenido],
      {
        type:
          "application/vnd.ms-excel",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      "auditoria_sistema.xls";

    a.click();

    URL.revokeObjectURL(url);

  }, [auditoriaOrdenada]);


  /**
   * ==========================================================
   * LIMPIAR FILTROS
   * ==========================================================
   */

  const limpiarFiltros = useCallback(() => {

    setBusqueda("");
    setFiltroFecha("");
    setPagina(0);

  }, []);


  const hayFiltros =
    Boolean(
      busqueda ||
      filtroFecha
    );


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
                w-11
                h-11
                rounded-xl
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
                className="w-5 h-5"
              />
            </div>

            <div>

              <h1
                className="
                  text-2xl
                  font-bold
                  text-[var(--erp-text)]
                "
              >
                Auditoría del sistema
              </h1>

              <p
                className="
                  text-sm
                  text-[var(--erp-text-soft)]
                  mt-0.5
                "
              >
                Registro de actividad y operaciones del ERP
              </p>

            </div>

          </div>


          {/* EXPORTAR */}

          <button
            type="button"
            onClick={descargarExcel}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              bg-[var(--erp-primary)]
              text-white
              text-sm
              font-medium
              shadow-sm
              hover:opacity-90
              transition
              active:scale-[0.98]
              w-fit
            "
          >

            <Icono
              name="download"
              className="w-4 h-4"
            />

            Descargar Excel

          </button>

        </div>

      </section>


      {/* ======================================================
          RESUMEN
          ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-3
          gap-4
        "
      >

        {/* TOTAL */}

        <div
          className="
            bg-[var(--erp-surface)]
            border
            border-[var(--erp-border)]
            rounded-2xl
            shadow-sm
            p-5
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-[var(--erp-text-soft)]
                "
              >
                Registros
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-[var(--erp-text)]
                  mt-1
                "
              >
                {auditoriaOrdenada.length}
              </p>

            </div>

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-[var(--erp-primary-soft)]
                text-[var(--erp-primary)]
                flex
                items-center
                justify-center
              "
            >
              <Icono
                name="clipboard"
                className="w-5 h-5"
              />
            </div>

          </div>

        </div>


        {/* PÁGINA */}

        <div
          className="
            bg-[var(--erp-surface)]
            border
            border-[var(--erp-border)]
            rounded-2xl
            shadow-sm
            p-5
          "
        >

          <p
            className="
              text-xs
              uppercase
              tracking-wide
              text-[var(--erp-text-soft)]
            "
          >
            Página
          </p>

          <p
            className="
              text-2xl
              font-bold
              text-[var(--erp-text)]
              mt-1
            "
          >
            {pagina + 1}
            <span
              className="
                text-sm
                font-medium
                text-[var(--erp-text-soft)]
                ml-1
              "
            >
              / {totalPaginas}
            </span>
          </p>

        </div>


        {/* ESTADO */}

        <div
          className="
            bg-[var(--erp-surface)]
            border
            border-[var(--erp-border)]
            rounded-2xl
            shadow-sm
            p-5
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-[var(--erp-text-soft)]
                "
              >
                Estado
              </p>

              <p
                className="
                  text-base
                  font-semibold
                  text-emerald-600
                  mt-1
                "
              >
                Auditoría activa
              </p>

            </div>

            <span
              className="
                w-3
                h-3
                rounded-full
                bg-emerald-500
              "
            />

          </div>

        </div>

      </div>


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
          p-5
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-end
            gap-4
          "
        >

          {/* BUSCADOR */}

          <div className="flex-1">

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

            <div className="relative">

              <Icono
                name="search"
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  w-4
                  h-4
                  text-[var(--erp-text-soft)]
                "
              />

              <input
                type="text"
                placeholder="Usuario, módulo, acción o descripción..."
                className="
                  w-full
                  h-11
                  pl-10
                  pr-4
                  rounded-xl
                  border
                  border-[var(--erp-border)]
                  bg-[var(--erp-bg)]
                  text-[var(--erp-text)]
                  placeholder:text-[var(--erp-text-soft)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--erp-primary)]
                  focus:border-[var(--erp-primary)]
                  transition
                "
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(
                    e.target.value
                  );
                  setPagina(0);
                }}
              />

            </div>

          </div>


          {/* FECHA */}

          <div className="w-full lg:w-56">

            <label
              className="
                block
                text-xs
                font-medium
                text-[var(--erp-text-soft)]
                mb-1.5
              "
            >
              Fecha
            </label>

            <input
              type="date"
              className="
                w-full
                h-11
                px-3
                rounded-xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-bg)]
                text-[var(--erp-text)]
                focus:outline-none
                focus:ring-2
                focus:ring-[var(--erp-primary)]
                focus:border-[var(--erp-primary)]
                transition
              "
              value={filtroFecha}
              onChange={(e) => {
                setFiltroFecha(
                  e.target.value
                );
                setPagina(0);
              }}
            />

          </div>


          {/* LIMPIAR */}

          <button
            type="button"
            disabled={!hayFiltros}
            onClick={limpiarFiltros}
            className="
              h-11
              px-4
              rounded-xl
              border
              border-[var(--erp-border)]
              bg-[var(--erp-bg)]
              text-[var(--erp-text)]
              text-sm
              font-medium
              hover:bg-[var(--erp-primary-soft)]
              hover:text-[var(--erp-primary)]
              transition
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            Limpiar
          </button>

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

        {/* CABECERA TABLA */}

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
                text-base
                font-semibold
                text-[var(--erp-text)]
              "
            >
              Registros de auditoría
            </h2>

            <p
              className="
                text-xs
                text-[var(--erp-text-soft)]
                mt-0.5
              "
            >
              {auditoriaOrdenada.length} registros encontrados
            </p>

          </div>

          <span
            className="
              hidden
              sm:inline-flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-lg
              bg-[var(--erp-primary-soft)]
              text-[var(--erp-primary)]
              text-xs
              font-medium
            "
          >
            <span
              className="
                w-1.5
                h-1.5
                rounded-full
                bg-current
              "
            />

            Sistema activo

          </span>

        </div>


        {/* CONTENIDO RESPONSIVE */}

        <div className="overflow-x-auto">

          <table
            className="
              w-full
              min-w-[900px]
              text-sm
            "
          >

            <thead
              className="
                bg-[var(--erp-bg)]
                border-b
                border-[var(--erp-border)]
              "
            >

              <tr>

                <CabeceraOrden
                  campo="fecha"
                  titulo="Fecha"
                  orden={orden}
                  onOrdenar={ordenar}
                />

                <CabeceraOrden
                  campo="usuario"
                  titulo="Usuario"
                  orden={orden}
                  onOrdenar={ordenar}
                />

                <CabeceraOrden
                  campo="modulo"
                  titulo="Módulo"
                  orden={orden}
                  onOrdenar={ordenar}
                />

                <CabeceraOrden
                  campo="accion"
                  titulo="Acción"
                  orden={orden}
                  onOrdenar={ordenar}
                />

                <th
                  scope="col"
                  className="
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-[var(--erp-text-soft)]
                  "
                >
                  Descripción
                </th>

              </tr>

            </thead>


            <tbody>

              {auditoriaPaginada.map(
                (a) => (
                  <tr
                    key={String(a.id)}
                    className="
                      border-b
                      border-[var(--erp-border)]
                      last:border-b-0
                      hover:bg-[var(--erp-primary-soft)]
                      transition
                    "
                  >

                    <td
                      className="
                        px-4
                        py-3.5
                        text-[var(--erp-text-soft)]
                        whitespace-nowrap
                      "
                    >
                      {a.fecha}
                    </td>


                    <td
                      className="
                        px-4
                        py-3.5
                        font-medium
                        text-[var(--erp-text)]
                        whitespace-nowrap
                      "
                    >
                      {a.usuario}
                    </td>


                    <td
                      className="
                        px-4
                        py-3.5
                        text-[var(--erp-text)]
                      "
                    >
                      {a.modulo}
                    </td>


                    <td
                      className="
                        px-4
                        py-3.5
                      "
                    >
                      <AccionBadge
                        accion={a.accion}
                      />
                    </td>


                    <td
                      className="
                        px-4
                        py-3.5
                        text-[var(--erp-text-soft)]
                        max-w-[500px]
                      "
                    >
                      <div
                        className="
                          truncate
                        "
                        title={a.descripcion}
                      >
                        {a.descripcion}
                      </div>
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>


        {/* ESTADO VACÍO */}

        {auditoriaPaginada.length === 0 && (
          <div
            className="
              py-14
              px-6
              text-center
            "
          >

            <div
              className="
                w-12
                h-12
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
              <Icono
                name="search"
                className="w-5 h-5"
              />
            </div>

            <h3
              className="
                text-sm
                font-semibold
                text-[var(--erp-text)]
              "
            >
              No se encontraron registros
            </h3>

            <p
              className="
                text-sm
                text-[var(--erp-text-soft)]
                mt-1
              "
            >
              Prueba a modificar los filtros de búsqueda.
            </p>

          </div>
        )}

      </section>


      {/* ======================================================
          PAGINACIÓN
          ====================================================== */}

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

        <p
          className="
            text-sm
            text-[var(--erp-text-soft)]
          "
        >
          Mostrando{" "}
          <span
            className="
              font-medium
              text-[var(--erp-text)]
            "
          >
            {auditoriaPaginada.length}
          </span>{" "}
          de{" "}
          <span
            className="
              font-medium
              text-[var(--erp-text)]
            "
          >
            {auditoriaOrdenada.length}
          </span>{" "}
          registros
        </p>


        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <button
            type="button"
            disabled={pagina === 0}
            onClick={() =>
              setPagina(
                (p) => Math.max(p - 1, 0)
              )
            }
            className="
              inline-flex
              items-center
              gap-2
              px-3
              py-2
              rounded-xl
              border
              border-[var(--erp-border)]
              bg-[var(--erp-surface)]
              text-[var(--erp-text)]
              text-sm
              font-medium
              hover:bg-[var(--erp-primary-soft)]
              hover:text-[var(--erp-primary)]
              transition
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            ←
            <span className="hidden sm:inline">
              Anterior
            </span>
          </button>


          <span
            className="
              min-w-[90px]
              text-center
              text-sm
              font-medium
              text-[var(--erp-text)]
            "
          >
            Página {pagina + 1}
          </span>


          <button
            type="button"
            disabled={
              (pagina + 1) * pageSize >=
              auditoriaOrdenada.length
            }
            onClick={() =>
              setPagina(
                (p) => p + 1
              )
            }
            className="
              inline-flex
              items-center
              gap-2
              px-3
              py-2
              rounded-xl
              border
              border-[var(--erp-border)]
              bg-[var(--erp-surface)]
              text-[var(--erp-text)]
              text-sm
              font-medium
              hover:bg-[var(--erp-primary-soft)]
              hover:text-[var(--erp-primary)]
              transition
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            <span className="hidden sm:inline">
              Siguiente
            </span>
            →
          </button>

        </div>

      </div>

    </div>
  );
}
