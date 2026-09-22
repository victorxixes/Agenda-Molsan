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
  const [orden, setOrden] = useState({ campo: "nombre", asc: true });

  useEffect(() => {
    cargarTabla();
  }, [mes, año]);

  useEffect(() => {
    renderGraficos();
  }, [tabla]);

  // ⭐ CORREGIDO → km siempre existe
  const cargarTabla = async () => {
    try {
      const res = await axios.get(`${API_BASE}/informes/apoderados/tabla`, {
        params: { mes, año },
      });

      const lista = (res.data || []).map((t) => ({
        ...t,
        km: t.km ?? t.distancia_km ?? 0, // ⭐ km siempre definido
      }));

      setTabla(lista);
    } catch (err) {
      console.error("Error cargando informe:", err);
      setTabla([]);
    }
  };

  const ordenar = (campo) => {
    const asc = orden.campo === campo ? !orden.asc : true;
    setOrden({ campo, asc });

    const ordenada = [...tabla].sort((a, b) => {
      if (a[campo] < b[campo]) return asc ? -1 : 1;
      if (a[campo] > b[campo]) return asc ? 1 : -1;
      return 0;
    });

    setTabla(ordenada);
  };

  const exportarExcel = () => {
    const encabezados = ["Apoderado", "VC", "Presencial", "Km"];
    const filas = tabla.map((t) => [
      t.nombre,
      t.vc,
      t.presencial,
      t.km?.toFixed(2) || "0.00", // ⭐ corregido
    ]);

    let contenido = encabezados.join(",") + "\n";
    contenido += filas.map((f) => f.join(",")).join("\n");

    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `informe_${mes}_${año}.csv`;
    link.click();
  };

  const exportarPDF = () => {
    const ventana = window.open("", "_blank");

    // Totales corregidos
    const totalVC = tabla.reduce((acc, t) => acc + (t.vc || 0), 0);
    const totalPres = tabla.reduce((acc, t) => acc + (t.presencial || 0), 0);
    const totalKm = tabla.reduce((acc, t) => acc + (t.km || 0), 0);

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
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
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
              border-bottom: 2px solid #cbd5e1;
              text-align: left;
              color: #0d1b2a;
            }

            td {
              padding: 8px;
              border-bottom: 1px solid #e2e8f0;
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
          <img class="logo" src="/logo-sj2026.png" />

          <div class="card">
            <h1>Informe de Apoderados</h1>
            <h2>${mes}/${año}</h2>

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
              <span>Total VC: ${totalVC}</span>
              <span>Total Presencial: ${totalPres}</span>
              <span>Total Km: ${totalKm.toFixed(2)}</span>
            </div>
          </div>
        </body>
      </html>
    `);

    ventana.document.close();
    ventana.print();
  };

new Chart(ctx2, {
  type: "bar",
  data: {
    labels: tabla.map((t) => t.nombre),
    datasets: [
      {
        label: "Presencial",
        data: tabla.map((t) => t.presencial),
        backgroundColor: "#34d399",
      },
    ],
  },
});

new Chart(ctx3, {
  type: "line",
  data: {
    labels: tabla.map((t) => t.nombre),
    datasets: [
      {
        label: "Km",
        data: tabla.map((t) => t.km || 0),   // ⭐ CORREGIDO
        borderColor: "#f87171",
        fill: false,
      },
    ],
  },
});

const filtrada = tabla.filter((t) =>
  t.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
);

const totalVC = tabla.reduce((acc, t) => acc + (t.vc || 0), 0);
const totalPresencial = tabla.reduce((acc, t) => acc + (t.presencial || 0), 0);
const totalKm = tabla.reduce((acc, t) => acc + (t.km || 0), 0);

const mediaCitas =
  tabla.length > 0 ? (totalVC + totalPresencial) / tabla.length : 0;

const mediaKm = tabla.length > 0 ? totalKm / tabla.length : 0;

return (
  <div className="p-6 space-y-6 animate-fade-in">
    {/* ... resto igual ... */}

    <tbody>
      {filtrada.map((row) => (
        <tr key={row.apoderado_id} className="border-b border-white/10 hover:bg-white/5 transition">
          <td className="py-2 px-2">{row.nombre}</td>
          <td className="py-2 px-2 text-center">{row.vc}</td>
          <td className="py-2 px-2 text-center">{row.presencial}</td>

          {/* ⭐ KM CORREGIDO */}
          <td className="py-2 px-2 text-center">
            {row.km ? row.km.toFixed(1) : "0.0"}
          </td>
        </tr>
      ))}
    </tbody>

    {/* ... resto igual ... */}
  </div>
);
)
