import axios from "./axios";

/**
 * API Auth — Versión SJ‑2026 Premium
 * Gestiona:
 * - Inicio de sesión
 */

export const login = (usuario, password) =>
  axios.post("/auth/login", {
    usuario,
    password,
  });
