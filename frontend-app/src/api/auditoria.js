import axios from "./axios";

export const getAuditoria = () => axios.get("/seguridad/auditoria/");
export const getAuditoriaMetricas = () => axios.get("/seguridad/auditoria/metricas");

export const registrarAuditoria = (payload) =>
  axios.post("/seguridad/auditoria/", payload);
