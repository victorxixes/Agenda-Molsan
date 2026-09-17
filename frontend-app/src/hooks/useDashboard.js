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
      // Fecha actual
      const hoyDate = new Date();
      const year = hoyDate.getFullYear();
      const month = hoyDate.getMonth() + 1;

      // 1️⃣ Cargar citas del mes actual (igual que el calendario)
      const resAgenda = await axios.get(`/agenda/mes/${year}/${month}`);

      // ⭐ FILTRAR SOLO CITAS VÁLIDAS (evita error React #31)
      const soloCitas = Array.isArray(resAgenda.data)
        ? resAgenda.data.filter((c) => c.fecha && c.hora_inicio)
        : [];

      const citasMes = soloCitas.map(normalizarCita).filter(Boolean);

      // 2️⃣ Próximas citas (fecha >= hoy)
      const hoy = hoyDate.toISOString().slice(0, 10);
      const proximas = citasMes.filter((c) => c.fecha >= hoy);

      // 3️⃣ Citas realizadas por tipo
      const realizadasVC = citasMes.filter(
        (c) => c.fecha < hoy && c.tipo_firma === "Videoconferencia"
      );

      const realizadasPresencial = citasMes.filter(
        (c) => c.fecha < hoy && c.tipo_firma === "Presencial"
      );

      // 4️⃣ Total del mes
      const totalMes = citasMes.length;

      // 5️⃣ Guardar datos
      setData({
        proximas,
        realizadasVC,
        realizadasPresencial,
        totalMes,
      });
    } catch (err) {
      console.error("Error cargando dashboard:", err);
      setData(null);
    }

    setLoading(false);
  }, []);

  return { data, loading, cargarDashboard };
}
