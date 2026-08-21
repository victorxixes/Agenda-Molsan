import axios from "../api/axios";

export const dashboardAgendaAPI = {
  obtenerKPIs: async () => {
    const res = await axios.get("/dashboard/agenda/kpis");
    return res.data;
  }
};
 
