import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  obtenerListadoExpedientes,
  exportarExcelExpedientes,
  obtenerResumenExpedientes,
} from "../../api/expedientes";


// ============================================================
// COLUMNAS
// ============================================================

const COLUMNAS = [

  // IDENTIFICACIÓN

  {
    key: "id_expediente",
    label: "Nº Expediente",
    tipo: "texto",
  },

  {
    key: "id",
    label: "ID",
    tipo: "numero",
  },

  {
    key: "cliente_id",
    label: "ID Cliente",
    tipo: "numero",
  },

  // ESTADOS

  {
    key: "estado_expediente",
    label: "Estado expediente",
    tipo: "texto",
  },

  {
    key: "estado_expediente_ancert",
    label: "Estado ANCERT",
    tipo: "texto",
  },

  {
    key: "estado_actividad",
    label: "Estado actividad",
    tipo: "texto",
  },

  {
    key: "facturacion_estado",
    label: "Estado facturación",
    tipo: "texto",
  },

  {
    key: "registral_estado",
    label: "Estado registral",
    tipo: "texto",
  },

  // FECHAS

  {
    key: "fecha_alta",
    label: "Fecha alta",
    tipo: "fecha",
  },

  {
    key: "fecha_firma",
    label: "Fecha firma",
    tipo: "fecha",
  },

  {
    key: "fecha_inscripcion",
    label: "Fecha inscripción",
    tipo: "fecha",
  },

  {
    key: "fecha_entregado_cliente",
    label: "Fecha entregado cliente",
    tipo: "fecha",
  },

  {
    key: "fecha_prevista_firma",
    label: "Fecha prevista firma",
    tipo: "fecha",
  },

  {
    key: "fecha_vencimiento",
    label: "Fecha vencimiento",
    tipo: "fecha",
  },

  {
    key: "fecha_sol_cgn",
    label: "Fecha solicitud CGN",
    tipo: "fecha",
  },

  {
    key: "fecha_firma_prev_val",
    label: "Firma prev. validación",
    tipo: "fecha",
  },

  {
    key: "fecha_firma_prev_cli",
    label: "Firma prev. cliente",
    tipo: "fecha",
  },

  {
    key: "fecha_inicio_actividad",
    label: "Inicio actividad",
    tipo: "fecha",
  },

  {
    key: "fecha_fin_actividad",
    label: "Fin actividad",
    tipo: "fecha",
  },

  {
    key: "fcierre_defecto",
    label: "Cierre defecto",
    tipo: "fecha",
  },

  {
    key: "facturacion_fecha",
    label: "Fecha facturación",
    tipo: "fecha",
  },

  {
    key: "registral_fecha",
    label: "Fecha registral",
    tipo: "fecha",
  },

  // ACTIVIDAD

  {
    key: "actividad_actual",
    label: "Actividad actual",
    tipo: "texto",
  },

  // TITULAR

  {
    key: "nombre_titular",
    label: "Nombre titular",
    tipo: "texto",
  },

  {
    key: "nif_titular",
    label: "NIF titular",
    tipo: "texto",
  },

  // SOLICITANTE

  {
    key: "nombre_solicitante",
    label: "Nombre solicitante",
    tipo: "texto",
  },

  {
    key: "nif_solicitante",
    label: "NIF solicitante",
    tipo: "texto",
  },

  {
    key: "apoderado",
    label: "Apoderado",
    tipo: "texto",
  },

  // NOTARIO

  {
    key: "nombre_notario",
    label: "Nombre notario",
    tipo: "texto",
  },

  {
    key: "nif_notario",
    label: "NIF notario",
    tipo: "texto",
  },

  {
    key: "notario",
    label: "Notario",
    tipo: "texto",
  },

  // OFICINA

  {
    key: "oficina",
    label: "Oficina",
    tipo: "texto",
  },

  {
    key: "dan",
    label: "DAN",
    tipo: "texto",
  },

  {
    key: "oficina_alta",
    label: "Oficina alta",
    tipo: "texto",
  },

  // ECONÓMICOS

  {
    key: "capital",
    label: "Capital",
    tipo: "numero",
  },

  {
    key: "importe",
    label: "Importe",
    tipo: "numero",
  },

  {
    key: "saldo_real",
    label: "Saldo real",
    tipo: "numero",
  },

  {
    key: "saldo_disponible",
    label: "Saldo disponible",
    tipo: "numero",
  },

  // PROVISIÓN

  {
    key: "id_provision",
    label: "ID provisión",
    tipo: "texto",
  },

  {
    key: "tipo_provision",
    label: "Tipo provisión",
    tipo: "texto",
  },

  // OPERACIÓN

  {
    key: "contrato",
    label: "Contrato",
    tipo: "texto",
  },

  {
    key: "num_solicitud_sia",
    label: "Nº solicitud SIA",
    tipo: "texto",
  },

  {
    key: "tipo_operacion",
    label: "Tipo operación",
    tipo: "texto",
  },

  {
    key: "subtipo_operacion",
    label: "Subtipo operación",
    tipo: "texto",
  },

  {
    key: "vinccanc",
    label: "VincCanc",
    tipo: "texto",
  },

  {
    key: "protocolo",
    label: "Protocolo",
    tipo: "texto",
  },

  // GTG / BANKIA

  {
    key: "origen_bankia",
    label: "Origen Bankia",
    tipo: "texto",
  },

  {
    key: "producto_gtg",
    label: "Producto GTG",
    tipo: "texto",
  },

  {
    key: "dt",
    label: "DT",
    tipo: "texto",
  },

  // GESTORÍA

  {
    key: "id_gestoria_tramite",
    label: "ID gestoría trámite",
    tipo: "texto",
  },

  {
    key: "nombre_gestoria",
    label: "Nombre gestoría",
    tipo: "texto",
  },

  {
    key: "gestoria",
    label: "Gestoría",
    tipo: "texto",
  },

  // FINCA

  {
    key: "finca",
    label: "Finca",
    tipo: "texto",
  },

  // DEFECTOS

  {
    key: "tiene_defectos_abiertos",
    label: "Defectos abiertos",
    tipo: "texto",
  },

  {
    key: "tipo_error",
    label: "Tipo error",
    tipo: "texto",
  },

  {
    key: "descripcion_error",
    label: "Descripción error",
    tipo: "texto",
  },

  {
    key: "falta_defecto",
    label: "Falta / defecto",
    tipo: "texto",
  },

  // CGN

  {
    key: "id_expediente_cgn",
    label: "ID expediente CGN",
    tipo: "texto",
  },

  // ACTA

  {
    key: "tipo_acta",
    label: "Tipo acta",
    tipo: "texto",
  },

  // OTROS

  {
    key: "lucy",
    label: "Lucy",
    tipo: "texto",
  },

  {
    key: "indicador_tt",
    label: "Indicador TT",
    tipo: "texto",
  },

  // OBSERVACIONES

  {
    key: "observaciones",
    label: "Observaciones",
    tipo: "texto",
  },
];


