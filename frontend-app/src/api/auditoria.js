import axios from "../api/axios";

export const auditoriaAPI = {
  estado: () =>
    axios.get(`/auditoria`).then(r => r.data),

  metricas: () =>
    axios.get(`/auditoria/metricas`).then(r => r.data),
};
