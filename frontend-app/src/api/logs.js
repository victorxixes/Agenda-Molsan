import axios from "./axios";

export const getLogs = () => axios.get("/seguridad/logs/");
export const registrarLog = (payload) =>
  axios.post("/seguridad/logs/", payload);
