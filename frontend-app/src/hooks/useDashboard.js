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
      // 1️⃣ Cargar citas del mes actual (igual que el calendario)
      const hoyDate = new Date();
      const year = hoyDate.getFullYear();
      const month = hoyDate.getMonth() + 1;

      const resAgenda = await axios.get(`/agenda/mes/${year}/${month}`);
      const citasMes = Array.isArray(resAgenda.data)
        ? resAgenda.data.map(normalizarCita).filter(Boolean)
        : [];

      // 2️⃣ Calcular métricas
      const hoy = hoyDate.toISOString().slice(0, 10);
      const mañana = new Date(Date.now() + 86400000)
        .toISOString()
        .slice(0, 10);

      const citasHoy = citasMes.filter((c) => c.fecha === hoy);
      const citasMañana = citasMes.filter((c) => c.fecha === mañana);

      const semanaLimite = new Date(Date.now() + 7 * 86400000)
        .toISOString()
        .slice(0, 10);

      const citasSemana = citasMes.filter((c) => c.fecha <= semanaLimite);

      // 3️⃣ Agrupaciones
      const porNotario = {};
      citasMes.forEach((c) => {
        const key = c.notario || "Sin notario";
        if (!porNotario[key]) porNotario[key] = [];
        porNotario[key].push(c);
      });

      const porTipoFirma = {};
      citasMes.forEach((c) => {
        const key = c.tipo_firma || "Sin tipo";
        if (!porTipoFirma[key]) porTipoFirma[key] = [];
        porTipoFirma[key].push(c);
      });

      // 4️⃣ Guardar datos
      setData({
        hoy: citasHoy.length,
        semana: citasSemana.length,
        mes: citasMes.length,
        proximas: citasMes,
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
