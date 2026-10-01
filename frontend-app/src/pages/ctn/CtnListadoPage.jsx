import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import { useCtn } from "../../hooks/useCtn";
import ModalCtnDetalle from "../../components/ctn/ModalCtnDetalle";

export default function CtnListadoPage() {
  const {
    items,
    total,
    cargarNotarias,
    cargarFirmasNotaria,
    firmas,
    loading,
  } = useCtn();

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
  // CARGAR LISTADO
  // ============================================================

  useEffect(() => {
    cargarNotarias(filtros, pagina, PAGE_SIZE);
  }, [cargarNotarias, filtros, pagina]);

  // ============================================================
  // FILTROS
  // ============================================================

  const aplicarFiltros = useCallback(() => {
    setPagina(1);
    cargarNotarias(filtros, 1, PAGE_SIZE);
  }, [filtros, cargarNotarias]);

  const limpiarFiltros = useCallback(() => {
    setFiltros({
      provincia: "",
      municipio: "",
      vc: "",
      apoderado: "",
      q: "",
    });

    setPagina(1);
  }, []);

  const filtrosKeys = useMemo(
    () => Object.keys(filtros),
    [filtros]
  );

  // ============================================================
  // DETALLE
  // ============================================================

  const abrirDetalle = useCallback(
    async (notaria) => {
      setSelected(notaria);
      setModalOpen(true);

      if (cargarFirmasNotaria && notaria?.id) {
        try {
          await cargarFirmasNotaria(notaria.id);
        } catch (error) {
          console.error(
            "Error cargando firmas de la notaría:",
            error
          );
        }
      }
    },
    [cargarFirmasNotaria]
  );

  const cerrarDetalle = useCallback(() => {
    setModalOpen(false);
    setSelected(null);
  }, []);

  // ============================================================
  // PAGINACIÓN
  // ============================================================

  const totalPaginas = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE)
  );

  // ============================================================
  // EXPORTAR EXCEL
  // ============================================================

  const descargarExcel = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      Object.entries(filtros).forEach(
        ([key, value]) => {
          if (
            value &&
            String(value).trim() !== ""
          ) {
            params.append(
              key,
              String(value).trim()
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
          Authorization:
            `Bearer ${localStorage.getItem("token")}`,
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
  }, [filtros]);

  // ============================================================
  // INPUT
  // ============================================================

  const actualizarFiltro = useCallback(
    (key, value) => {
      setFiltros((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          FILTROS
         ====================================================== */}

      <section className="erp-card p-4 sm:p-5 shadow-sm">

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-4
            mb-5
          "
        >
          <div>
            <h2 className="text-xl font-semibold text-[var(--erp-text)]">
              Buscar notarías
            </h2>

            <p className="text-sm text-[var(--erp-text-soft)] mt-1">
              Filtra por provincia, municipio, VC,
              apoderado o texto libre.
            </p>
          </div>

          <div className="text-sm text-[var(--erp-text-soft)]">
            Total:
            <strong className="ml-1 text-[var(--erp-text)]">
              {total}
            </strong>
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-5
            gap-4
          "
        >
          {filtrosKeys.map((key) => (
            <div key={key}>
              <label
                className="
                  block
                  text-xs
                  font-semibold
                  text-[var(--erp-text-soft)]
                  mb-1.5
                "
              >
                {key === "q"
                  ? "Búsqueda"
                  : key.charAt(0).toUpperCase() +
                    key.slice(1)}
              </label>

              <input
                type="text"
                value={filtros[key]}
                onChange={(e) =>
                  actualizarFiltro(
                    key,
                    e.target.value
                  )
                }
                placeholder={
                  key === "q"
                    ? "Nombre, código, NIF..."
                    : `Filtrar ${key}`
                }
                className="
                  w-full
                  bg-white
                  border
                  border-[var(--erp-border)]
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  text-[var(--erp-text)]
                  placeholder:text-slate-400
                  outline-none
                  transition
                  focus:border-[var(--erp-primary)]
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>
          ))}
        </div>

        <div
          className="
            flex
            flex-wrap
            gap-3
            mt-5
            pt-5
            border-t
            border-[var(--erp-border)]
          "
        >
          <button
            type="button"
            onClick={aplicarFiltros}
            disabled={loading}
            className="
              px-4
              py-2.5
              rounded-xl
              bg-[var(--erp-primary)]
              hover:bg-[var(--erp-primary-dark)]
              text-white
              font-medium
              shadow-sm
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Aplicar filtros
          </button>

          <button
            type="button"
            onClick={limpiarFiltros}
            className="
              px-4
              py-2.5
              rounded-xl
              bg-white
              border
              border-[var(--erp-border)]
              text-[var(--erp-text)]
              hover:bg-[var(--erp-surface-soft)]
              font-medium
              transition
            "
          >
            Limpiar
          </button>

          <button
            type="button"
            onClick={descargarExcel}
            disabled={loading}
            className="
              px-4
              py-2.5
              rounded-xl
              bg-[var(--erp-success)]
              hover:brightness-95
              text-white
              font-medium
              shadow-sm
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Descargar Excel
          </button>
        </div>
      </section>

      {/* ======================================================
          TABLA
         ====================================================== */}

      <section className="erp-card shadow-sm overflow-hidden">

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[var(--erp-text-soft)] animate-pulse">
              Cargando notarías…
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>
                  <tr className="bg-[var(--erp-primary)] text-white">

                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Código
                    </th>

                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Teléfono
                    </th>

                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Nombre
                    </th>

                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Apellidos
                    </th>

                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Provincia
                    </th>

                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Municipio
                    </th>

                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                      CP
                    </th>

                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Dirección
                    </th>

                    <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                      Acción
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-12 text-center"
                      >
                        <div className="text-[var(--erp-text-soft)]">
                          No se han encontrado notarías.
                        </div>

                        <div className="text-xs mt-1 text-slate-400">
                          Prueba a modificar los filtros.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((n) => (
                      <tr
                        key={n.id}
                        className="
                          border-b
                          border-[var(--erp-border)]
                          hover:bg-[var(--erp-primary-soft)]
                          transition-colors
                        "
                      >

                        <td className="px-4 py-3 font-medium text-[var(--erp-text)] whitespace-nowrap">
                          {n.codigo || "—"}
                        </td>

                        <td className="px-4 py-3 text-[var(--erp-text-soft)] whitespace-nowrap">
                          {n.telefono || "—"}
                        </td>

                        <td className="px-4 py-3 text-[var(--erp-text)]">
                          {n.nombre || "—"}
                        </td>

                        <td className="px-4 py-3 text-[var(--erp-text)]">
                          {n.apellidos || "—"}
                        </td>

                        <td className="px-4 py-3 text-[var(--erp-text-soft)]">
                          {n.provincia || "—"}
                        </td>

                        <td className="px-4 py-3 text-[var(--erp-text-soft)]">
                          {n.municipio || "—"}
                        </td>

                        <td className="px-4 py-3 text-[var(--erp-text-soft)] whitespace-nowrap">
                          {n.cp || "—"}
                        </td>

                        <td className="px-4 py-3 text-[var(--erp-text-soft)] min-w-[220px]">
                          {n.direccion || "—"}
                        </td>

                        <td className="px-4 py-3 text-right">
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
                              font-medium
                              hover:bg-blue-100
                              transition
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

              <p className="text-sm text-[var(--erp-text-soft)]">
                Mostrando{" "}
                <strong className="text-[var(--erp-text)]">
                  {items.length}
                </strong>{" "}
                notarías de{" "}
                <strong className="text-[var(--erp-text)]">
                  {total}
                </strong>
              </p>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  disabled={pagina <= 1}
                  onClick={() =>
                    setPagina((p) => p - 1)
                  }
                  className="
                    px-3
                    py-2
                    rounded-xl
                    bg-white
                    border
                    border-[var(--erp-border)]
                    text-[var(--erp-text)]
                    hover:bg-slate-50
                    transition
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                >
                  ← Anterior
                </button>

                <span
                  className="
                    px-3
                    py-2
                    text-sm
                    text-[var(--erp-text-soft)]
                    whitespace-nowrap
                  "
                >
                  Página{" "}
                  <strong className="text-[var(--erp-text)]">
                    {pagina}
                  </strong>{" "}
                  de{" "}
                  <strong className="text-[var(--erp-text)]">
                    {totalPaginas}
                  </strong>
                </span>

                <button
                  type="button"
                  disabled={pagina >= totalPaginas}
                  onClick={() =>
                    setPagina((p) => p + 1)
                  }
                  className="
                    px-3
                    py-2
                    rounded-xl
                    bg-white
                    border
                    border-[var(--erp-border)]
                    text-[var(--erp-text)]
                    hover:bg-slate-50
                    transition
                    disabled:opacity-40
                    disabled:cursor-not-allowed
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
        firmas={firmas}
      />

    </div>
  );
}
