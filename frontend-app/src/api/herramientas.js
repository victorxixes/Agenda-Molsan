import axios from "./axios";

/**
 * API Herramientas — Versión SJ‑2026 Premium
 * Importación de CTN (Excel)
 */

export const importarCTN = (file) => {
  const form = new FormData();
  form.append("fichero", file);
  return axios.post("/utilidades/ctn/importar", form);
};
