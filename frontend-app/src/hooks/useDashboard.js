import { useState, useCallback } from "react";
import axios from "../api/axios";

/**
 * Normalizador de citas — igual que AgendaStore
 * Garantiza que el Dashboard muestre las mismas citas que el calendario.
 */
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

/**
 * useDashboard — Hook Premium SJ‑2026
 * - Carga datos del panel corporativo
 * - Normaliza citas próximas
 * - Sin re-renders innecesarios
 * - Compatible con Render y Vite
 */
export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axios.get("/dashboard");

      const d = res?.data || {};

      const proximasNormalizadas = Array.isArray(d.proximas)
        ? d.proximas
            .map(normalizarCita)
            .filter(Boolean) // elimina nulls
        : [];

      setData({
        hoy: d.hoy ?? 0,
        semana: d.semana ?? 0,
        mes: d.mes ?? 0,
        proximas: proximasNormalizadas,
      });
    } catch (err) {
      console.error("Error cargando dashboard:", err);

      setData({
        hoy: 0,
        semana: 0,
        mes: 0,
        proximas: [],
      });
    }

    setLoading(false);
  }, []);

  return {
    data,
    loading,
    cargarDashboard,
  };
}
