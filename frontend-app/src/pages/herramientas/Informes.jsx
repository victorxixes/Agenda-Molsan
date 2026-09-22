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

  const cargarTabla = async () => {
    try {
      const res = await axios.get(`${API_BASE}/informes/apoderados/tabla`, {
        params: { mes, año },
      });
      setTabla(res.data || []);
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
    const filas = tabla.map((t) => [t.nombre, t.vc, t.presencial, t.km]);

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
    const encabezados = ["Apoderado", "VC", "Presencial", "Km"];

    const filas = tabla
      .map(
        (t) => `
      <tr>
        <td>${t.nombre}</td>
        <td>${t.vc}</td>
        <td>${t.presencial}</td>
        <td>${t.km}</td>
      </tr>
    `
      )
      .join("");

    ventana.document.write(`
      <html>
        <head>
          <title>Informe ${mes}/${año}</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-size: 14px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: left; }
            th { background: #eee; }
          </style>
        </head>
        <body>
          <h2>Informe ${mes}/${año}</h2>
          <table>
            <thead>
              <tr>${encabezados.map((h) => `<th>${h}</th>`).join("")}</tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </body>
      </html>
    `);

    ventana.document.close();
    ventana.print();
  };

  const renderGraficos = () => {
    const ctx1 = document.getElementById("graficoVC");
    const ctx2 = document.getElementById("graficoP");
    const ctx3 = document.getElementById("graficoKm");

    if (!ctx1 || !ctx2 || !ctx3) return;

    ctx1.getContext("2d").clearRect(0, 0, ctx1.width, ctx1.height);
    ctx2.getContext("2d").clearRect(0, 0, ctx2.width, ctx2.height);
    ctx3.getContext("2d").clearRect(0, 0, ctx3.width, ctx3.height);

    new Chart(ctx1, {
      type: "bar",
      data: {
        labels: tabla.map((t) => t.nombre),
        datasets: [
          {
            label: "VC",
            data: tabla.map((t) => t.vc),
            backgroundColor: "#60a5fa",
          },
        ],
      },
    });

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
            data: tabla.map((t) => t.km),
            borderColor: "#f87171",
            fill: false,
          },
        ],
      },
    });
  };

  const filtrada = tabla.filter((t) =>
    t.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  const totalVC = tabla.reduce((acc, t) => acc + (t.vc || 0), 0);
  const totalPresencial = tabla.reduce(
    (acc, t) => acc + (t.presencial || 0),
    0
  );
  const totalKm = tabla.reduce((acc, t) => acc + (t.km || 0), 0);

  const mediaCitas =
    tabla.length > 0 ? (totalVC + totalPresencial) / tabla.length : 0;

  const mediaKm = tabla.length > 0 ? totalKm / tabla.length : 0;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white drop-shadow mb-4">
        Informes de Apoderados
      </h1>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl flex gap-6">

        <div className="flex flex-col w-40">
          <label className="text-white/80 text-sm mb-1">Mes</label>
          <SelectSJ
            value={mes}
            onChange={(v) => setMes(Number(v))}
            options={MESES}
            placeholder="Mes"
          />
        </div>

        <div className="flex flex-col w-32">
          <label className="text-white/80 text-sm mb-1">Año</label>
          <input
            type="number"
            className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white backdrop-blur-xl"
            value={año}
            onChange={(e) => setAño(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col flex-1">
          <label className="text-white/80 text-sm mb-1">Buscar apoderado</label>
          <input
            type="text"
            className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white backdrop-blur-xl"
            placeholder="Nombre…"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">

        <div className="bg-white/5 p-4 rounded-xl text-center">
          <h4 className="text-white/70 text-sm">Total VC</h4>
          <div className="text-3xl font-bold">{totalVC}</div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-center">
          <h4 className="text-white/70 text-sm">Total Presencial</h4>
          <div className="text-3xl font-bold">{totalPresencial}</div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-center">
          <h4 className="text-white/70 text-sm">Km Totales</h4>
          <div className="text-3xl font-bold">{totalKm}</div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-center">
          <h4 className="text-white/70 text-sm">Media Citas</h4>
          <div className="text-3xl font-bold">{mediaCitas.toFixed(1)}</div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-center">
          <h4 className="text-white/70 text-sm">Media Km</h4>
          <div className="text-3xl font-bold">{mediaKm.toFixed(1)}</div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={exportarExcel}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg"
        >
          Exportar Excel
        </button>

        <button
          onClick={exportarPDF}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg"
        >
          Exportar PDF
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl overflow-x-auto">

        <table className="w-full text-left text-white text-sm">
          <thead>
            <tr className="border-b border-white/20">
              <th className="py-2 px-2 cursor-pointer" onClick={() => ordenar("nombre")}>
                Apoderado
              </th>
              <th className="py-2 px-2 text-center cursor-pointer" onClick={() => ordenar("vc")}>
                VC
              </th>
              <th className="py-2 px-2 text-center cursor-pointer" onClick={() => ordenar("presencial")}>
                Presencial
              </th>
              <th className="py-2 px-2 text-center cursor-pointer" onClick={() => ordenar("km")}>
                Km Presenciales
              </th>
            </tr>
          </thead>

          <tbody>
            {filtrada.map((row) => (
              <tr key={row.apoderado_id} className="border-b border-white/10 hover:bg-white/5 transition">
                <td className="py-2 px-2">{row.nombre}</td>
                <td className="py-2 px-2 text-center">{row.vc}</td>
                <td className="py-2 px-2 text-center">{row.presencial}</td>
                <td className="py-2 px-2 text-center">{row.km}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <canvas id="graficoVC" className="bg-white/10 p-4 rounded-xl"></canvas>
        <canvas id="graficoP" className="bg-white/10 p-4 rounded-xl"></canvas>
        <canvas id="graficoKm" className="bg-white/10 p-4 rounded-xl"></canvas>
      </div>
    </div>
  );
}
