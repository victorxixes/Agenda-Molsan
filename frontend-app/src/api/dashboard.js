import axios from "../api/axios";

export const dashboardAPI = {
  resumen: async () => {
    const res = await axios.get("/dashboard/resumen");
    return res.data;
  }
};
