import axios from "./axios";

export const listarLogs = (params = {}) =>
  axios.get("/logs", { params });
