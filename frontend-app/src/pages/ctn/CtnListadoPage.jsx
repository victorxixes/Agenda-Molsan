import { useEffect, useState, useCallback, useMemo } from "react";
import { useCtn } from "../../hooks/useCtn";
import ModalCtnDetalle from "../../components/ctn/ModalCtnDetalle";

export default function CtnListadoPage() {
  const { items, total, cargarNotarias, loading } = useCtn();

  const [filtros, setFiltros] = useState({
    provincia: "",
    municipio: "",
    vc: "",
    apoderado: "",
    q: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [pagina, setPagina] = useState(1);
  const PAGE_SIZE = 15;

  // ============================================================
  // ORDENACIÓN
  // ============================================================

  const [orden, setOrden] = useState({
    campo: null,
    direccion: "asc",
  });

  const cambiarOrden = useCallback((campo) => {
    setOrden((prev) => {
      if (prev.campo === campo) {
        return {
          campo,
          direccion: prev.direccion === "asc" ? "desc" : "asc",
        };
      }

      return {
        campo,
        direccion: "asc",
      };
    });
  }, []);

  // ============================================================
  // CARGAR NOTARÍAS
  // ============================================================

  useEffect(() => {
    cargarNotarias(filtros, pagina, PAGE_SIZE);
  }, [cargarNotarias, filtros, pagina]);

  // ============================================================
  // APLICAR FILTROS
  // ============================================================

  const aplicarFiltros = useCallback(() => {
    setPagina(1);
    setOrden({
      campo: null,
      direccion: "asc",
    });

    cargarNotarias(filtros, 1, PAGE_SIZE);
  }, [filtros, cargarNotarias]);

  // ============================================================
  // ABRIR DETALLE
  // ============================================================

  const abrirDetalle = useCallback((notaria) => {
    setSelected(notaria);
    setModalOpen(true);
  }, []);

  // ============================================================
  // CLAVES DE FILTROS
  // ============================================================

  const filtrosKeys = useMemo(
    () => Object.keys(filtros),
    [filtros]
  );

  // ============================================================
  // ORDENAR RESULTADOS
  // ============================================================

  const itemsOrdenados = useMemo(() => {
    if (!Array.isArray(items)) {
      return [];
    }

    if (!orden.campo) {
      return items;
    }

    const copia = [...items];

    copia.sort((a, b) => {
      let valorA = a?.[orden.campo];
      let valorB = b?.[orden.campo];

      // --------------------------------------------------------
      // Valores vacíos
      // --------------------------------------------------------

      if (
        valorA === null ||
        valorA === undefined
      ) {
        valorA = "";
      }

      if (
        valorB === null ||
        valorB === undefined
      ) {
        valorB = "";
      }

      // --------------------------------------------------------
      // Normalización
      // --------------------------------------------------------

      const textoA = String(valorA)
        .trim()
        .toLocaleLowerCase("es");

      const textoB = String(valorB)
        .trim()
        .toLocaleLowerCase("es");

      // --------------------------------------------------------
      // Comparación numérica cuando procede
      // --------------------------------------------------------

      const numeroA = Number(textoA);
      const numeroB = Number(textoB);

      const ambosNumericos =
        textoA !== "" &&
        textoB !== "" &&
        !Number.isNaN(numeroA) &&
        !Number.isNaN(numeroB);

      let resultado;

      if (ambosNumericos) {
        resultado = numeroA - numeroB;
      } else {
        resultado = textoA.localeCompare(
          textoB,
          "es",
          {
            numeric: true,
            sensitivity: "base",
          }
        );
      }

      return orden.direccion === "asc"
        ? resultado
        : -resultado;
    });

    return copia;
  }, [items, orden]);

  // ============================================================
  // TOTAL PÁGINAS
  // ============================================================

  const totalPaginas = Math.ceil(total / PAGE_SIZE);

  // ============================================================
  // DESCARGAR EXCEL
  // ============================================================

  const descargarExcel = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          params.append(key, value);
        }
      });

      const urlExcel =
        `${import.meta.env.VITE_API_URL}/ctn/exportar-excel?${params.toString()}`;

      const res = await fetch(urlExcel, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error(
          `Error HTTP ${res.status}`
        );
      }

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
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
  }, [filtros]);

  // ============================================================
  // COMPONENTE INTERNO DE CABECERA ORDENABLE
  // ============================================================

  const CabeceraOrdenable = ({
    campo,
    children,
    className = "",
  }) => {
    const activa = orden.campo === campo;

    return (
      <th
        className={`
          px-3
          py-3
          text-left
          font-semibold
          text-[var(--erp-text)]
          whitespace-nowrap
          select-none
          ${className}
        `}
      >
        <button
          type="button"
          onClick={() => cambiarOrden(campo)}
          className="
            inline-flex
            items-center
            gap-2
            group
            font-semibold
            text-[var(--erp-text)]
            hover:text-[var(--erp-primary)]
            transition-colors
          "
        >
          <span>{children}</span>

          <span
            className={`
              text-xs
              transition-opacity
              ${
                activa
                  ? "opacity-100 text-[var(--erp-primary)]"
                  : "opacity-30 group-hover:opacity-70"
              }
            `}
          >
            {activa
              ? orden.direccion === "asc"
                ? "↑"
                : "↓"
              : "↕"}
          </span>
        </button>
      </th>
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          FILTROS
         ====================================================== */}

      <div
        className="
          erp-card
          p-4
          shadow-sm
        "
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

          {filtrosKeys.map((key) => (
            <input
              key={key}
              className="
                w-full
                bg-[var(--erp-surface-soft)]
                border
                border-[var(--erp-border)]
                rounded-xl
                px-3
                py-2
                text-sm
                text-[var(--erp-text)]
                placeholder-[var(--erp-text-soft)]
                outline-none
                transition
                focus:border-[var(--erp-primary)]
                focus:ring-2
                focus:ring-[var(--erp-primary-soft)]
              "
              placeholder={
                key === "q"
                  ? "Buscar nombre, apellidos, código, NIF…"
                  : key.charAt(0).toUpperCase() +
                    key.slice(1)
              }
              value={filtros[key]}
              onChange={(e) =>
                setFiltros((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }))
              }
            />
          ))}

        </div>
      </div>

      {/* ======================================================
          BOTONES
         ====================================================== */}

      <div className="flex flex-wrap gap-3">

        <button
          type="button"
          className="
            px-4
            py-2
            rounded-xl
            bg-[var(--erp-primary)]
            hover:bg-[var(--erp-primary-dark)]
            text-white
            shadow-sm
            transition
            active:scale-[0.97]
          "
          onClick={aplicarFiltros}
        >
          Aplicar filtros
        </button>

        <button
          type="button"
          className="
            px-4
            py-2
            rounded-xl
            bg-[var(--erp-success)]
            hover:opacity-90
            text-white
            shadow-sm
            transition
            active:scale-[0.97]
          "
          onClick={descargarExcel}
        >
          Descargar Excel
        </button>

      </div>

      {/* ======================================================
          TABLA
         ====================================================== */}

      {loading ? (
        <div className="erp-card p-6">
          <p className="text-sm text-[var(--erp-text-soft)] animate-pulse">
            Cargando notarías…
          </p>
        </div>
      ) : (
        <div
          className="
            erp-card
            overflow-hidden
            shadow-sm
          "
        >

          {/* --------------------------------------------------
              CABECERA DE TABLA
             -------------------------------------------------- */}

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

                  <CabeceraOrdenable campo="codigo">
                    Código
                  </CabeceraOrdenable>

                  <CabeceraOrdenable campo="telefono">
                    Teléfono
                  </CabeceraOrdenable>

                  <CabeceraOrdenable campo="nombre">
                    Nombre
                  </CabeceraOrdenable>

                  <CabeceraOrdenable campo="apellidos">
                    Apellidos
                  </CabeceraOrdenable>

                  <CabeceraOrdenable campo="provincia">
                    Provincia
                  </CabeceraOrdenable>

                  <CabeceraOrdenable campo="municipio">
                    Municipio
                  </CabeceraOrdenable>

                  <CabeceraOrdenable campo="cp">
                    CP
                  </CabeceraOrdenable>

                  <CabeceraOrdenable campo="direccion">
                    Dirección
                  </CabeceraOrdenable>

                  <th
                    className="
                      px-3
                      py-3
                      text-left
                      font-semibold
                      text-[var(--erp-text)]
                    "
                  >
                    Acciones
                  </th>

                </tr>
              </thead>

              {/* ------------------------------------------------
                  CUERPO
                 ------------------------------------------------ */}

              <tbody>

                {itemsOrdenados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="
                        px-4
                        py-10
                        text-center
                        text-sm
                        text-[var(--erp-text-soft)]
                      "
                    >
                      No se han encontrado notarías.
                    </td>
                  </tr>
                ) : (
                  itemsOrdenados.map((n) => (
                    <tr
                      key={n.id}
                      className="
                        border-b
                        border-[var(--erp-border)]
                        last:border-b-0
                        bg-[var(--erp-surface)]
                        hover:bg-[var(--erp-primary-soft)]
                        transition-colors
                      "
                    >

                      <td
                        className="
                          px-3
                          py-3
                          font-medium
                          text-[var(--erp-text)]
                          whitespace-nowrap
                        "
                      >
                        {n.codigo || "—"}
                      </td>

                      <td
                        className="
                          px-3
                          py-3
                          text-[var(--erp-text-soft)]
                          whitespace-nowrap
                        "
                      >
                        {n.telefono || "—"}
                      </td>

                      <td
                        className="
                          px-3
                          py-3
                          text-[var(--erp-text)]
                          font-medium
                          whitespace-nowrap
                        "
                      >
                        {n.nombre || "—"}
                      </td>

                      <td
                        className="
                          px-3
                          py-3
                          text-[var(--erp-text-soft)]
                          whitespace-nowrap
                        "
                      >
                        {n.apellidos || "—"}
                      </td>

                      <td
                        className="
                          px-3
                          py-3
                          text-[var(--erp-text-soft)]
                          whitespace-nowrap
                        "
                      >
                        {n.provincia || "—"}
                      </td>

                      <td
                        className="
                          px-3
                          py-3
                          text-[var(--erp-text-soft)]
                          whitespace-nowrap
                        "
                      >
                        {n.municipio || "—"}
                      </td>

                      <td
                        className="
                          px-3
                          py-3
                          text-[var(--erp-text-soft)]
                          whitespace-nowrap
                        "
                      >
                        {n.cp || "—"}
                      </td>

                      <td
                        className="
                          px-3
                          py-3
                          text-[var(--erp-text-soft)]
                          min-w-[220px]
                        "
                      >
                        {n.direccion || "—"}
                      </td>

                      <td
                        className="
                          px-3
                          py-3
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
                            px-3
                            py-1.5
                            rounded-lg
                            bg-[var(--erp-primary-soft)]
                            text-[var(--erp-primary)]
                            border
                            border-blue-100
                            hover:bg-blue-100
                            transition
                            font-medium
                            text-xs
                          "
                        >
                          Ver detalle
                        </button>
                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

          {/* ==================================================
              PAGINACIÓN
             ================================================== */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-3
              p-4
              border-t
              border-[var(--erp-border)]
              bg-[var(--erp-surface-soft)]
            "
          >

            <button
              type="button"
              className="
                px-3
                py-2
                rounded-xl
                bg-white
                border
                border-[var(--erp-border)]
                text-[var(--erp-text)]
                hover:bg-[var(--erp-primary-soft)]
                transition
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
              disabled={pagina <= 1}
              onClick={() =>
                setPagina((p) => p - 1)
              }
            >
              ← Anterior
            </button>

            <span
              className="
                text-sm
                text-[var(--erp-text-soft)]
                text-center
              "
            >
              Página{" "}
              <strong className="text-[var(--erp-text)]">
                {pagina}
              </strong>{" "}
              de{" "}
              <strong className="text-[var(--erp-text)]">
                {totalPaginas || 1}
              </strong>
            </span>

            <button
              type="button"
              className="
                px-3
                py-2
                rounded-xl
                bg-white
                border
                border-[var(--erp-border)]
                text-[var(--erp-text)]
                hover:bg-[var(--erp-primary-soft)]
                transition
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
              disabled={
                pagina >= totalPaginas ||
                totalPaginas === 0
              }
              onClick={() =>
                setPagina((p) => p + 1)
              }
            >
              Siguiente →
            </button>

          </div>

          {/* ==================================================
              INFORMACIÓN
             ================================================== */}

          <div
            className="
              px-4
              pb-4
              text-xs
              text-[var(--erp-text-soft)]
            "
          >
            Mostrando{" "}
            <strong className="text-[var(--erp-text)]">
              {itemsOrdenados.length}
            </strong>{" "}
            notarías — Total:{" "}
            <strong className="text-[var(--erp-text)]">
              {total}
            </strong>

            {orden.campo && (
              <>
                {" "}· Ordenado por{" "}
                <strong className="text-[var(--erp-text)]">
                  {orden.campo}
                </strong>{" "}
                {orden.direccion === "asc"
                  ? "↑"
                  : "↓"}
              </>
            )}
          </div>

        </div>
      )}

      {/* ======================================================
          MODAL
         ====================================================== */}

      <ModalCtnDetalle
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        notaria={selected}
      />

    </div>
  );
}
