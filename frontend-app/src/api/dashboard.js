import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const dashboardAPI = {
  resumen: async () => {
    const res = await axios.get(`${API}/api/dashboard/resumen`);
    return res.data;
  }
};
