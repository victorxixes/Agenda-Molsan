import { create } from "zustand";
import { dashboardAPI } from "../api/dashboard";

export const useDashboardStore = create((set) => ({
  resumen: null,

  cargarResumen: async () => {
    try {
      // 🔥 Ahora llamamos al endpoint nuevo
      const raw = await dashboardAPI.full();

      const safe = {
        kpis: raw?.kpis || {},
        citas_dia: raw?.citas_dia || [],
        por_apoderado: raw?.por_apoderado || [],
        citas_por_hora: raw?.citas_por_hora || [],
        actividad_semanal: raw?.actividad_semanal || {},
        ctn: raw?.ctn || {}
      };

      set({ resumen: safe });

    } catch (error) {
      console.error("Error cargando dashboard:", error);

      set({
        resumen: {
          kpis: {},
          citas_dia: [],
          por_apoderado: [],
          citas_por_hora: [],
          actividad_semanal: {},
          ctn: {}
        }
      });
    }
  },
}));
