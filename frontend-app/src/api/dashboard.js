import axios from "../api/axios";

export const dashboardAPI = {
  full: async () => {
    const res = await axios.get("/dashboard/full");   // ✔ CORRECTO
    return res.data;
  },

  resumen: async () => {
    const res = await axios.get("/dashboard/resumen"); // ✔ CORRECTO
    return res.data;
  }
};
