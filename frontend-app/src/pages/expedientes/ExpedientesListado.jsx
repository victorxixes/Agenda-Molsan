import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerListadoExpedientes,
  exportarExcelExpedientes,
  obtenerResumenExpedientes,
} from "../../api/expedientes";

/*
 * ============================================================
 * COLUMNAS DEL EXPEDIENTE
 * ============================================================
 *
 * Estas columnas corresponden a los campos que devuelve:
 *
 * GET /api/expedientes/listado
 *
 * Incluye también "gestoria".
 */

const COLUMNAS = [
  // ==========================================================
  // IDENTIFICACIÓN
  // ==========================================================

  {
    key: "id_expediente",
    label: "Nº Expediente",
  },

  {
    key: "id",
    label: "ID",
  },

  {
    key: "id_expediente_cgn",
    label: "ID Expediente CGN",
  },

  // ==========================================================
  // FECHAS
  // ==========================================================

  {
    key: "fecha_alta",
    label: "Fecha Alta",
  },

  {
    key: "fecha_firma",
    label: "Fecha Firma",
  },

  {
    key: "fecha_inscripcion",
    label: "Fecha Inscripción",
  },

  {
    key: "fecha_entregado_cliente",
    label: "Fecha Entregado Cliente",
  },

  {
    key: "fecha_prevista_firma",
    label: "Fecha Prevista Firma",
  },

  {
    key: "fecha_vencimiento",
    label: "Fecha Vencimiento",
  },

  {
    key: "fecha_sol_cgn",
    label: "Fecha Solicitud CGN",
  },

  {
    key: "fecha_firma_prev_val",
    label: "Fecha Firma Prev. Validación",
  },

  {
    key: "fecha_firma_prev_cli",
    label: "Fecha Firma Prev. Cliente",
  },

  {
    key: "fecha_inicio_actividad",
    label: "Inicio Actividad",
  },

  {
    key: "fecha_fin_actividad",
    label: "Fin Actividad",
  },

  {
    key: "facturacion_fecha",
    label: "Fecha Facturación",
  },

  {
    key: "registral_fecha",
    label: "Fecha Registral",
  },

  // ==========================================================
  // ESTADOS
  // ==========================================================

  {
    key: "estado_expediente",
    label: "Estado Expediente",
  },

  {
    key: "estado_expediente_ancert",
    label: "Estado ANCERT",
  },

  {
    key: "estado_actividad",
    label: "Estado Actividad",
  },

  {
    key: "facturacion_estado",
    label: "Estado Facturación",
  },

  {
    key: "registral_estado",
    label: "Estado Registral",
  },

  // ==========================================================
  // ACTIVIDAD
  // ==========================================================

  {
    key: "actividad_actual",
    label: "Actividad Actual",
  },

  // ==========================================================
  // TITULAR
  // ==========================================================

  {
    key: "nombre_titular",
    label: "Nombre Titular",
  },

  {
    key: "nif_titular",
    label: "NIF Titular",
  },

  // ==========================================================
  // NOTARIO
  // ==========================================================

  {
    key: "nombre_notario",
    label: "Nombre Notario",
  },

  {
    key: "nif_notario",
    label: "NIF Notario",
  },

  {
    key: "notario",
    label: "Notario",
  },

  // ==========================================================
  // OFICINA
  // ==========================================================

  {
    key: "oficina",
    label: "Oficina",
  },

  {
    key: "oficina_alta",
    label: "Oficina Alta",
  },

  {
    key: "dan",
    label: "DAN",
  },

  // ==========================================================
  // ECONÓMICOS
  // ==========================================================

  {
    key: "importe",
    label: "Importe",
  },

  {
    key: "capital",
    label: "Capital",
  },

  {
    key: "saldo_real",
    label: "Saldo Real",
  },

  {
    key: "saldo_disponible",
    label: "Saldo Disponible",
  },

  // ==========================================================
  // OPERACIÓN
  // ==========================================================

  {
    key: "tipo_operacion",
    label: "Tipo Operación",
  },

  {
    key: "subtipo_operacion",
    label: "Subtipo Operación",
  },

  {
    key: "contrato",
    label: "Contrato",
  },

  {
    key: "num_solicitud_sia",
    label: "Nº Solicitud SIA",
  },

  {
    key: "vinccanc",
    label: "VincCanc",
  },

  {
    key: "protocolo",
    label: "Protocolo",
  },

  // ==========================================================
  // GTG / BANKIA
  // ==========================================================

  {
    key: "producto_gtg",
    label: "Producto GTG",
  },

  {
    key: "origen_bankia",
    label: "Origen Bankia",
  },

  {
    key: "dt",
    label: "DT",
  },

  // ==========================================================
  // GESTORÍA
  // ==========================================================

  {
    key: "gestoria",
    label: "Gestoría",
  },

  // ==========================================================
  // OTROS
  // ==========================================================

  {
    key: "lucy",
    label: "Lucy",
  },

  {
    key: "indicador_tt",
    label: "Indicador TT",
  },

  // ==========================================================
  // OBSERVACIONES
  // ==========================================================

  {
    key: "observaciones",
    label: "Observaciones",
  },

  // ==========================================================
  // RELACIONES
  // ==========================================================

  {
    key: "cliente_id",
    label: "ID Cliente",
  },
];


