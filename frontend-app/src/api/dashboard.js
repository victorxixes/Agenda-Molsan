import axios from "../api/axios";

export const dashboardAPI = {
  full: async () => {
    const res = await axios.get("/api/dashboard/full");   // ✔ CORRECTO
    return res.data;
  },

  resumen: async () => {
    const res = await axios.get("/api/dashboard/resumen"); // ✔ CORRECTO
    return res.data;
  }
};
