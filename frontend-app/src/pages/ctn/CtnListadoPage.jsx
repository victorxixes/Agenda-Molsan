import { useEffect, useState, useCallback } from "react";
import { useCtn } from "../../hooks/useCtn";
import ModalCtnDetalle from "../../components/ctn/ModalCtnDetalle";

const PAGE_SIZE = 15;

const FILTROS_INICIALES = {
  provincia: "",
  municipio: "",
  vc: "",
  apoderado: "",
  q: "",
};

export default function CtnListadoPage() {
  const {
    items,
    total,
    cargarNotarias,
    loading,
  } = useCtn();

  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  /*
   * Importante:
   * filtros = lo que el usuario está escribiendo.
   * filtrosAplicados = lo que realmente se está consultando.
   */
  const [filtrosAplicados, setFiltrosAplicados] = useState(
    FILTROS_INICIALES
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [pagina, setPagina] = useState(1);

  // ==========================================================
  // CARGAR DATOS
  // ==========================================================

  useEffect(() => {
    cargarNotarias(
      filtrosAplicados,
      pagina,
      PAGE_SIZE
    );
  }, [
    cargarNotarias,
    filtrosAplicados,
    pagina,
  ]);

  // ==========================================================
  // CAMBIAR FILTRO
  // ==========================================================

  const cambiarFiltro = useCallback((campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }, []);

  // ==========================================================
  // APLICAR FILTROS
  // ==========================================================

  const aplicarFiltros = useCallback(() => {
    setPagina(1);
    setFiltrosAplicados({
      ...filtros,
    });
  }, [filtros]);

  // ==========================================================
  // LIMPIAR FILTROS
  // ==========================================================

  const limpiarFiltros = useCallback(() => {
    setPagina(1);

    setFiltros(FILTROS_INICIALES);
    setFiltrosAplicados(FILTROS_INICIALES);
  }, []);

  // ==========================================================
  // ABRIR DETALLE
  // ==========================================================

  const abrirDetalle = useCallback((notaria) => {
    setSelected(notaria);
    setModalOpen(true);
  }, []);

  // ==========================================================
  // CERRAR DETALLE
  // ==========================================================

  const cerrarDetalle = useCallback(() => {
    setModalOpen(false);
    setSelected(null);
  }, []);

  // ==========================================================
  // DESCARGAR EXCEL
  // ==========================================================

  const descargarExcel = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      Object.entries(filtrosAplicados).forEach(
        ([key, value]) => {
          if (
            value &&
            typeof value === "string" &&
            value.trim() !== ""
          ) {
            params.append(
              key,
              value.trim()
            );
          }
        }
      );

      const urlExcel =
        `${import.meta.env.VITE_API_URL}` +
        `/ctn/exportar-excel?${params.toString()}`;

      const res = await fetch(urlExcel, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "token"
          )}`,
        },
      });

      if (!res.ok) {
        throw new Error(
          `Error HTTP ${res.status}`
        );
      }

      const blob = await res.blob();

      const url =
        window.URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;
      a.download = "notarias.xlsx";

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(
        "Error descargando Excel:",
        err
      );
    }
  }, [filtrosAplicados]);

  // ==========================================================
  // PAGINACIÓN
  // ==========================================================

  const totalPaginas = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE)
  );

  const puedeAnterior = pagina > 1;
  const puedeSiguiente =
    pagina < totalPaginas;

  const irAnterior = useCallback(() => {
    if (!puedeAnterior) return;

    setPagina((p) => p - 1);
  }, [puedeAnterior]);

  const irSiguiente = useCallback(() => {
    if (!puedeSiguiente) return;

    setPagina((p) => p + 1);
  }, [puedeSiguiente]);

  // ==========================================================
  // ENTER EN FILTROS
  // ==========================================================

  const manejarKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        aplicarFiltros();
      }
    },
    [aplicarFiltros]
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          FILTROS
         ====================================================== */}

      <section className="erp-card p-5">

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
            mb-5
          "
        >

          <div>
            <h2
              className="
                text-lg
                font-bold
                text-[var(--erp-text)]
              "
            >
              Buscar notarías
            </h2>

            <p
              className="
                text-sm
                text-[var(--erp-text-soft)]
                mt-1
              "
            >
              Utiliza los filtros para localizar una notaría.
            </p>
          </div>

          <div
            className="
              inline-flex
              items-center
              w-fit
              rounded-full
              bg-[var(--erp-primary-soft)]
              border border-[var(--erp-border)]
              px-3
              py-1.5
              text-xs
              font-semibold
              text-[var(--erp-primary)]
            "
          >
            {total} notarías
          </div>

        </div>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-5
            gap-3
          "
        >

          {/* Provincia */}

          <input
            type="text"
            className="
              w-full
              bg-white
              border border-[var(--erp-border)]
              rounded-xl
              px-3
              py-2.5
              text-sm
              text-[var(--erp-text)]
              placeholder:text-[var(--erp-text-soft)]
              outline-none
              transition
              focus:border-[var(--erp-primary)]
              focus:ring-2
              focus:ring-blue-100
            "
            placeholder="Provincia"
            value={filtros.provincia}
            onChange={(e) =>
              cambiarFiltro(
                "provincia",
                e.target.value
              )
            }
            onKeyDown={manejarKeyDown}
          />

          {/* Municipio */}

          <input
            type="text"
            className="
              w-full
              bg-white
              border border-[var(--erp-border)]
              rounded-xl
              px-3
              py-2.5
              text-sm
              text-[var(--erp-text)]
              placeholder:text-[var(--erp-text-soft)]
              outline-none
              transition
              focus:border-[var(--erp-primary)]
              focus:ring-2
              focus:ring-blue-100
            "
            placeholder="Municipio"
            value={filtros.municipio}
            onChange={(e) =>
              cambiarFiltro(
                "municipio",
                e.target.value
              )
            }
            onKeyDown={manejarKeyDown}
          />

          {/* VC */}

          <input
            type="text"
            className="
              w-full
              bg-white
              border border-[var(--erp-border)]
              rounded-xl
              px-3
              py-2.5
              text-sm
              text-[var(--erp-text)]
              placeholder:text-[var(--erp-text-soft)]
              outline-none
              transition
              focus:border-[var(--erp-primary)]
              focus:ring-2
              focus:ring-blue-100
            "
            placeholder="VC"
            value={filtros.vc}
            onChange={(e) =>
              cambiarFiltro(
                "vc",
                e.target.value
              )
            }
            onKeyDown={manejarKeyDown}
          />

          {/* Apoderado */}

          <input
            type="text"
            className="
              w-full
              bg-white
              border border-[var(--erp-border)]
              rounded-xl
              px-3
              py-2.5
              text-sm
              text-[var(--erp-text)]
              placeholder:text-[var(--erp-text-soft)]
              outline-none
              transition
              focus:border-[var(--erp-primary)]
              focus:ring-2
              focus:ring-blue-100
            "
            placeholder="Apoderado"
            value={filtros.apoderado}
            onChange={(e) =>
              cambiarFiltro(
                "apoderado",
                e.target.value
              )
            }
            onKeyDown={manejarKeyDown}
          />

          {/* Búsqueda general */}

          <input
            type="text"
            className="
              w-full
              bg-white
              border border-[var(--erp-border)]
              rounded-xl
              px-3
              py-2.5
              text-sm
              text-[var(--erp-text)]
              placeholder:text-[var(--erp-text-soft)]
              outline-none
              transition
              focus:border-[var(--erp-primary)]
              focus:ring-2
              focus:ring-blue-100
            "
            placeholder="Nombre, apellidos, código, NIF…"
            value={filtros.q}
            onChange={(e) =>
              cambiarFiltro(
                "q",
                e.target.value
              )
            }
            onKeyDown={manejarKeyDown}
          />

        </div>

        {/* Botones */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
            mt-4
          "
        >

          <button
            type="button"
            className="
              inline-flex
              items-center
              justify-center
              px-4
              py-2.5
              rounded-xl
              bg-[var(--erp-primary)]
              text-white
              text-sm
              font-semibold
              shadow-sm
              transition
              hover:opacity-90
              active:scale-[0.98]
            "
            onClick={aplicarFiltros}
          >
            Aplicar filtros
          </button>

          <button
            type="button"
            className="
              inline-flex
              items-center
              justify-center
              px-4
              py-2.5
              rounded-xl
              bg-white
              border border-[var(--erp-border)]
              text-[var(--erp-text)]
              text-sm
              font-medium
              transition
              hover:bg-[var(--erp-surface-soft)]
              active:scale-[0.98]
            "
            onClick={limpiarFiltros}
          >
            Limpiar
          </button>

          <button
            type="button"
            className="
              inline-flex
              items-center
              justify-center
              px-4
              py-2.5
              rounded-xl
              bg-green-600
              text-white
              text-sm
              font-semibold
              shadow-sm
              transition
              hover:bg-green-700
              active:scale-[0.98]
            "
            onClick={descargarExcel}
          >
            Descargar Excel
          </button>

        </div>

      </section>

      {/* ======================================================
          RESULTADOS
         ====================================================== */}

      <section className="erp-card overflow-hidden">

        {/* Cabecera resultados */}

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
                text-lg
                font-bold
                text-[var(--erp-text)]
              "
            >
              Directorio de notarías
            </h2>

            <p
              className="
                text-sm
                text-[var(--erp-text-soft)]
                mt-1
              "
            >
              Consulta los datos disponibles de cada notaría.
            </p>
          </div>

          <span
            className="
              text-xs
              text-[var(--erp-text-soft)]
            "
          >
            Página {pagina} de {totalPaginas}
          </span>

        </div>

        {/* Loading */}

        {loading && (
          <div className="p-10 text-center">

            <div
              className="
                mx-auto
                w-10
                h-10
                rounded-full
                border-4
                border-[var(--erp-border)]
                border-t-[var(--erp-primary)]
                animate-spin
              "
            />

            <p
              className="
                mt-4
                text-sm
                text-[var(--erp-text-soft)]
              "
            >
              Cargando notarías…
            </p>

          </div>
        )}

        {/* Sin resultados */}

        {!loading && items.length === 0 && (
          <div className="p-10 text-center">

            <div
              className="
                mx-auto
                mb-4
                flex
                items-center
                justify-center
                w-14
                h-14
                rounded-2xl
                bg-[var(--erp-surface-soft)]
                border border-[var(--erp-border)]
                text-[var(--erp-text-soft)]
              "
            >
              <span className="text-xl">
                —
              </span>
            </div>

            <p
              className="
                font-semibold
                text-[var(--erp-text)]
              "
            >
              No se han encontrado notarías
            </p>

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

        {/* Tabla */}

        {!loading && items.length > 0 && (
          <>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>
                  <tr
                    className="
                      bg-[var(--erp-surface-soft)]
                      border-b
                      border-[var(--erp-border)]
                    "
                  >

                    <th
                      className="
                        text-left
                        px-5
                        py-3
                        font-semibold
                        text-[var(--erp-text-soft)]
                        whitespace-nowrap
                      "
                    >
                      Código
                    </th>

                    <th
                      className="
                        text-left
                        px-4
                        py-3
                        font-semibold
                        text-[var(--erp-text-soft)]
                        whitespace-nowrap
                      "
                    >
                      Teléfono
                    </th>

                    <th
                      className="
                        text-left
                        px-4
                        py-3
                        font-semibold
                        text-[var(--erp-text-soft)]
                        whitespace-nowrap
                      "
                    >
                      Nombre
                    </th>

                    <th
                      className="
                        text-left
                        px-4
                        py-3
                        font-semibold
                        text-[var(--erp-text-soft)]
                        whitespace-nowrap
                      "
                    >
                      Apellidos
                    </th>

                    <th
                      className="
                        text-left
                        px-4
                        py-3
                        font-semibold
                        text-[var(--erp-text-soft)]
                        whitespace-nowrap
                      "
                    >
                      Provincia
                    </th>

                    <th
                      className="
                        text-left
                        px-4
                        py-3
                        font-semibold
                        text-[var(--erp-text-soft)]
                        whitespace-nowrap
                      "
                    >
                      Municipio
                    </th>

                    <th
                      className="
                        text-left
                        px-4
                        py-3
                        font-semibold
                        text-[var(--erp-text-soft)]
                        whitespace-nowrap
                      "
                    >
                      CP
                    </th>

                    <th
                      className="
                        text-left
                        px-4
                        py-3
                        font-semibold
                        text-[var(--erp-text-soft)]
                        whitespace-nowrap
                      "
                    >
                      Dirección
                    </th>

                    <th className="px-5 py-3" />

                  </tr>
                </thead>

                <tbody>

                  {items.map((n) => (
                    <tr
                      key={n.id}
                      className="
                        border-b
                        border-[var(--erp-border)]
                        last:border-b-0
                        transition-colors
                        hover:bg-[var(--erp-primary-soft)]
                      "
                    >

                      <td
                        className="
                          px-5
                          py-3.5
                          font-semibold
                          text-[var(--erp-text)]
                          whitespace-nowrap
                        "
                      >
                        {n.codigo || "—"}
                      </td>

                      <td
                        className="
                          px-4
                          py-3.5
                          text-[var(--erp-text-soft)]
                          whitespace-nowrap
                        "
                      >
                        {n.telefono || "—"}
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
                        {n.nombre || "—"}
                      </td>

                      <td
                        className="
                          px-4
                          py-3.5
                          text-[var(--erp-text)]
                          whitespace-nowrap
                        "
                      >
                        {n.apellidos || "—"}
                      </td>

                      <td
                        className="
                          px-4
                          py-3.5
                          text-[var(--erp-text-soft)]
                          whitespace-nowrap
                        "
                      >
                        {n.provincia || "—"}
                      </td>

                      <td
                        className="
                          px-4
                          py-3.5
                          text-[var(--erp-text-soft)]
                          whitespace-nowrap
                        "
                      >
                        {n.municipio || "—"}
                      </td>

                      <td
                        className="
                          px-4
                          py-3.5
                          text-[var(--erp-text-soft)]
                          whitespace-nowrap
                        "
                      >
                        {n.cp || "—"}
                      </td>

                      <td
                        className="
                          px-4
                          py-3.5
                          text-[var(--erp-text-soft)]
                          min-w-[220px]
                        "
                      >
                        {n.direccion || "—"}
                      </td>

                      <td
                        className="
                          px-5
                          py-3.5
                          text-right
                          whitespace-nowrap
                        "
                      >

                        <button
                          type="button"
                          onClick={() =>
                            abrirDetalle(n)
                          }
                          className="
                            inline-flex
                            items-center
                            justify-center
                            px-3
                            py-1.5
                            rounded-lg
                            bg-[var(--erp-primary-soft)]
                            text-[var(--erp-primary)]
                            border border-[var(--erp-border)]
                            text-xs
                            font-semibold
                            transition
                            hover:opacity-80
                          "
                        >
                          Ver detalle
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

            {/* ==================================================
                PAGINACIÓN
               ================================================== */}

            <div
              className="
                px-5
                py-4
                border-t
                border-[var(--erp-border)]
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
                <span className="font-semibold text-[var(--erp-text)]">
                  {items.length}
                </span>{" "}
                notarías — Total{" "}
                <span className="font-semibold text-[var(--erp-text)]">
                  {total}
                </span>
              </p>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  disabled={!puedeAnterior}
                  onClick={irAnterior}
                  className="
                    px-3
                    py-2
                    rounded-xl
                    bg-white
                    border border-[var(--erp-border)]
                    text-[var(--erp-text)]
                    text-sm
                    font-medium
                    transition
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    hover:bg-[var(--erp-surface-soft)]
                  "
                >
                  ← Anterior
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
                  {pagina} / {totalPaginas}
                </span>

                <button
                  type="button"
                  disabled={!puedeSiguiente}
                  onClick={irSiguiente}
                  className="
                    px-3
                    py-2
                    rounded-xl
                    bg-white
                    border border-[var(--erp-border)]
                    text-[var(--erp-text)]
                    text-sm
                    font-medium
                    transition
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    hover:bg-[var(--erp-surface-soft)]
                  "
                >
                  Siguiente →
                </button>

              </div>

            </div>

          </>
        )}

      </section>

      {/* ======================================================
          MODAL
         ====================================================== */}

      <ModalCtnDetalle
        open={modalOpen}
        onClose={cerrarDetalle}
        notaria={selected}
      />

    </div>
  );
}
