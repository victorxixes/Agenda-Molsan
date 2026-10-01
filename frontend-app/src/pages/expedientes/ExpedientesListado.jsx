import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  obtenerListadoExpedientes,
  exportarExcelExpedientes,
  obtenerResumenExpedientes,
} from "../../api/expedientes";


// ============================================================
// COLUMNAS DEL EXCEL / EXPEDIENTE
// ============================================================

const COLUMNAS = [

  // ==========================================================
  // IDENTIFICACIÓN
  // ==========================================================

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

  // ==========================================================
  // FECHAS
  // ==========================================================

  {
    key: "fecha_alta",
    label: "Fecha Alta",
    tipo: "fecha",
  },

  {
    key: "fecha_firma",
    label: "Fecha Firma",
    tipo: "fecha",
  },

  {
    key: "fecha_inscripcion",
    label: "Fecha Inscripción",
    tipo: "fecha",
  },

  {
    key: "fecha_entregado_cliente",
    label: "Fecha Entregado Cliente",
    tipo: "fecha",
  },

  {
    key: "fecha_prevista_firma",
    label: "Fecha Prevista Firma",
    tipo: "fecha",
  },

  {
    key: "fecha_vencimiento",
    label: "Fecha Vencimiento",
    tipo: "fecha",
  },

  {
    key: "fecha_sol_cgn",
    label: "Fecha Solicitud CGN",
    tipo: "fecha",
  },

  {
    key: "fecha_firma_prev_val",
    label: "Fecha Firma Prev. Validación",
    tipo: "fecha",
  },

  {
    key: "fecha_firma_prev_cli",
    label: "Fecha Firma Prev. Cliente",
    tipo: "fecha",
  },

  {
    key: "fecha_inicio_actividad",
    label: "Inicio Actividad",
    tipo: "fecha",
  },

  {
    key: "fecha_fin_actividad",
    label: "Fin Actividad",
    tipo: "fecha",
  },

  // ==========================================================
  // ESTADOS
  // ==========================================================

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

  // ==========================================================
  // ACTIVIDAD
  // ==========================================================

  {
    key: "actividad_actual",
    label: "Actividad actual",
    tipo: "texto",
  },

  // ==========================================================
  // TITULAR
  // ==========================================================

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

  // ==========================================================
  // NOTARIO
  // ==========================================================

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

  // ==========================================================
  // OFICINA
  // ==========================================================

  {
    key: "oficina",
    label: "Oficina",
    tipo: "texto",
  },

  {
    key: "oficina_alta",
    label: "Oficina Alta",
    tipo: "texto",
  },

  {
    key: "dan",
    label: "DAN",
    tipo: "texto",
  },

  // ==========================================================
  // ECONÓMICOS
  // ==========================================================

  {
    key: "importe",
    label: "Importe",
    tipo: "numero",
  },

  {
    key: "capital",
    label: "Capital",
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

  // ==========================================================
  // OPERACIÓN
  // ==========================================================

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
    key: "contrato",
    label: "Contrato",
    tipo: "texto",
  },

  {
    key: "num_solicitud_sia",
    label: "Nº Solicitud SIA",
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

  // ==========================================================
  // GTG / BANKIA
  // ==========================================================

  {
    key: "producto_gtg",
    label: "Producto GTG",
    tipo: "texto",
  },

  {
    key: "origen_bankia",
    label: "Origen Bankia",
    tipo: "texto",
  },

  {
    key: "dt",
    label: "DT",
    tipo: "texto",
  },

  // ==========================================================
  // GESTORÍA
  // ==========================================================

  {
    key: "gestoria",
    label: "Gestoría",
    tipo: "texto",
  },

  // ==========================================================
  // CGN
  // ==========================================================

  {
    key: "id_expediente_cgn",
    label: "ID Expediente CGN",
    tipo: "texto",
  },

  // ==========================================================
  // OTROS
  // ==========================================================

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

  // ==========================================================
  // OBSERVACIONES
  // ==========================================================

  {
    key: "observaciones",
    label: "Observaciones",
    tipo: "texto",
  },

  // ==========================================================
  // FACTURACIÓN
  // ==========================================================

  {
    key: "facturacion_fecha",
    label: "Fecha facturación",
    tipo: "fecha",
  },

  // ==========================================================
  // REGISTRAL
  // ==========================================================

  {
    key: "registral_fecha",
    label: "Fecha registral",
    tipo: "fecha",
  },

  // ==========================================================
  // RELACIONES
  // ==========================================================

  {
    key: "cliente_id",
    label: "ID Cliente",
    tipo: "numero",
  },
];


// ============================================================
// FORMATEAR VALOR
// ============================================================

function formatearValor(valor, tipo) {

  if (valor === null || valor === undefined || valor === "") {
    return "—";
  }

  if (tipo === "fecha") {

    if (typeof valor === "string" && valor.includes("-")) {
      return valor;
    }

    return String(valor);
  }

  if (tipo === "numero") {

    if (typeof valor === "number") {
      return new Intl.NumberFormat("es-ES", {
        maximumFractionDigits: 2,
      }).format(valor);
    }

    return valor;
  }

  return valor;
}


// ============================================================
// COMPONENTE
// ============================================================

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
  // ORDEN
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


  // ==========================================================
  // CARGAR EXPEDIENTES
  // ==========================================================

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

        ordenMultiple:
          ordenMultiple.length
            ? JSON.stringify(ordenMultiple)
            : undefined,
      });


      setExpedientes(res.items || []);

      setTotalPaginas(res.total_paginas || 1);

    } catch (err) {

      console.error(
        "Error cargando expedientes:",
        err
      );

      setError(
        "No se han podido cargar los expedientes."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================================
  // CARGAR RESUMEN
  // ==========================================================

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


  // ==========================================================
  // EFECTO
  // ==========================================================

  useEffect(() => {

    cargar();

  }, [pagina, ordenMultiple]);


  useEffect(() => {

    cargarResumen();

  }, []);


  // ==========================================================
  // FILTROS
  // ==========================================================

  const aplicarFiltros = () => {

    setPagina(1);

    cargar();

  };


  // ==========================================================
  // ORDENACIÓN
  // ==========================================================

  const ordenar = (columna, shiftKey) => {

    // --------------------------------------------------------
    // ORDEN NORMAL
    // --------------------------------------------------------

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

      return;
    }


    // --------------------------------------------------------
    // ORDEN MÚLTIPLE
    // Shift + clic
    // --------------------------------------------------------

    const existe =
      ordenMultiple.find(
        (o) =>
          o.columna === columna
      );


    if (existe) {

      setOrdenMultiple(

        ordenMultiple.map((o) =>

          o.columna === columna

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
          columna,

          direccion: "asc",
        },

      ]);

    }

  };


  // ==========================================================
  // ICONO ORDEN
  // ==========================================================

  const iconoOrden = (columna) => {

    const indice =
      ordenMultiple.findIndex(
        (x) =>
          x.columna === columna
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

      await exportarExcelExpedientes({

        nif:
          filtroNif || undefined,

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

    }
  };


  // ==========================================================
  // RENDER
  // ==========================================================

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

        <div className="
          bg-red-500/20
          border
          border-red-400/30
          rounded-xl
          p-4
          text-red-200
        ">

          {error}

        </div>

      )}


      {/* ======================================================
          RESUMEN
      ====================================================== */}

      <section className="
        bg-white/10
        backdrop-blur-xl
        border
        border-white/10
        rounded-2xl
        p-4
        shadow-xl
      ">

        <h2 className="
          text-xl
          font-semibold
          mb-4
        ">

          Estado de expedientes

        </h2>


        <div className="
          grid
          grid-cols-3
          gap-4
          text-sm
          text-white/80
        ">


          <div className="
            bg-white/5
            p-3
            rounded-xl
            border
            border-white/10
          ">

            <p className="text-white/60">
              Pendientes
            </p>

            <p className="
              text-white
              font-semibold
              text-lg
            ">

              {resumen.pendientes}

            </p>

          </div>


          <div className="
            bg-white/5
            p-3
            rounded-xl
            border
            border-white/10
          ">

            <p className="text-white/60">
              En curso
            </p>

            <p className="
              text-white
              font-semibold
              text-lg
            ">

              {resumen.enCurso}

            </p>

          </div>


          <div className="
            bg-white/5
            p-3
            rounded-xl
            border
            border-white/10
          ">

            <p className="text-white/60">
              Finalizados
            </p>

            <p className="
              text-white
              font-semibold
              text-lg
            ">

              {resumen.finalizados}

            </p>

          </div>

        </div>

      </section>


      {/* ======================================================
          FILTROS
      ====================================================== */}

      <section className="
        bg-white/10
        backdrop-blur-xl
        border
        border-white/10
        rounded-2xl
        p-4
        shadow-xl
      ">


        <button
          onClick={() =>
            setMostrarFiltros(
              !mostrarFiltros
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

          <div className="mt-4">

            <div className="
              grid
              grid-cols-3
              gap-4
            ">


              {/* NIF */}

              <div>

                <label className="
                  text-sm
                  text-white/70
                ">

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
                  "
                />

              </div>


              {/* ACTIVIDAD */}

              <div>

                <label className="
                  text-sm
                  text-white/70
                ">

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
                  "
                />

              </div>


              {/* FECHA INICIO */}

              <div>

                <label className="
                  text-sm
                  text-white/70
                ">

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
                  "
                />

              </div>


              {/* FECHA FIN */}

              <div>

                <label className="
                  text-sm
                  text-white/70
                ">

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
                  "
                />

              </div>


              {/* NOTARIO */}

              <div>

                <label className="
                  text-sm
                  text-white/70
                ">

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
                  "
                />

              </div>


              {/* OFICINA */}

              <div>

                <label className="
                  text-sm
                  text-white/70
                ">

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
                  "
                />

              </div>


              {/* IMPORTE MIN */}

              <div>

                <label className="
                  text-sm
                  text-white/70
                ">

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
                  "
                />

              </div>


              {/* IMPORTE MAX */}

              <div>

                <label className="
                  text-sm
                  text-white/70
                ">

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
                  "
                />

              </div>


              {/* BOTONES */}

              <div className="
                flex
                items-end
                gap-3
              ">

                <button
                  onClick={aplicarFiltros}
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    shadow-lg
                    transition
                  "
                >

                  Aplicar filtros

                </button>


                <button
                  onClick={exportarExcel}
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    shadow-lg
                    transition
                  "
                >

                  Exportar Excel

                </button>

              </div>

            </div>

          </div>

        )}

      </section>


      {/* ======================================================
          COLUMNAS
      ====================================================== */}

      <section className="
        bg-white/10
        backdrop-blur-xl
        border
        border-white/10
        rounded-2xl
        p-4
        shadow-xl
      ">


        <button
          onClick={() =>
            setMostrarColumnas(
              !mostrarColumnas
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

          <div className="mt-4">

            <div className="
              grid
              grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              gap-2
            ">

              {COLUMNAS.map((columna) => (

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
                    onChange={(e) => {

                      if (
                        e.target.checked
                      ) {

                        setColumnasVisibles([
                          ...columnasVisibles,
                          columna.key,
                        ]);

                      } else {

                        setColumnasVisibles(
                          columnasVisibles.filter(
                            (x) =>
                              x !==
                              columna.key
                          )
                        );

                      }

                    }}
                  />

                  {columna.label}

                </label>

              ))}

            </div>

          </div>

        )}

      </section>


      {/* ======================================================
          TABLA
      ====================================================== */}

      <section className="
        bg-white/10
        backdrop-blur-xl
        border
        border-white/10
        rounded-2xl
        p-4
        shadow-xl
        overflow-auto
      ">


        {loading ? (

          <div className="
            text-white/70
            animate-pulse
            py-8
            text-center
          ">

            Cargando expedientes…

          </div>

        ) : expedientes.length === 0 ? (

          <div className="
            text-white/60
            py-8
            text-center
          ">

            No hay expedientes para mostrar.

          </div>

        ) : (

          <table className="
            min-w-max
            w-full
            text-sm
            text-white/80
          ">


            {/* =================================================
                CABECERA
            ================================================= */}

            <thead>

              <tr className="
                text-left
                bg-white/5
                sticky
                top-0
                z-10
              ">


                {COLUMNAS

                  .filter((c) =>
                    columnasVisibles.includes(
                      c.key
                    )
                  )

                  .map((c) => (

                    <th
                      key={c.key}
                      className="
                        px-3
                        py-3
                        cursor-pointer
                        select-none
                        whitespace-nowrap
                        hover:bg-white/10
                      "
                      onClick={(e) =>
                        ordenar(
                          c.key,
                          e.shiftKey
                        )
                      }
                      title="
                        Clic para ordenar.
                        Shift + clic para
                        añadir orden.
                      "
                    >

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <span>
                          {c.label}
                        </span>

                        <span className="
                          text-white/40
                          text-xs
                        ">

                          {iconoOrden(
                            c.key
                          )}

                        </span>

                      </div>

                    </th>

                  ))}


                <th className="
                  px-3
                  py-3
                  whitespace-nowrap
                ">

                  Acciones

                </th>

              </tr>

            </thead>


            {/* =================================================
                CUERPO
            ================================================= */}

            <tbody>

              {expedientes.map(
                (exp) => (

                  <tr
                    key={
                      exp.id_expediente ||
                      exp.id
                    }
                    className="
                      border-t
                      border-white/10
                      hover:bg-white/5
                    "
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
                          className="
                            px-3
                            py-2
                            whitespace-nowrap
                          "
                        >

                          {formatearValor(
                            exp[c.key],
                            c.tipo
                          )}

                        </td>

                      ))}


                    <td className="
                      px-3
                      py-2
                      whitespace-nowrap
                    ">

                      <Link
                        to={`/expedientes/${
                          exp.id_expediente
                        }`}
                        className="
                          text-blue-400
                          hover:text-blue-300
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

        )}

      </section>


      {/* ======================================================
          PAGINACIÓN
      ====================================================== */}

      <div className="
        flex
        items-center
        justify-center
        gap-4
      ">


        <button
          disabled={pagina <= 1}
          onClick={() =>
            setPagina(
              pagina - 1
            )
          }
          className="
            px-3
            py-2
            rounded-xl
            bg-white/10
            border
            border-white/20
            hover:bg-white/20
            transition
            disabled:opacity-40
          "
        >

          Anterior

        </button>


        <span className="
          text-white/70
        ">

          Página {pagina} de {totalPaginas}

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
          className="
            px-3
            py-2
            rounded-xl
            bg-white/10
            border
            border-white/20
            hover:bg-white/20
            transition
            disabled:opacity-40
          "
        >

          Siguiente

        </button>


      </div>


    </div>

  );

}
