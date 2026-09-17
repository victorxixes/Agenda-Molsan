import { useState, useCallback } from "react";
import axios from "../api/axios";

// Sanitizador universal SJ‑2026
const safe = (v) => {
  if (v === null || v === undefined) return "-";
  if (typeof v === "object") {
    try { return JSON.stringify(v); } catch { return "-" }
  }
  return String(v);
};

// Normalizador blindado
function normalizarCita(c) {
  if (!c || typeof c !== "object") return null;

  return {
    id: safe(c.id),
    fecha: safe(c.fecha),
    hora_inicio: safe(c.hora_inicio),
    hora_fin: safe(c.hora_fin),
    tipo_cita: safe(c.tipo_cita),
    tipo_firma: safe(c.tipo_firma),
    notario: safe(c.notario),
    apoderado: safe(c.apoderado),
    observaciones: safe(c.observaciones),
  };
}

export function useDashboard() {
  const [data, setData] = useState({
    proximas: [],
    realizadasVC: [],
    realizadasPresencial: [],
    totalMes: 0,
  });

  const [loading, setLoading] = useState(false);

  const cargarDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const hoyDate = new Date();
      const year = hoyDate.getFullYear();
      const month = hoyDate.getMonth() + 1;

      const resAgenda = await axios.get(`/agenda/mes/${year}/${month}`);

      const citasCrudas = Array.isArray(resAgenda.data)
        ? resAgenda.data
        : [];

      const citasMes = citasCrudas
        .map(normalizarCita)
        .filter((c) => c && typeof c.fecha === "string");

      const hoy = hoyDate.toISOString().slice(0, 10);

      const proximas = citasMes.filter((c) => c.fecha >= hoy);
      const realizadasVC = citasMes.filter(
        (c) => c.fecha < hoy && c.tipo_firma === "Videoconferencia"
      );
      const realizadasPresencial = citasMes.filter(
        (c) => c.fecha < hoy && c.tipo_firma === "Presencial"
      );

      setData({
        proximas,
        realizadasVC,
        realizadasPresencial,
        totalMes: citasMes.length,
      });
    } catch (err) {
      console.error("Error cargando dashboard:", err);
      setData({
        proximas: [],
        realizadasVC: [],
        realizadasPresencial: [],
        totalMes: 0,
      });
    }

    setLoading(false);
  }, []);

  return { data, loading, cargarDashboard };
}