// ============================================================
// FORMATEAR VALOR
// ============================================================

function formatearValor(valor, tipo) {

  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return "—";
  }

  if (tipo === "fecha") {

    const texto = String(valor);

    if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {

      const [
        year,
        month,
        day,
      ] = texto.split("-");

      return `${day}/${month}/${year}`;
    }

    return texto;
  }

  if (tipo === "numero") {

    const numero = Number(valor);

    if (Number.isNaN(numero)) {
      return String(valor);
    }

    return new Intl.NumberFormat(
      "es-ES",
      {
        maximumFractionDigits: 2,
      }
    ).format(numero);
  }

  return String(valor);
}


// ============================================================
// NORMALIZAR ACTIVIDADES
// ============================================================

function normalizarActividades(datos) {

  if (
    !datos ||
    typeof datos !== "object" ||
    Array.isArray(datos)
  ) {
    return [];
  }

  return Object.entries(datos)
    .map(([nombre, cantidad]) => ({
      nombre:
        nombre === null ||
        nombre === undefined ||
        String(nombre).trim() === ""
          ? "Sin actividad"
          : String(nombre),

      cantidad:
        Number(cantidad) || 0,
    }))
    .filter(
      (actividad) =>
        actividad.cantidad > 0
    )
    .sort(
      (a, b) =>
        b.cantidad - a.cantidad
    );
}


// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function ExpedientesListado() {

  const [expedientes, setExpedientes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [mostrarFiltros, setMostrarFiltros] =
    useState(false);

  const [mostrarColumnas, setMostrarColumnas] =
    useState(false);


  // ==========================================================
  // FILTROS EDITABLES
  // ==========================================================

  const [filtroNif, setFiltroNif] =
    useState("");

  const [filtroActividad, setFiltroActividad] =
    useState("");

  const [filtroFechaInicio, setFiltroFechaInicio] =
    useState("");

  const [filtroFechaFin, setFiltroFechaFin] =
    useState("");

  const [filtroNotario, setFiltroNotario] =
    useState("");

  const [filtroOficina, setFiltroOficina] =
    useState("");

  const [filtroImporteMin, setFiltroImporteMin] =
    useState("");

  const [filtroImporteMax, setFiltroImporteMax] =
    useState("");


  // ==========================================================
  // FILTROS APLICADOS
  // ==========================================================

  const [filtrosAplicados, setFiltrosAplicados] =
    useState({
      nif: "",
      actividad: "",
      fechaInicio: "",
      fechaFin: "",
      notario: "",
      oficina: "",
      importeMin: "",
      importeMax: "",
    });


  // ==========================================================
  // PAGINACIÓN
  // ==========================================================

  const [pagina, setPagina] =
    useState(1);

  const [totalPaginas, setTotalPaginas] =
    useState(1);

  const porPagina = 20;


  // ==========================================================
  // ORDEN
  // ==========================================================

  const [ordenMultiple, setOrdenMultiple] =
    useState([]);


  // ==========================================================
  // COLUMNAS VISIBLES
  // ==========================================================

  const [columnasVisibles, setColumnasVisibles] =
    useState(
      COLUMNAS.map(
        (columna) => columna.key
      )
    );


  // ==========================================================
  // ACTIVIDADES
  // ==========================================================

  const [actividades, setActividades] =
    useState([]);


  // ==========================================================
  // CARGAR LISTADO
  // ==========================================================

  useEffect(() => {

    let activo = true;

    async function cargar() {

      setLoading(true);
      setError("");

      try {

        const res =
          await obtenerListadoExpedientes({

            pagina,

            porPagina,

            nif:
              filtrosAplicados.nif ||
              undefined,

            actividad:
              filtrosAplicados.actividad ||
              undefined,

            fechaInicio:
              filtrosAplicados.fechaInicio ||
              undefined,

            fechaFin:
              filtrosAplicados.fechaFin ||
              undefined,

            notario:
              filtrosAplicados.notario ||
              undefined,

            oficina:
              filtrosAplicados.oficina ||
              undefined,

            importeMin:
              filtrosAplicados.importeMin !== ""
                ? Number(
                    filtrosAplicados.importeMin
                  )
                : undefined,

            importeMax:
              filtrosAplicados.importeMax !== ""
                ? Number(
                    filtrosAplicados.importeMax
                  )
                : undefined,

            ordenMultiple:
              ordenMultiple.length > 0
                ? JSON.stringify(
                    ordenMultiple
                  )
                : undefined,
          });

        if (!activo) {
          return;
        }

        const items =
          Array.isArray(res?.items)
            ? res.items
            : [];

        setExpedientes(items);

        setTotalPaginas(
          Math.max(
            1,
            Number(
              res?.total_paginas || 1
            )
          )
        );

        /*
         * FALLBACK:
         *
         * Si todavía no tenemos actividades
         * calculadas por el backend, calculamos
         * las actividades de los expedientes
         * actualmente cargados.
         *
         * Cuando el backend devuelva:
         *
         * {
         *   actividades: {
         *     "Tramitación inscripción": 125,
         *     "Firma": 43
         *   }
         * }
         *
         * este valor será sustituido por los
         * totales reales.
         */

        if (
          res?.actividades &&
          typeof res.actividades === "object"
        ) {

          setActividades(
            normalizarActividades(
              res.actividades
            )
          );

        } else {

          const contador = {};

          items.forEach(
            (expediente) => {

              const actividad =
                expediente?.actividad_actual;

              const nombre =
                actividad === null ||
                actividad === undefined ||
                String(actividad).trim() === ""
                  ? "Sin actividad"
                  : String(actividad).trim();

              contador[nombre] =
                (contador[nombre] || 0) + 1;
            }
          );

          setActividades(
            normalizarActividades(
              contador
            )
          );
        }

      } catch (err) {

        console.error(
          "Error cargando expedientes:",
          err
        );

        if (activo) {

          setError(
            err?.response?.data?.detail ||
            "No se han podido cargar los expedientes."
          );

          setExpedientes([]);
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

  }, [
    pagina,
    filtrosAplicados,
    ordenMultiple,
  ]);


  // ==========================================================
  // CARGAR RESUMEN DE ACTIVIDADES
  // ==========================================================

  useEffect(() => {

    let activo = true;

    async function cargarResumen() {

      try {

        const res =
          await obtenerResumenExpedientes();

        if (!activo) {
          return;
        }

        /*
         * Si el endpoint de resumen ya devuelve
         * actividades, utilizamos esos datos.
         *
         * Ejemplo:
         *
         * {
         *   actividades: {
         *     "Tramitación inscripción": 125,
         *     "Firma": 43,
         *     "Pendiente documentación": 18
         *   }
         * }
         */

        if (
          res?.actividades &&
          typeof res.actividades === "object"
        ) {

          setActividades(
            normalizarActividades(
              res.actividades
            )
          );
        }

      } catch (err) {

        console.error(
          "Error cargando resumen de actividades:",
          err
        );
      }
    }

    cargarResumen();

    return () => {
      activo = false;
    };

  }, []);


  // ==========================================================
  // APLICAR FILTROS
  // ==========================================================

  const aplicarFiltros = () => {

    setFiltrosAplicados({

      nif:
        filtroNif.trim(),

      actividad:
        filtroActividad.trim(),

      fechaInicio:
        filtroFechaInicio,

      fechaFin:
        filtroFechaFin,

      notario:
        filtroNotario.trim(),

      oficina:
        filtroOficina.trim(),

      importeMin:
        filtroImporteMin,

      importeMax:
        filtroImporteMax,
    });

    setPagina(1);
    setError("");
  };


  // ==========================================================
  // LIMPIAR FILTROS
  // ==========================================================

  const limpiarFiltros = () => {

    setFiltroNif("");
    setFiltroActividad("");
    setFiltroFechaInicio("");
    setFiltroFechaFin("");
    setFiltroNotario("");
    setFiltroOficina("");
    setFiltroImporteMin("");
    setFiltroImporteMax("");

    setFiltrosAplicados({

      nif: "",
      actividad: "",
      fechaInicio: "",
      fechaFin: "",
      notario: "",
      oficina: "",
      importeMin: "",
      importeMax: "",
    });

    setPagina(1);
    setError("");
  };


  // ==========================================================
  // ORDENAR
  // ==========================================================

  const ordenar = (
    columna,
    shiftKey
  ) => {

    if (!shiftKey) {

      const actual =
        ordenMultiple[0];

      if (
        actual &&
        actual.columna === columna
      ) {

        setOrdenMultiple([
          {
            columna,
            direccion:
              actual.direccion === "asc"
                ? "desc"
                : "asc",
          },
        ]);

      } else {

        setOrdenMultiple([
          {
            columna,
            direccion: "asc",
          },
        ]);
      }

      setPagina(1);

      return;
    }


    const indice =
      ordenMultiple.findIndex(
        (orden) =>
          orden.columna === columna
      );


    if (indice !== -1) {

      setOrdenMultiple(
        (actual) =>
          actual.map(
            (orden, index) => {

              if (index !== indice) {
                return orden;
              }

              return {
                ...orden,

                direccion:
                  orden.direccion === "asc"
                    ? "desc"
                    : "asc",
              };
            }
          )
      );

    } else {

      setOrdenMultiple(
        (actual) => [
          ...actual,

          {
            columna,
            direccion: "asc",
          },
        ]
      );
    }

    setPagina(1);
  };


  // ==========================================================
  // ICONO ORDEN
  // ==========================================================

  const iconoOrden = (columna) => {

    const indice =
      ordenMultiple.findIndex(
        (orden) =>
          orden.columna === columna
      );

    if (indice === -1) {
      return "↕";
    }

    const orden =
      ordenMultiple[indice];

    const flecha =
      orden.direccion === "asc"
        ? "↑"
        : "↓";

    if (ordenMultiple.length > 1) {
      return `${flecha}${indice + 1}`;
    }

    return flecha;
  };


  // ==========================================================
  // EXPORTAR EXCEL
  // ==========================================================

  const exportarExcel = async () => {

    try {

      setError("");

      await exportarExcelExpedientes({

        nif:
          filtrosAplicados.nif ||
          undefined,

        actividad:
          filtrosAplicados.actividad ||
          undefined,

        fechaInicio:
          filtrosAplicados.fechaInicio ||
          undefined,

        fechaFin:
          filtrosAplicados.fechaFin ||
          undefined,

        notario:
          filtrosAplicados.notario ||
          undefined,

        oficina:
          filtrosAplicados.oficina ||
          undefined,

        importeMin:
          filtrosAplicados.importeMin !== ""
            ? Number(
                filtrosAplicados.importeMin
              )
            : undefined,

        importeMax:
          filtrosAplicados.importeMax !== ""
            ? Number(
                filtrosAplicados.importeMax
              )
            : undefined,
      });

    } catch (err) {

      console.error(
        "Error exportando Excel:",
        err
      );

      setError(
        err?.response?.data?.detail ||
        "No se ha podido exportar el Excel."
      );
    }
  };


  // ==========================================================
  // TOGGLE COLUMNA
  // ==========================================================

  const toggleColumna = (key) => {

    setColumnasVisibles(
      (actuales) => {

        if (actuales.includes(key)) {

          return actuales.filter(
            (item) => item !== key
          );
        }

        return [
          ...actuales,
          key,
        ];
      }
    );
  };


  // ==========================================================
  // COLUMNAS ACTIVAS
  // ==========================================================

  const columnasActivas =
    COLUMNAS.filter(
      (columna) =>
        columnasVisibles.includes(
          columna.key
        )
    );


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className="
        w-full
        max-w-[1800px]
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-6
        text-white
        space-y-6
        animate-fade-in
      "
    >

      {/* ================================================== */}
      {/* CABECERA */}
      {/* ================================================== */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
              drop-shadow
            "
          >
            Expedientes
          </h1>

          <p className="text-white/50 mt-1">
            Gestión y consulta de expedientes
          </p>

        </div>

        <button
          onClick={exportarExcel}
          disabled={loading}
          className="
            px-4
            py-2
            rounded-xl
            bg-green-600
            hover:bg-green-700
            text-white
            shadow-lg
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          Exportar Excel
        </button>

      </div>


      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {error && (

        <div
          className="
            bg-red-500/20
            border
            border-red-400/30
            rounded-xl
            p-4
            text-red-200
          "
        >
          {error}
        </div>

      )}


      {/* ================================================== */}
      {/* ACTIVIDADES DE EXPEDIENTES */}
      {/* ================================================== */}

      <section
        className="
          bg-white/10
          backdrop-blur-xl
          border
          border-white/10
          rounded-2xl
          p-4
          shadow-xl
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            mb-4
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-semibold
              "
            >
              Actividades de expedientes
            </h2>

            <p
              className="
                text-sm
                text-white/50
                mt-1
              "
            >
              Número de expedientes por actividad actual
            </p>

          </div>

        </div>


        {loading && actividades.length === 0 ? (

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-4
            "
          >

            {[1, 2, 3].map(
              (item) => (

                <div
                  key={item}
                  className="
                    bg-white/5
                    p-4
                    rounded-xl
                    border
                    border-white/10
                    animate-pulse
                    h-[92px]
                  "
                />

              )
            )}

          </div>

        ) : actividades.length === 0 ? (

          <div
            className="
              bg-white/5
              p-6
              rounded-xl
              border
              border-white/10
              text-center
              text-white/50
            "
          >
            No hay actividades para mostrar.
          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-4
            "
          >

            {actividades.map(
              (actividad) => (

                <ActividadCard
                  key={actividad.nombre}
                  nombre={actividad.nombre}
                  cantidad={actividad.cantidad}
                />

              )
            )}

          </div>

        )}

      </section>


      {/* ================================================== */}
      {/* FILTROS */}
      {/* ================================================== */}

      <section
        className="
          bg-white/10
          backdrop-blur-xl
          border
          border-white/10
          rounded-2xl
          p-4
          shadow-xl
        "
      >

        <button
          type="button"
          onClick={() =>
            setMostrarFiltros(
              (actual) => !actual
            )
          }
          className="
            w-full
            flex
            items-center
            justify-between
            text-xl
            font-semibold
            text-left
            hover:text-blue-300
            transition
          "
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

          <div
            className="
              mt-4
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-4
            "
          >

            <FiltroInput
              label="NIF titular"
              value={filtroNif}
              onChange={setFiltroNif}
            />

            <FiltroInput
              label="Actividad actual"
              value={filtroActividad}
              onChange={setFiltroActividad}
            />

            <FiltroInput
              label="NIF / nombre notario"
              value={filtroNotario}
              onChange={setFiltroNotario}
            />

            <FiltroInput
              label="Oficina"
              value={filtroOficina}
              onChange={setFiltroOficina}
            />

            <FiltroInput
              label="Fecha inicio"
              type="date"
              value={filtroFechaInicio}
              onChange={setFiltroFechaInicio}
            />

            <FiltroInput
              label="Fecha fin"
              type="date"
              value={filtroFechaFin}
              onChange={setFiltroFechaFin}
            />

            <FiltroInput
              label="Importe mínimo"
              type="number"
              value={filtroImporteMin}
              onChange={setFiltroImporteMin}
            />

            <FiltroInput
              label="Importe máximo"
              type="number"
              value={filtroImporteMax}
              onChange={setFiltroImporteMax}
            />

            <div
              className="
                flex
                items-end
                gap-3
              "
            >

              <button
                type="button"
                onClick={aplicarFiltros}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-700
                  transition
                "
              >
                Aplicar filtros
              </button>

              <button
                type="button"
                onClick={limpiarFiltros}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-white/10
                  border
                  border-white/20
                  hover:bg-white/20
                  transition
                "
              >
                Limpiar
              </button>

            </div>

          </div>

        )}

      </section>


      {/* ================================================== */}
      {/* COLUMNAS */}
      {/* ================================================== */}

      <section
        className="
          bg-white/10
          backdrop-blur-xl
          border
          border-white/10
          rounded-2xl
          p-4
          shadow-xl
        "
      >

        <button
          type="button"
          onClick={() =>
            setMostrarColumnas(
              (actual) => !actual
            )
          }
          className="
            w-full
            flex
            items-center
            justify-between
            text-xl
            font-semibold
            text-left
            hover:text-blue-300
            transition
          "
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

          <div
            className="
              mt-4
              grid
              grid-cols-2
              md:grid-cols-4
              lg:grid-cols-6
              gap-2
            "
          >

            {COLUMNAS.map(
              (columna) => (

                <label
                  key={columna.key}
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-white/70
                    cursor-pointer
                  "
                >

                  <input
                    type="checkbox"
                    checked={columnasVisibles.includes(
                      columna.key
                    )}
                    onChange={() =>
                      toggleColumna(
                        columna.key
                      )
                    }
                  />

                  <span>
                    {columna.label}
                  </span>

                </label>

              )
            )}

          </div>

        )}

      </section>


      {/* ================================================== */}
      {/* TABLA */}
      {/* ================================================== */}

      <section
        className="
          bg-white/10
          backdrop-blur-xl
          border
          border-white/10
          rounded-2xl
          shadow-xl
          overflow-hidden
          p-2
        "
      >

        {loading ? (

          <div
            className="
              text-white/70
              animate-pulse
              py-12
              text-center
            "
          >
            Cargando expedientes…
          </div>

        ) : expedientes.length === 0 ? (

          <div
            className="
              text-white/60
              py-12
              text-center
            "
          >
            No hay expedientes para mostrar.
          </div>

        ) : (

          <div
            className="
              overflow-auto
              rounded-xl
            "
          >

            <table
              className="
                min-w-max
                w-full
                text-sm
                text-white/80
                border-separate
                border-spacing-0
              "
            >

              <thead>

                <tr
                  className="
                    text-left
                  "
                >

                  {columnasActivas.map(
                    (columna) => (

                      <th
                        key={columna.key}
                        className="
                          px-3
                          py-3
                          cursor-pointer
                          select-none
                          whitespace-nowrap
                          hover:bg-[#607bc1]
                          sticky
                          top-0
                          bg-[#526db5]
                          z-20
                          border-b
                          border-white/20
                          font-semibold
                        "
                        onClick={(event) =>
                          ordenar(
                            columna.key,
                            event.shiftKey
                          )
                        }
                        title={
                          "Clic para ordenar. " +
                          "Shift + clic para añadir " +
                          "ordenación múltiple."
                        }
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <span>
                            {columna.label}
                          </span>

                          <span
                            className="
                              text-white/50
                              text-xs
                            "
                          >
                            {iconoOrden(
                              columna.key
                            )}
                          </span>

                        </div>

                      </th>

                    )
                  )}

                  <th
                    className="
                      px-3
                      py-3
                      whitespace-nowrap
                      sticky
                      top-0
                      bg-[#526db5]
                      z-20
                      border-b
                      border-white/20
                      font-semibold
                    "
                  >
                    Acciones
                  </th>

                </tr>

              </thead>


              <tbody>

                {expedientes.map(
                  (expediente) => (

                    <tr
                      key={
                        expediente.id_expediente ||
                        expediente.id
                      }
                      className="
                        border-t
                        border-white/10
                        hover:bg-white/10
                        transition
                      "
                    >

                      {columnasActivas.map(
                        (columna) => (

                          <td
                            key={columna.key}
                            className="
                              px-3
                              py-2
                              whitespace-nowrap
                              max-w-[400px]
                              overflow-hidden
                              text-ellipsis
                              border-b
                              border-white/10
                            "
                            title={
                              expediente[
                                columna.key
                              ] ?? ""
                            }
                          >

                            {formatearValor(
                              expediente[
                                columna.key
                              ],
                              columna.tipo
                            )}

                          </td>

                        )
                      )}

                      <td
                        className="
                          px-3
                          py-2
                          whitespace-nowrap
                          border-b
                          border-white/10
                        "
                      >

                        <Link
                          to={
                            `/expedientes/${encodeURIComponent(
                              expediente.id_expediente
                            )}`
                          }
                          className="
                            text-blue-300
                            hover:text-blue-200
                            underline
                          "
                        >
                          Ver ficha
                        </Link>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* ================================================== */}
      {/* PAGINACIÓN */}
      {/* ================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          items-center
          justify-center
          gap-4
          pb-4
        "
      >

        <button
          disabled={
            pagina <= 1 ||
            loading
          }
          onClick={() =>
            setPagina(
              (actual) =>
                Math.max(
                  1,
                  actual - 1
                )
            )
          }
          className="
            px-4
            py-2
            rounded-xl
            bg-white/10
            border
            border-white/20
            hover:bg-white/20
            transition
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        >
          Anterior
        </button>


        <span className="text-white/70">
          Página {pagina} de {totalPaginas}
        </span>


        <button
          disabled={
            pagina >= totalPaginas ||
            loading
          }
          onClick={() =>
            setPagina(
              (actual) =>
                Math.min(
                  totalPaginas,
                  actual + 1
                )
            )
          }
          className="
            px-4
            py-2
            rounded-xl
            bg-white/10
            border
            border-white/20
            hover:bg-white/20
            transition
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        >
          Siguiente
        </button>

      </div>

    </div>
  );
}


// ============================================================
// TARJETA DE ACTIVIDAD
// ============================================================

function ActividadCard({
  nombre,
  cantidad,
}) {

  return (

    <div
      className="
        bg-white/5
        p-4
        rounded-xl
        border
        border-white/10
        hover:bg-white/10
        hover:border-white/20
        transition
        min-h-[92px]
        flex
        flex-col
        justify-between
      "
    >

      <p
        className="
          text-white/60
          text-sm
          leading-5
          break-words
        "
      >
        {nombre}
      </p>

      <p
        className="
          text-white
          font-semibold
          text-2xl
          mt-2
        "
      >
        {cantidad}
      </p>

    </div>
  );
}


// ============================================================
// INPUT FILTRO
// ============================================================

function FiltroInput({
  label,
  value,
  onChange,
  type = "text",
}) {

  return (

    <div>

      <label
        className="
          text-sm
          text-white/70
        "
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          w-full
          mt-1
          px-3
          py-2
          rounded-xl
          bg-white/10
          border
          border-white/20
          text-white
          outline-none
          focus:border-blue-400
          focus:ring-1
          focus:ring-blue-400/40
        "
      />

    </div>
  );
}
