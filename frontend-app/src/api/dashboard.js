import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export const dashboardAPI = {
  resumenAgenda: (empleadoId) =>
    axios
      .get(`${API}/dashboard/resumen`, {
        params: { empleado_id: empleadoId }
      })
      .then(r => r.data),
};
