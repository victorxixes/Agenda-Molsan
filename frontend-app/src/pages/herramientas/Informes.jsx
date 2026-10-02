import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../api/config";
import Chart from "chart.js/auto";
import SelectSJ from "../../components/ui/SelectSJ";

const MESES = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

export default function Informes() {
  const hoy = new Date();

  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [año, setAño] = useState(hoy.getFullYear());

  const [tabla, setTabla] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");

  const [orden, setOrden] = useState({
    campo: "nombre",
    asc: true,
  });

  useEffect(() => {
    cargarTabla();
  }, [mes, año]);

  useEffect(() => {
    renderGraficos();

    return () => {
      destruirGraficos();
    };
  }, [tabla]);

  // ============================================================
  // CARGAR DATOS
  // ============================================================

  const cargarTabla = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/informes/apoderados/tabla`,
        {
          params: {
            mes,
            año,
          },
        }
      );

      const lista = (res.data || []).map((t) => ({
        ...t,
        km: t.km ?? t.distancia_km ?? 0,
      }));

      setTabla(lista);
    } catch (err) {
      console.error("Error cargando informe:", err);
      setTabla([]);
    }
  };

  // ============================================================
  // ORDENACIÓN
  // ============================================================

  const ordenar = (campo) => {
    const asc =
      orden.campo === campo
        ? !orden.asc
        : true;

    setOrden({
      campo,
      asc,
    });

    const ordenada = [...tabla].sort((a, b) => {
      if (a[campo] < b[campo]) {
        return asc ? -1 : 1;
      }

      if (a[campo] > b[campo]) {
        return asc ? 1 : -1;
      }

      return 0;
    });

    setTabla(ordenada);
  };

  // ============================================================
  // EXPORTAR EXCEL / CSV
  // ============================================================

  const exportarExcel = () => {
    const encabezados = [
      "Apoderado",
      "VC",
      "Presencial",
      "Km",
    ];

    const filas = tabla.map((t) => [
      t.nombre,
      t.vc,
      t.presencial,
      t.km?.toFixed(2) || "0.00",
    ]);

    let contenido =
      encabezados.join(",") + "\n";

    contenido += filas
      .map((f) => f.join(","))
      .join("\n");

    const blob = new Blob(
      [contenido],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      `informe_${mes}_${año}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  };

  // ============================================================
  // EXPORTAR PDF
  // ============================================================

  const exportarPDF = () => {
    const ventana =
      window.open("", "_blank");

    if (!ventana) return;

    const totalVC =
      tabla.reduce(
        (acc, t) =>
          acc + (t.vc || 0),
        0
      );

    const totalPres =
      tabla.reduce(
        (acc, t) =>
          acc + (t.presencial || 0),
        0
      );

    const totalKm =
      tabla.reduce(
        (acc, t) =>
          acc + (t.km || 0),
        0
      );

    const filas = tabla
      .map(
        (t) => `
          <tr>
            <td>${t.nombre}</td>
            <td>${t.vc}</td>
            <td>${t.presencial}</td>
            <td>${t.km ? t.km.toFixed(2) : "0.00"}</td>
          </tr>
        `
      )
      .join("");

    ventana.document.write(`
      <html>
        <head>
          <title>Informe ${mes}/${año}</title>

          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              padding: 40px;
              background: #f7f9fc;
              color: #1a1a1a;
            }

            .logo {
              width: 140px;
              margin-bottom: 20px;
            }

            h1 {
              font-size: 26px;
              margin-bottom: 5px;
              color: #0d1b2a;
            }

            h2 {
              font-size: 18px;
              margin-top: 0;
              color: #415a77;
            }

            .card {
              background: white;
              padding: 25px;
              border-radius: 12px;
              box-shadow:
                0 4px 20px rgba(0,0,0,0.08);
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 25px;
              font-size: 14px;
            }

            th {
              background: #e9eef5;
              padding: 10px;
              border-bottom:
                2px solid #cbd5e1;
              text-align: left;
              color: #0d1b2a;
            }

            td {
              padding: 8px;
              border-bottom:
                1px solid #e2e8f0;
            }

            tr:nth-child(even) {
              background: #f8fafc;
            }

            .totales {
              margin-top: 30px;
              font-size: 15px;
              font-weight: 600;
              color: #0d1b2a;
            }

            .totales span {
              display: block;
              margin-bottom: 6px;
            }
          </style>
        </head>

        <body>

          <img
            class="logo"
            src="/logo-sj2026.png"
          />

          <div class="card">

            <h1>
              Informe de Apoderados
            </h1>

            <h2>
              ${mes}/${año}
            </h2>

            <table>

              <thead>
                <tr>
                  <th>Apoderado</th>
                  <th>VC</th>
                  <th>Presencial</th>
                  <th>Km</th>
                </tr>
              </thead>

              <tbody>
                ${filas}
              </tbody>

            </table>

            <div class="totales">

              <span>
                Total VC: ${totalVC}
              </span>

              <span>
                Total Presencial: ${totalPres}
              </span>

              <span>
                Total Km: ${totalKm.toFixed(2)}
              </span>

            </div>

          </div>

        </body>
      </html>
    `);

    ventana.document.close();
    ventana.print();
  };

  // ============================================================
  // GRÁFICOS
  // ============================================================

  const destruirGraficos = () => {
    [
      "graficoVC",
      "graficoP",
      "graficoKm",
    ].forEach((id) => {
      const chart =
        Chart.getChart(id);

      if (chart) {
        chart.destroy();
      }
    });
  };

  const renderGraficos = () => {
    destruirGraficos();

    const ctx1 =
      document.getElementById(
        "graficoVC"
      );

    const ctx2 =
      document.getElementById(
        "graficoP"
      );

    const ctx3 =
      document.getElementById(
        "graficoKm"
      );

    if (
      !ctx1 ||
      !ctx2 ||
      !ctx3
    ) {
      return;
    }

    // ----------------------------------------------------------
    // VC
    // ----------------------------------------------------------

    new Chart(ctx1, {
      type: "bar",

      data: {
        labels: tabla.map(
          (t) => t.nombre
        ),

        datasets: [
          {
            label: "VC",

            data: tabla.map(
              (t) => t.vc
            ),

            backgroundColor:
              "rgba(96, 165, 250, 0.75)",

            borderColor:
              "rgba(147, 197, 253, 1)",

            borderWidth: 1,

            borderRadius: 8,

            maxBarThickness: 42,
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
          legend: {
            labels: {
              color: "#ffffff",
            },
          },
        },

        scales: {
          x: {
            ticks: {
              color:
                "rgba(255,255,255,0.65)",
            },

            grid: {
              color:
                "rgba(255,255,255,0.06)",
            },
          },

          y: {
            beginAtZero: true,

            ticks: {
              color:
                "rgba(255,255,255,0.65)",
            },

            grid: {
              color:
                "rgba(255,255,255,0.06)",
            },
          },
        },
      },
    });

    // ----------------------------------------------------------
    // PRESENCIAL
    // ----------------------------------------------------------

    new Chart(ctx2, {
      type: "bar",

      data: {
        labels: tabla.map(
          (t) => t.nombre
        ),

        datasets: [
          {
            label: "Presencial",

            data: tabla.map(
              (t) => t.presencial
            ),

            backgroundColor:
              "rgba(52, 211, 153, 0.75)",

            borderColor:
              "rgba(110, 231, 183, 1)",

            borderWidth: 1,

            borderRadius: 8,

            maxBarThickness: 42,
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
          legend: {
            labels: {
              color: "#ffffff",
            },
          },
        },

        scales: {
          x: {
            ticks: {
              color:
                "rgba(255,255,255,0.65)",
            },

            grid: {
              color:
                "rgba(255,255,255,0.06)",
            },
          },

          y: {
            beginAtZero: true,

            ticks: {
              color:
                "rgba(255,255,255,0.65)",
            },

            grid: {
              color:
                "rgba(255,255,255,0.06)",
            },
          },
        },
      },
    });

    // ----------------------------------------------------------
    // KM
    // ----------------------------------------------------------

    new Chart(ctx3, {
      type: "line",

      data: {
        labels: tabla.map(
          (t) => t.nombre
        ),

        datasets: [
          {
            label: "Km",

            data: tabla.map(
              (t) => t.km || 0
            ),

            borderColor:
              "#f87171",

            backgroundColor:
              "rgba(248,113,113,0.15)",

            borderWidth: 3,

            tension: 0.35,

            fill: true,

            pointRadius: 4,

            pointHoverRadius: 6,
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
          legend: {
            labels: {
              color: "#ffffff",
            },
          },
        },

        scales: {
          x: {
            ticks: {
              color:
                "rgba(255,255,255,0.65)",
            },

            grid: {
              color:
                "rgba(255,255,255,0.06)",
            },
          },

          y: {
            beginAtZero: true,

            ticks: {
              color:
                "rgba(255,255,255,0.65)",
            },

            grid: {
              color:
                "rgba(255,255,255,0.06)",
            },
          },
        },
      },
    });
  };

  // ============================================================
  // FILTRO
  // ============================================================

  const filtrada = tabla.filter((t) =>
    String(t.nombre || "")
      .toLowerCase()
      .includes(
        filtroNombre.toLowerCase()
      )
  );

  // ============================================================
  // TOTALES
  // ============================================================

  const totalVC =
    tabla.reduce(
      (acc, t) =>
        acc + (t.vc || 0),
      0
    );

  const totalPresencial =
    tabla.reduce(
      (acc, t) =>
        acc + (t.presencial || 0),
      0
    );

  const totalKm =
    tabla.reduce(
      (acc, t) =>
        acc + (t.km || 0),
      0
    );

  const mediaCitas =
    tabla.length > 0
      ? (totalVC + totalPresencial) /
        tabla.length
      : 0;

  const mediaKm =
    tabla.length > 0
      ? totalKm / tabla.length
      : 0;

  const mesActual =
    MESES.find(
      (m) => m.value === mes
    )?.label || "";

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      {/* ======================================================
          CABECERA
      ====================================================== */}

      <div
        className="
          relative overflow-hidden
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          rounded-2xl
          p-6
          shadow-xl
        "
      >

        <div
          className="
            absolute
            -top-20
            -right-20
            w-48
            h-48
            bg-blue-500/10
            rounded-full
            blur-3xl
            pointer-events-none
          "
        />

        <div
          className="
            absolute
            -bottom-20
            -left-20
            w-48
            h-48
            bg-purple-500/10
            rounded-full
            blur-3xl
            pointer-events-none
          "
        />

        <div className="relative">

          <div className="flex items-center gap-3">

            <div
              className="
                w-11 h-11
                rounded-xl
                bg-blue-500/20
                border border-blue-400/30
                flex items-center justify-center
                shadow-lg
              "
            >
              📊
            </div>

            <div>

              <h1
                className="
                  text-3xl
                  font-bold
                  text-white
                  drop-shadow
                "
              >
                Informes de Apoderados
              </h1>

              <p
                className="
                  text-white/60
                  text-sm
                  mt-1
                "
              >
                Estadísticas de actividad,
                presencialidad y desplazamientos.
              </p>

            </div>

          </div>

          <div
            className="
              mt-4
              inline-flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-full
              bg-white/5
              border border-white/10
              text-white/70
              text-xs
            "
          >
            <span
              className="
                w-2
                h-2
                rounded-full
                bg-blue-400
              "
            />

            Periodo:
            <strong className="text-white">
              {mesActual} {año}
            </strong>
          </div>

        </div>
      </div>


      {/* ======================================================
          FILTROS
      ====================================================== */}

      <div
        className="
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          rounded-2xl
          p-6
          shadow-xl
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            mb-5
          "
        >

          <span
            className="
              text-blue-300
              text-lg
            "
          >
            ⚙
          </span>

          <div>

            <h2
              className="
                text-lg
                font-semibold
                text-white
              "
            >
              Filtros del informe
            </h2>

            <p
              className="
                text-xs
                text-white/50
              "
            >
              Selecciona el periodo y filtra los resultados.
            </p>

          </div>

        </div>


        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-12
            gap-5
            items-end
          "
        >

          {/* MES */}

          <div
            className="
              md:col-span-3
              flex
              flex-col
            "
          >

            <label
              className="
                text-white/70
                text-xs
                font-medium
                uppercase
                tracking-wide
                mb-2
              "
            >
              Mes
            </label>

            <SelectSJ
              value={mes}
              onChange={(v) =>
                setMes(Number(v))
              }
              options={MESES}
              placeholder="Mes"
            />

          </div>


          {/* AÑO */}

          <div
            className="
              md:col-span-2
              flex
              flex-col
            "
          >

            <label
              className="
                text-white/70
                text-xs
                font-medium
                uppercase
                tracking-wide
                mb-2
              "
            >
              Año
            </label>

            <input
              type="number"
              className="
                w-full
                bg-white/10
                border border-white/20
                rounded-xl
                px-3
                py-2.5
                text-white
                outline-none
                transition
                focus:border-blue-400/60
                focus:ring-2
                focus:ring-blue-400/20
                hover:bg-white/15
              "
              value={año}
              onChange={(e) =>
                setAño(
                  Number(
                    e.target.value
                  )
                )
              }
            />

          </div>


          {/* BUSCADOR */}

          <div
            className="
              md:col-span-7
              flex
              flex-col
            "
          >

            <label
              className="
                text-white/70
                text-xs
                font-medium
                uppercase
                tracking-wide
                mb-2
              "
            >
              Buscar apoderado
            </label>

            <div className="relative">

              <span
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-white/40
                "
              >
                🔎
              </span>

              <input
                type="text"
                className="
                  w-full
                  bg-white/10
                  border border-white/20
                  rounded-xl
                  pl-10
                  pr-4
                  py-2.5
                  text-white
                  placeholder-white/35
                  outline-none
                  transition
                  focus:border-blue-400/60
                  focus:ring-2
                  focus:ring-blue-400/20
                  hover:bg-white/15
                "
                placeholder="Buscar por nombre..."
                value={filtroNombre}
                onChange={(e) =>
                  setFiltroNombre(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </div>

      </div>


      {/* ======================================================
          KPIs
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-5
          gap-4
        "
      >

        <KpiCard
          icon="💻"
          titulo="Total VC"
          valor={totalVC}
          subtitulo="Videoconferencias"
          clase="blue"
        />

        <KpiCard
          icon="👤"
          titulo="Total Presencial"
          valor={totalPresencial}
          subtitulo="Citas presenciales"
          clase="green"
        />

        <KpiCard
          icon="🚗"
          titulo="Km Totales"
          valor={totalKm.toFixed(1)}
          subtitulo="Kilómetros"
          clase="red"
        />

        <KpiCard
          icon="📈"
          titulo="Media Citas"
          valor={mediaCitas.toFixed(1)}
          subtitulo="Por apoderado"
          clase="purple"
        />

        <KpiCard
          icon="📍"
          titulo="Media Km"
          valor={mediaKm.toFixed(1)}
          subtitulo="Por apoderado"
          clase="orange"
        />

      </div>


      {/* ======================================================
          EXPORTACIONES
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-4
          bg-white/5
          border border-white/10
          rounded-2xl
          p-4
        "
      >

        <div>

          <div
            className="
              text-white
              font-semibold
              text-sm
            "
          >
            Exportar informe
          </div>

          <div
            className="
              text-white/45
              text-xs
              mt-1
            "
          >
            Descarga los datos del periodo seleccionado.
          </div>

        </div>

        <div
          className="
            flex
            gap-3
            flex-wrap
          "
        >

          <button
            onClick={exportarExcel}
            className="
              px-4
              py-2.5
              rounded-xl
              bg-green-600/80
              hover:bg-green-500
              border border-green-400/30
              text-white
              text-sm
              font-medium
              shadow-lg
              transition
              active:scale-[0.97]
              flex
              items-center
              gap-2
            "
          >
            <span>📗</span>
            Exportar Excel
          </button>

          <button
            onClick={exportarPDF}
            className="
              px-4
              py-2.5
              rounded-xl
              bg-red-600/80
              hover:bg-red-500
              border border-red-400/30
              text-white
              text-sm
              font-medium
              shadow-lg
              transition
              active:scale-[0.97]
              flex
              items-center
              gap-2
            "
          >
            <span>📄</span>
            Exportar PDF
          </button>

        </div>

      </div>


      {/* ======================================================
          TABLA
      ====================================================== */}

      <div
        className="
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          rounded-2xl
          shadow-xl
          overflow-hidden
        "
      >

        <div
          className="
            px-6
            py-4
            border-b border-white/10
            flex
            items-center
            justify-between
            gap-4
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-semibold
                text-white
              "
            >
              Detalle por apoderado
            </h2>

            <p
              className="
                text-xs
                text-white/50
                mt-1
              "
            >
              {filtrada.length} registros encontrados
            </p>

          </div>

          <div
            className="
              px-3
              py-1.5
              rounded-lg
              bg-white/5
              border border-white/10
              text-xs
              text-white/60
            "
          >
            {mesActual} {año}
          </div>

        </div>


        <div className="overflow-x-auto">

          <table
            className="
              w-full
              text-white
              text-sm
            "
          >

            <thead
              className="
                bg-white/10
                border-b border-white/15
              "
            >

              <tr>

                <ThOrden
                  titulo="Apoderado"
                  campo="nombre"
                  orden={orden}
                  ordenar={ordenar}
                  align="left"
                />

                <ThOrden
                  titulo="VC"
                  campo="vc"
                  orden={orden}
                  ordenar={ordenar}
                  align="center"
                />

                <ThOrden
                  titulo="Presencial"
                  campo="presencial"
                  orden={orden}
                  ordenar={ordenar}
                  align="center"
                />

                <ThOrden
                  titulo="Km Presenciales"
                  campo="km"
                  orden={orden}
                  ordenar={ordenar}
                  align="center"
                />

              </tr>

            </thead>


            <tbody>

              {filtrada.length === 0 ? (

                <tr>

                  <td
                    colSpan={4}
                    className="
                      py-12
                      text-center
                      text-white/45
                    "
                  >

                    <div className="text-3xl mb-2">
                      📭
                    </div>

                    <div
                      className="
                        text-sm
                        text-white/60
                      "
                    >
                      No hay datos para los filtros seleccionados.
                    </div>

                  </td>

                </tr>

              ) : (

                filtrada.map((row, index) => (

                  <tr
                    key={row.apoderado_id}
                    className="
                      border-b border-white/10
                      hover:bg-white/[0.07]
                      transition
                      group
                    "
                  >

                    <td
                      className="
                        py-3.5
                        px-6
                        text-left
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
                            w-8
                            h-8
                            rounded-lg
                            bg-white/10
                            border border-white/10
                            flex
                            items-center
                            justify-center
                            text-xs
                            text-white/60
                            group-hover:bg-blue-500/20
                            group-hover:text-blue-200
                            transition
                          "
                        >
                          {index + 1}
                        </div>

                        <span
                          className="
                            font-medium
                            text-white
                          "
                        >
                          {row.nombre}
                        </span>

                      </div>

                    </td>


                    <td
                      className="
                        py-3.5
                        px-6
                        text-center
                      "
                    >

                      <span
                        className="
                          inline-flex
                          min-w-[42px]
                          justify-center
                          px-2.5
                          py-1
                          rounded-lg
                          bg-blue-500/15
                          border border-blue-400/20
                          text-blue-200
                          font-semibold
                        "
                      >
                        {row.vc}
                      </span>

                    </td>


                    <td
                      className="
                        py-3.5
                        px-6
                        text-center
                      "
                    >

                      <span
                        className="
                          inline-flex
                          min-w-[42px]
                          justify-center
                          px-2.5
                          py-1
                          rounded-lg
                          bg-green-500/15
                          border border-green-400/20
                          text-green-200
                          font-semibold
                        "
                      >
                        {row.presencial}
                      </span>

                    </td>


                    <td
                      className="
                        py-3.5
                        px-6
                        text-center
                      "
                    >

                      <span
                        className="
                          inline-flex
                          min-w-[60px]
                          justify-center
                          px-2.5
                          py-1
                          rounded-lg
                          bg-red-500/10
                          border border-red-400/20
                          text-red-200
                          font-semibold
                        "
                      >
                        {row.km
                          ? row.km.toFixed(1)
                          : "0.0"}
                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ======================================================
          GRÁFICOS
      ====================================================== */}

      <div>

        <div className="mb-4">

          <h2
            className="
              text-xl
              font-semibold
              text-white
            "
          >
            Análisis gráfico
          </h2>

          <p
            className="
              text-sm
              text-white/50
              mt-1
            "
          >
            Comparativa visual de la actividad del periodo.
          </p>

        </div>


        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-3
            gap-5
          "
        >

          <GraficoCard
            titulo="Videoconferencias"
            descripcion="VC por apoderado"
            icono="💻"
          >
            <canvas
              id="graficoVC"
            />
          </GraficoCard>


          <GraficoCard
            titulo="Presencial"
            descripcion="Citas presenciales por apoderado"
            icono="👤"
          >
            <canvas
              id="graficoP"
            />
          </GraficoCard>


          <GraficoCard
            titulo="Desplazamientos"
            descripcion="Kilómetros presenciales"
            icono="🚗"
          >
            <canvas
              id="graficoKm"
            />
          </GraficoCard>

        </div>

      </div>

    </div>
  );
}


// ============================================================
// COMPONENTE KPI
// ============================================================

function KpiCard({
  icon,
  titulo,
  valor,
  subtitulo,
  clase,
}) {
  const fondos = {
    blue:
      "bg-blue-500/10 border-blue-400/20",
    green:
      "bg-green-500/10 border-green-400/20",
    red:
      "bg-red-500/10 border-red-400/20",
    purple:
      "bg-purple-500/10 border-purple-400/20",
    orange:
      "bg-orange-500/10 border-orange-400/20",
  };

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border
        backdrop-blur-xl
        p-5
        shadow-lg
        transition
        hover:-translate-y-0.5
        hover:shadow-xl
        ${fondos[clase]}
      `}
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

          <p
            className="
              text-xs
              uppercase
              tracking-wide
              text-white/50
              font-medium
            "
          >
            {titulo}
          </p>

          <div
            className="
              text-3xl
              font-bold
              text-white
              mt-2
            "
          >
            {valor}
          </div>

          <p
            className="
              text-xs
              text-white/40
              mt-1
            "
          >
            {subtitulo}
          </p>

        </div>


        <div
          className="
            w-11
            h-11
            rounded-xl
            bg-white/10
            border border-white/10
            flex
            items-center
            justify-center
            text-xl
            shadow-inner
          "
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


// ============================================================
// CABECERA TABLA
// ============================================================

function ThOrden({
  titulo,
  campo,
  orden,
  ordenar,
  align = "left",
}) {
  const activo =
    orden.campo === campo;

  return (
    <th
      className={`
        py-3.5
        px-6
        font-semibold
        text-white/75
        cursor-pointer
        select-none
        hover:text-white
        transition
        ${align === "center"
          ? "text-center"
          : "text-left"}
      `}
      onClick={() =>
        ordenar(campo)
      }
    >

      <span
        className="
          inline-flex
          items-center
          gap-2
        "
      >

        {titulo}

        <span
          className={`
            text-[10px]
            transition
            ${
              activo
                ? "text-blue-300"
                : "text-white/20"
            }
          `}
        >
          {activo
            ? orden.asc
              ? "▲"
              : "▼"
            : "↕"}
        </span>

      </span>

    </th>
  );
}


// ============================================================
// TARJETA DE GRÁFICO
// ============================================================

function GraficoCard({
  titulo,
  descripcion,
  icono,
  children,
}) {
  return (
    <div
      className="
        bg-white/10
        backdrop-blur-xl
        border border-white/20
        rounded-2xl
        shadow-xl
        overflow-hidden
      "
    >

      <div
        className="
          px-5
          py-4
          border-b border-white/10
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
              w-9
              h-9
              rounded-lg
              bg-white/10
              border border-white/10
              flex
              items-center
              justify-center
            "
          >
            {icono}
          </div>

          <div>

            <h3
              className="
                text-sm
                font-semibold
                text-white
              "
            >
              {titulo}
            </h3>

            <p
              className="
                text-xs
                text-white/40
                mt-0.5
              "
            >
              {descripcion}
            </p>

          </div>

        </div>

      </div>


      <div
        className="
          h-[300px]
          p-5
        "
      >
        {children}
      </div>

    </div>
  );
}

