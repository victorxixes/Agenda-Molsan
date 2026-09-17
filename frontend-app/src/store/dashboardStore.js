import { create } from "zustand";
import * as api from "../api/dashboard";

export const useDashboardStore = create((set) => ({
  data: null,
  loading: false,

  cargarDashboard: async () => {
    set({ loading: true });

    try {
      const res = await api.obtenerDashboard();

      // Render devuelve: res.data = { status, data }
      const d = res?.data?.data;

      const dataValida =
        d && typeof d === "object"
          ? {
              hoy: d.hoy || 0,
              semana: d.semana || 0,
              mes: d.mes || 0,
              firmas_mes: d.firmas_mes || 0,
              vc_mes: d.vc_mes || 0,
              presenciales_mes: d.presenciales_mes || 0,
              proximas: Array.isArray(d.proximas) ? d.proximas : [],
            }
          : {
              hoy: 0,
              semana: 0,
              mes: 0,
              firmas_mes: 0,
              vc_mes: 0,
              presenciales_mes: 0,
              proximas: [],
            };

      set({ data: dataValida, loading: false });
    } catch {
      set({
        data: {
          hoy: 0,
          semana: 0,
          mes: 0,
          firmas_mes: 0,
          vc_mes: 0,
          presenciales_mes: 0,
          proximas: [],
        },
        loading: false,
      });
    }
  },
}));
