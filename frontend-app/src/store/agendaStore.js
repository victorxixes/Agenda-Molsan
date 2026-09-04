import { create } from "zustand";
import * as api from "../api/agenda";

export const useAgendaStore = create((set, get) => ({
  citas: [],
  vista: "dia", // dia | semana | mes
  fechaActual: new Date().toISOString().slice(0, 10),

  cargarDia: async (fecha) => {
    const res = await api.getCitasDia(fecha);
    set({ citas: res.data, vista: "dia", fechaActual: fecha });
  },

  cargarSemana: async (fecha) => {
    const res = await api.getCitasSemana(fecha);
    set({ citas: res.data, vista: "semana", fechaActual: fecha });
  },

  cargarMes: async (year, month) => {
    const res = await api.getCitasMes(year, month);
    set({ citas: res.data, vista: "mes", fechaActual: `${year}-${month}-01` });
  },

  buscar: async (params) => {
    const res = await api.buscarCitas(params);
    set({ citas: res.data });
  },

  obtener: async (id) => {
    const res = await api.obtenerCita(id);
    return res.data;
  },

  crear: async (data) => {
    const res = await api.crearCita(data);
    await get().refrescarVista();
    return res.data;
  },

  editar: async (id, data) => {
    const res = await api.editarCita(id, data);
    await get().refrescarVista();
    return res.data;
  },

  eliminar: async (id) => {
    await api.eliminarCita(id);
    await get().refrescarVista();
  },

  mover: async (id, fecha, inicio, fin) => {
    const res = await api.moverCita(id, fecha, inicio, fin);
    await get().refrescarVista();
    return res.data;
  },

  refrescarVista: async () => {
    const { vista, fechaActual } = get();

    if (vista === "dia") return get().cargarDia(fechaActual);
    if (vista === "semana") return get().cargarSemana(fechaActual);

    const d = new Date(fechaActual);
    return get().cargarMes(d.getFullYear(), d.getMonth() + 1);
  },
}));

