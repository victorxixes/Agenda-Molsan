import axios from "../api/axios";

export const dashboardAPI = {
  full: async () => {
    const res = await axios.get("api/dashboard/full");
    return res.data;
  },

  resumen: async () => {
    const res = await axios.get("/dashboard/resumen");
    return res.data;
  }
};
