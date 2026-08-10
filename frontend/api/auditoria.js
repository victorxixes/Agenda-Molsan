import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export const auditoriaAPI = {
  estado: () =>
    axios.get(`${API}/auditoria`).then(r => r.data),

  metricas: () =>
    axios.get(`${API}/auditoria/metricas`).then(r => r.data),
};