/*
 * ============================================================
 * FORMATEAR VALOR
 * ============================================================
 *
 * Convierte null / undefined / "" en "—".
 *
 * Las fechas se mantienen como vienen del backend:
 * YYYY-MM-DD
 *
 * Los números se muestran con formato español.
 */

function mostrarValor(valor, clave) {
  if (valor === null || valor === undefined || valor === "") {
    return "—";
  }

  // Valores numéricos
  if (
    typeof valor === "number" &&
    [
      "importe",
      "capital",
      "saldo_real",
      "saldo_disponible",
    ].includes(clave)
  ) {
    return valor.toLocaleString("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  return String(valor);
}


/*
 * ============================================================
 * COMPONENTE
 * ============================================================
 */

export default function ExpedientesListado() {
  const [expedientes, setExpedientes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [mostrarColumnas, setMostrarColumnas] = useState(false);

  // ==========================================================
  // FILTROS
  // ==========================================================

  const [filtroNif, setFiltroNif] = useState("");

  const [filtroActividad, setFiltroActividad] = useState("");

  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");

  const [filtroFechaFin, setFiltroFechaFin] = useState("");

  const [filtroNotario, setFiltroNotario] = useState("");

  const [filtroOficina, setFiltroOficina] = useState("");

  const [filtroImporteMin, setFiltroImporteMin] = useState("");

  const [filtroImporteMax, setFiltroImporteMax] = useState("");

  // ==========================================================
  // ORDENACIÓN
  // ==========================================================

  const [ordenMultiple, setOrdenMultiple] = useState([]);

  // ==========================================================
  // PAGINACIÓN
  // ==========================================================

  const [pagina, setPagina] = useState(1);

  const [totalPaginas, setTotalPaginas] = useState(1);

  const porPagina = 20;

  // ==========================================================
  // COLUMNAS VISIBLES
  // ==========================================================

  const [columnasVisibles, setColumnasVisibles] = useState(
    COLUMNAS.map((c) => c.key)
  );

  // ==========================================================
  // RESUMEN
  // ==========================================================

  const [resumen, setResumen] = useState({
    pendientes: 0,
    enCurso: 0,
    finalizados: 0,
  });


  /*
   * ==========================================================
   * CARGAR LISTADO
   * ==========================================================
   */

  const cargar = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await obtenerListadoExpedientes({
        pagina,
        porPagina,

        nif: filtroNif || undefined,

        actividad: filtroActividad || undefined,

        fechaInicio: filtroFechaInicio || undefined,

        fechaFin: filtroFechaFin || undefined,

        notario: filtroNotario || undefined,

        oficina: filtroOficina || undefined,

        importeMin: filtroImporteMin || undefined,

        importeMax: filtroImporteMax || undefined,

        ordenMultiple: ordenMultiple.length
          ? JSON.stringify(ordenMultiple)
          : undefined,
      });

      setExpedientes(res?.items || []);

      setTotalPaginas(
        res?.total_paginas || 1
      );
    } catch (err) {
      console.error(
        "Error cargando expedientes:",
        err
      );

      setError(
        "No se han podido cargar los expedientes."
      );

      setExpedientes([]);

      setTotalPaginas(1);
    } finally {
      setLoading(false);
    }
  };


  /*
   * ==========================================================
   * CARGAR RESUMEN
   * ==========================================================
   */

  const cargarResumen = async () => {
    try {
      const res =
        await obtenerResumenExpedientes();

      setResumen(
        res || {
          pendientes: 0,
          enCurso: 0,
          finalizados: 0,
        }
      );
    } catch (err) {
      console.error(
        "Error cargando resumen:",
        err
      );
    }
  };


  /*
   * ==========================================================
   * CARGA INICIAL / PAGINACIÓN / ORDENACIÓN
   * ==========================================================
   */

  useEffect(() => {
    cargar();
  }, [pagina, ordenMultiple]);


  useEffect(() => {
    cargarResumen();
  }, []);


  /*
   * ==========================================================
   * APLICAR FILTROS
   * ==========================================================
   */

  const aplicarFiltros = async () => {
    setPagina(1);

    /*
     * Si ya estamos en página 1, cambiar pagina no provoca
     * un nuevo useEffect. Por eso cargamos directamente.
     */
    if (pagina === 1) {
      await cargar();
    }
  };


  /*
   * ==========================================================
   * LIMPIAR FILTROS
   * ==========================================================
   */

  const limpiarFiltros = async () => {
    setFiltroNif("");
    setFiltroActividad("");
    setFiltroFechaInicio("");
    setFiltroFechaFin("");
    setFiltroNotario("");
    setFiltroOficina("");
    setFiltroImporteMin("");
    setFiltroImporteMax("");

    setPagina(1);

    /*
     * Carga directa con filtros vacíos.
     */

    try {
      setLoading(true);

      const res =
        await obtenerListadoExpedientes({
          pagina: 1,
          porPagina,
          ordenMultiple: ordenMultiple.length
            ? JSON.stringify(ordenMultiple)
            : undefined,
        });

      setExpedientes(res?.items || []);

      setTotalPaginas(
        res?.total_paginas || 1
      );
    } catch (err) {
      console.error(err);

      setError(
        "No se han podido cargar los expedientes."
      );
    } finally {
      setLoading(false);
    }
  };


  /*
   * ==========================================================
   * ORDENAR
   * ==========================================================
   */

  const ordenar = (col, shiftKey) => {
    if (!shiftKey) {
      const actual = ordenMultiple[0];

      if (
        actual &&
        actual.columna === col
      ) {
        setOrdenMultiple([
          {
            columna: col,

            direccion:
              actual.direccion === "asc"
                ? "desc"
                : "asc",
          },
        ]);
      } else {
        setOrdenMultiple([
          {
            columna: col,
            direccion: "asc",
          },
        ]);
      }

      return;
    }

    const existe =
      ordenMultiple.find(
        (o) => o.columna === col
      );

    if (existe) {
      setOrdenMultiple(
        ordenMultiple.map((o) =>
          o.columna === col
            ? {
                ...o,

                direccion:
                  o.direccion === "asc"
                    ? "desc"
                    : "asc",
              }
            : o
        )
      );
    } else {
      setOrdenMultiple([
        ...ordenMultiple,

        {
          columna: col,
          direccion: "asc",
        },
      ]);
    }
  };


  /*
   * ==========================================================
   * ICONO ORDENACIÓN
   * ==========================================================
   */

  const iconoOrden = (col) => {
    const o =
      ordenMultiple.find(
        (x) => x.columna === col
      );

    if (!o) {
      return "↕";
    }

    return o.direccion === "asc"
      ? "↑"
      : "↓";
  };


  /*
   * ==========================================================
   * EXPORTAR EXCEL
   * ==========================================================
   */

  const exportarExcel = async () => {
    try {
      await exportarExcelExpedientes({
        nif: filtroNif || undefined,

        actividad:
          filtroActividad || undefined,

        fechaInicio:
          filtroFechaInicio || undefined,

        fechaFin:
          filtroFechaFin || undefined,

        notario:
          filtroNotario || undefined,

        oficina:
          filtroOficina || undefined,

        importeMin:
          filtroImporteMin || undefined,

        importeMax:
          filtroImporteMax || undefined,
      });
    } catch (err) {
      console.error(
        "Error exportando Excel:",
        err
      );

      setError(
        "No se ha podido exportar el Excel."
      );
    }
  };


  /*
   * ==========================================================
   * CAMBIAR COLUMNA
   * ==========================================================
   */

  const cambiarColumna = (
    key,
    checked
  ) => {
    if (checked) {
      setColumnasVisibles((actuales) => [
        ...actuales,
        key,
      ]);
    } else {
      setColumnasVisibles((actuales) =>
        actuales.filter(
          (x) => x !== key
        )
      );
    }
  };


  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <div className="p-6 text-white space-y-6 animate-fade-in">

      {/* ======================================================
          TÍTULO
      ====================================================== */}

      <h1 className="text-3xl font-bold drop-shadow">
        Expedientes
      </h1>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 text-red-200">
          {error}
        </div>
      )}


      {/* ======================================================
          RESUMEN
      ====================================================== */}

      <section className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">

        <h2 className="text-xl font-semibold mb-4">
          Estado de expedientes
        </h2>

        <div className="grid grid-cols-3 gap-4 text-sm text-white/80">

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <p className="text-white/60">
              Pendientes
            </p>

            <p className="text-white font-semibold text-xl">
              {resumen.pendientes}
            </p>
          </div>


          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <p className="text-white/60">
              En curso
            </p>

            <p className="text-white font-semibold text-xl">
              {resumen.enCurso}
            </p>
          </div>


          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <p className="text-white/60">
              Finalizados
            </p>

            <p className="text-white font-semibold text-xl">
              {resumen.finalizados}
            </p>
          </div>

        </div>

      </section>


      {/* ======================================================
          FILTROS
      ====================================================== */}

      <section className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">

        <button
          onClick={() =>
            setMostrarFiltros(
              !mostrarFiltros
            )
          }
          className="w-full flex items-center justify-between text-xl font-semibold text-left hover:text-blue-300 transition"
        >

          <span>
            Filtros avanzados
          </span>

          <span className="text-sm">
            {mostrarFiltros
              ? "▲ Ocultar"
              : "▼ Mostrar"}
          </span>

        </button>


        {mostrarFiltros && (
          <div className="mt-4">

            <div className="grid grid-cols-3 gap-4">

              {/* NIF TITULAR */}

              <div>
                <label className="text-sm text-white/70">
                  NIF titular
                </label>

                <input
                  type="text"
                  value={filtroNif}
                  onChange={(e) =>
                    setFiltroNif(
                      e.target.value
                    )
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                />
              </div>


              {/* ACTIVIDAD */}

              <div>
                <label className="text-sm text-white/70">
                  Actividad actual
                </label>

                <input
                  type="text"
                  value={filtroActividad}
                  onChange={(e) =>
                    setFiltroActividad(
                      e.target.value
                    )
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                />
              </div>


              {/* FECHA INICIO */}

              <div>
                <label className="text-sm text-white/70">
                  Fecha inicio
                </label>

                <input
                  type="date"
                  value={filtroFechaInicio}
                  onChange={(e) =>
                    setFiltroFechaInicio(
                      e.target.value
                    )
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                />
              </div>


              {/* FECHA FIN */}

              <div>
                <label className="text-sm text-white/70">
                  Fecha fin
                </label>

                <input
                  type="date"
                  value={filtroFechaFin}
                  onChange={(e) =>
                    setFiltroFechaFin(
                      e.target.value
                    )
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                />
              </div>


              {/* NIF NOTARIO */}

              <div>
                <label className="text-sm text-white/70">
                  NIF notario
                </label>

                <input
                  type="text"
                  value={filtroNotario}
                  onChange={(e) =>
                    setFiltroNotario(
                      e.target.value
                    )
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                />
              </div>


              {/* OFICINA */}

              <div>
                <label className="text-sm text-white/70">
                  Oficina
                </label>

                <input
                  type="text"
                  value={filtroOficina}
                  onChange={(e) =>
                    setFiltroOficina(
                      e.target.value
                    )
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                />
              </div>


              {/* IMPORTE MIN */}

              <div>
                <label className="text-sm text-white/70">
                  Importe mínimo
                </label>

                <input
                  type="number"
                  value={filtroImporteMin}
                  onChange={(e) =>
                    setFiltroImporteMin(
                      e.target.value
                    )
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                />
              </div>


              {/* IMPORTE MAX */}

              <div>
                <label className="text-sm text-white/70">
                  Importe máximo
                </label>

                <input
                  type="number"
                  value={filtroImporteMax}
                  onChange={(e) =>
                    setFiltroImporteMax(
                      e.target.value
                    )
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                />
              </div>


              {/* BOTONES */}

              <div className="flex items-end gap-3">

                <button
                  onClick={aplicarFiltros}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition"
                >
                  Aplicar filtros
                </button>


                <button
                  onClick={limpiarFiltros}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white shadow-lg transition"
                >
                  Limpiar
                </button>


                <button
                  onClick={exportarExcel}
                  className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg transition"
                >
                  Exportar Excel
                </button>

              </div>

            </div>

          </div>
        )}

      </section>


      {/* ======================================================
          SELECTOR DE COLUMNAS
      ====================================================== */}

      <section className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">

        <button
          onClick={() =>
            setMostrarColumnas(
              !mostrarColumnas
            )
          }
          className="w-full flex items-center justify-between text-xl font-semibold text-left hover:text-blue-300 transition"
        >

          <span>
            Columnas visibles
          </span>

          <span className="text-sm">
            {mostrarColumnas
              ? "▲ Ocultar"
              : "▼ Mostrar"}
          </span>

        </button>


        {mostrarColumnas && (
          <div className="mt-4">

            <div className="grid grid-cols-3 gap-2">

              {COLUMNAS.map((c) => (
                <label
                  key={c.key}
                  className="flex items-center gap-2 text-sm text-white/70"
                >

                  <input
                    type="checkbox"
                    checked={columnasVisibles.includes(
                      c.key
                    )}
                    onChange={(e) =>
                      cambiarColumna(
                        c.key,
                        e.target.checked
                      )
                    }
                  />

                  {c.label}

                </label>
              ))}

            </div>

          </div>
        )}

      </section>


      {/* ======================================================
          TABLA
      ====================================================== */}

      <section className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl overflow-auto">

        {loading ? (

          <div className="text-white/70 animate-pulse p-4">
            Cargando expedientes…
          </div>

        ) : expedientes.length === 0 ? (

          <div className="text-white/60 p-4">
            No hay expedientes que mostrar.
          </div>

        ) : (

          <table className="min-w-full text-sm text-white/80">

            <thead>

              <tr className="text-left bg-white/5">

                {COLUMNAS
                  .filter((c) =>
                    columnasVisibles.includes(
                      c.key
                    )
                  )
                  .map((c) => (

                    <th
                      key={c.key}
                      className="px-3 py-2 cursor-pointer select-none whitespace-nowrap"
                      onClick={(e) =>
                        ordenar(
                          c.key,
                          e.shiftKey
                        )
                      }
                    >

                      {c.label}

                      {" "}

                      <span className="text-white/40">
                        {iconoOrden(c.key)}
                      </span>

                    </th>

                  ))}


                <th className="px-3 py-2 whitespace-nowrap">
                  Acciones
                </th>

              </tr>

            </thead>


            <tbody>

              {expedientes.map((exp) => (

                <tr
                  key={
                    exp.id_expediente ??
                    exp.id
                  }
                  className="border-t border-white/10 hover:bg-white/5"
                >

                  {COLUMNAS
                    .filter((c) =>
                      columnasVisibles.includes(
                        c.key
                      )
                    )
                    .map((c) => (

                      <td
                        key={c.key}
                        className="px-3 py-2 whitespace-nowrap"
                      >

                        {mostrarValor(
                          exp[c.key],
                          c.key
                        )}

                      </td>

                    ))}


                  {/* ACCIONES */}

                  <td className="px-3 py-2 whitespace-nowrap">

                    {exp.id_expediente ? (

                      <Link
                        to={`/expedientes/${exp.id_expediente}`}
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        Ver ficha
                      </Link>

                    ) : (

                      <span className="text-white/40">
                        —
                      </span>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </section>


      {/* ======================================================
          PAGINACIÓN
      ====================================================== */}

      <div className="flex items-center justify-center gap-4">

        <button
          disabled={pagina <= 1}
          onClick={() =>
            setPagina(
              pagina - 1
            )
          }
          className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition disabled:opacity-40"
        >
          Anterior
        </button>


        <span className="text-white/70">
          Página {pagina} de{" "}
          {totalPaginas}
        </span>


        <button
          disabled={
            pagina >= totalPaginas
          }
          onClick={() =>
            setPagina(
              pagina + 1
            )
          }
          className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition disabled:opacity-40"
        >
          Siguiente
        </button>

      </div>

    </div>
  );
}
