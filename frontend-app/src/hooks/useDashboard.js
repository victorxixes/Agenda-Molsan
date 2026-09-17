import { useState, useCallback } from "react";
import axios from "../api/axios";

/**
 * useDashboard — Hook Premium SJ‑2026
 * - Carga datos del panel corporativo
 * - Estado estable
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
      setData(res.data);
    } catch (err) {
      console.error("Error cargando dashboard:", err);
    }

    setLoading(false);
  }, []);

  return {
    data,
    loading,
    cargarDashboard,
  };
}
