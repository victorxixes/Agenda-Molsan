import { create } from "zustand";
import { dashboardAPI } from "../api/dashboard";

export const useDashboardStore = create((set) => ({
  resumen: null,

  cargarResumen: async () => {
    try {
      const raw = await dashboardAPI.resumen();

      const safe = {
        firmas_realizadas: raw?.firmas_realizadas || {
          videoconferencia: 0,
          presencial: 0
        },

        firmas_pendientes: raw?.firmas_pendientes || {
          videoconferencia: 0,
          presencial: 0
        },

        por_apoderado: raw?.por_apoderado || [],
        citas_dia: raw?.citas_dia || []
      };

      set({ resumen: safe });

    } catch (error) {
      console.error("Error cargando dashboard:", error);

      set({
        resumen: {
          firmas_realizadas: { videoconferencia: 0, presencial: 0 },
          firmas_pendientes: { videoconferencia: 0, presencial: 0 },
          por_apoderado: [],
          citas_dia: []
        }
      });
    }
  },
}));
