import axios from "../api/axios";

export const auditoriaAPI = {
  estado: () =>
    axios.get(`/api/auditoria`).then(r => r.data),

  metricas: () =>
    axios.get(`/api/auditoria/metricas`).then(r => r.data),
};
