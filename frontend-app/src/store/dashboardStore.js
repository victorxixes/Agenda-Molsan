import { create } from "zustand";
import { dashboardAPI } from "../api/dashboard";

export const useDashboardStore = create((set) => ({
  data: null,

  cargarDashboard: async (empleadoId) => {
    try {
      const raw = await dashboardAPI.resumenAgenda(empleadoId);

      // Protección total: si algo viene undefined → lo convertimos en objetos seguros
      const safe = {
        agenda: raw?.agenda ?? {
          citas_hoy: 0,
          citas_semana: 0,
          firmas_hoy: { vc: 0, p: 0 },
          firmas_semana: { vc: 0, p: 0 },
          firmas_por_mes: []
        },

        empleados: raw?.empleados ?? {
          total: 0,
          activos: 0
        },

        mensajes: raw?.mensajes ?? {
          hoy: 0,
          no_leidos: 0
        },

        actividad: raw?.actividad ?? {
          hoy: 0,
          semana: 0
        },

        ctn: raw?.ctn ?? {
          notarios: 0,
          zonas: 0,
          firmas: 0
        },

        rol: raw?.rol ?? null
      };

      set({ data: safe });

    } catch (error) {
      console.error("Error cargando dashboard:", error);

      // En caso de error, devolvemos estructura segura
      set({
        data: {
          agenda: {
            citas_hoy: 0,
            citas_semana: 0,
            firmas_hoy: { vc: 0, p: 0 },
            firmas_semana: { vc: 0, p: 0 },
            firmas_por_mes: []
          },
          empleados: { total: 0, activos: 0 },
          mensajes: { hoy: 0, no_leidos: 0 },
          actividad: { hoy: 0, semana: 0 },
          ctn: { notarios: 0, zonas: 0, firmas: 0 },
          rol: null
        }
      });
    }
  },
}));

