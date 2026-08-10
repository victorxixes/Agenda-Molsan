import { create } from "zustand";
import { dashboardAgendaAPI } from "../api/dashboardAgenda";

export const useDashboardAgendaStore = create((set) => ({
  kpi: {},

  cargarKPIs: async () => {
    const data = await dashboardAgendaAPI.obtenerKPIs();
    set({ kpi: data });
  }
}));
