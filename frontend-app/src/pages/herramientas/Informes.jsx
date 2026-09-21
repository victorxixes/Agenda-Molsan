import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../api/config";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Chart from "chart.js/auto";

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
      setTabla(res.data);
    } catch (err) {
      console.error("Error cargando informe:", err);
    }
  };

  // -----------------------------
  // ORDENAR COLUMNAS
  // -----------------------------
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

  // -----------------------------
  // EXPORTAR A EXCEL
  // -----------------------------
  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tabla);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Informe");
    XLSX.writeFile(wb, `informe_${mes}_${año}.xlsx`);
  };

  // -----------------------------
  // EXPORTAR A PDF
  // -----------------------------
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text(`Informe Apoderados — ${mes}/${año}`, 14, 14);

    const filas = tabla.map((t) => [
      t.nombre,
      t.vc,
      t.presencial,
      t.km,
    ]);

    doc.autoTable({
      head: [["Apoderado", "VC", "Presencial", "Km"]],
      body: filas,
      startY: 20,
    });

    doc.save(`informe_${mes}_${año}.pdf`);
  };

  // -----------------------------
  // GRÁFICOS SJ‑2026
  // -----------------------------
  const renderGraficos = () => {
    const ctx1 = document.getElementById("graficoVC");
    const ctx2 = document.getElementById("graficoP");
    const ctx3 = document.getElementById("graficoKm");

    if (!ctx1 || !ctx2 || !ctx3) return;

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

  // -----------------------------
  // FILTRO AVANZADO
  // -----------------------------
  const filtrada = tabla.filter((t) =>
    t.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      <h1 className="text-3xl font-bold text-white drop-shadow mb-4">
        Informes de Apoderados
      </h1>

      {/* Selector mes/año */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl flex gap-6">

        <div className="flex flex-col">
          <label className="text-white/80 text-sm mb-1">Mes</label>
          <select
            className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white"
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-white/80 text-sm mb-1">Año</label>
          <input
            type="number"
            className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white"
            value={año}
            onChange={(e) => setAño(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col flex-1">
          <label className="text-white/80 text-sm mb-1">Buscar apoderado</label>
          <input
            type="text"
            className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white"
            placeholder="Nombre…"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
        </div>

      </div>

      {/* Botones */}
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

      {/* Tabla tipo Excel */}
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

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <canvas id="graficoVC" className="bg-white/10 p-4 rounded-xl"></canvas>
        <canvas id="graficoP" className="bg-white/10 p-4 rounded-xl"></canvas>
        <canvas id="graficoKm" className="bg-white/10 p-4 rounded-xl"></canvas>
      </div>

    </div>
  );
}
