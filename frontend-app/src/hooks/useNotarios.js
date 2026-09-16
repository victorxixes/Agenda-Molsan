import { useEffect, useState } from "react";
import { listarNotarios } from "../api/notarios";

/**
 * Hook premium SJ‑2026
 * - Carga la lista de notarios vía API
 * - Maneja estado de carga y error
 * - Devuelve datos listos para UI premium
 */
export function useNotarios() {
  const [notarios, setNotarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listarNotarios()
      .then((res) => {
        setNotarios(res.data || []);
      })
      .catch(() => {
        setError("No se pudieron cargar los notarios");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { notarios, loading, error };
}

