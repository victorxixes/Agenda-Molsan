import { useState, useCallback } from "react";
import axios from "../api/axios";

// Normalizador idéntico al de Agenda
function normalizarCita(c) {
  if (!c || typeof c !== "object") return null;

  return {
    id: c.id,
    fecha: c.fecha || "",
    hora_inicio: c.hora_inicio || "",
    hora_fin: c.hora_fin || "",
    tipo_cita: c.tipo_cita || "",
    tipo_firma: typeof c.tipo_firma === "string" ? c.tipo_firma : "",
    notario: c.notario || "",
    apoderado: c.apoderado || "",
    observaciones: c.observaciones || "",
  };
}

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axios.get("/dashboard");
      const d = res?.data || {};

      const proximas = Array.isArray(d.proximas)
        ? d.proximas.map(normalizarCita).filter(Boolean)
        : [];

      // Fecha de hoy y mañana
      const hoy = new Date().toISOString().slice(0, 10);
      const mañana = new Date(Date.now() + 86400000)
        .toISOString()
        .slice(0, 10);

      const citasHoy = proximas.filter((c) => c.fecha === hoy);
      const citasMañana = proximas.filter((c) => c.fecha === mañana);

      // Semana (7 días)
      const semanaLimite = new Date(Date.now() + 7 * 86400000)
        .toISOString()
        .slice(0, 10);

      const citasSemana = proximas.filter((c) => c.fecha <= semanaLimite);

      // Agrupación por notario
      const porNotario = {};
      proximas.forEach((c) => {
        const key = c.notario || "Sin notario";
        if (!porNotario[key]) porNotario[key] = [];
        porNotario[key].push(c);
      });

      // Agrupación por tipo_firma
      const porTipoFirma = {};
      proximas.forEach((c) => {
        const key = c.tipo_firma || "Sin tipo";
        if (!porTipoFirma[key]) porTipoFirma[key] = [];
        porTipoFirma[key].push(c);
      });

      setData({
        hoy: d.hoy ?? 0,
        semana: d.semana ?? 0,
        mes: d.mes ?? 0,
        proximas,
        citasHoy,
        citasMañana,
        citasSemana,
        porNotario,
        porTipoFirma,
      });
    } catch (err) {
      console.error("Error cargando dashboard:", err);
      setData(null);
    }

    setLoading(false);
  }, []);

  return { data, loading, cargarDashboard };
}
