import axios from "./axios";

/* LISTAR LOGS con filtros */
export const listarLogs = (filtros = {}) =>
  axios.get("/seguridad/logs/", { params: filtros });

/* OBTENER TODOS LOS LOGS (sin filtros) */
export const getLogs = () => axios.get("/seguridad/logs/");

/* REGISTRAR LOG */
export const registrarLog = (payload) =>
  axios.post("/seguridad/logs/", payload);
