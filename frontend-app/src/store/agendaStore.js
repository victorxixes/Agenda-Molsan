import { create } from "zustand";
import * as api from "../api/agenda";

export const useAgendaStore = create((set, get) => ({
  citas: [],
  vista: "mes",   // Vista por defecto: MES
  fechaActual: new Date().toISOString().slice(0, 10),

  // Cargar mes
  cargarMes: async (year, month) => {
    const res = await api.getCitasMes(year, month);
    set({
      citas: Array.isArray(res.data) ? res.data : [],
      vista: "mes",
      fechaActual: `${year}-${month}-01`,
    });
  },

  // Buscar citas
  buscar: async (params) => {
    const res = await api.buscarCitas(params);
    set({ citas: Array.isArray(res.data) ? res.data : [] });
  },

  // Obtener una cita
  obtener: async (id) => {
    const res = await api.obtenerCita(id);
    return res.data;
  },

  // Crear cita
  crear: async (data) => {
    const res = await api.crearCita(data);
    await get().refrescarVista();
    return res.data;
  },

  // Editar cita
  editar: async (id, data) => {
    const res = await api.editarCita(id, data);
    await get().refrescarVista();
    return res.data;
  },

  // Eliminar cita
  eliminar: async (id) => {
    await api.eliminarCita(id);
    await get().refrescarVista();
  },

  // Mover cita
  mover: async (id, fecha, inicio, fin) => {
    const res = await api.moverCita(id, fecha, inicio, fin);
    await get().refrescarVista();
    return res.data;
  },

  // Refrescar vista (siempre mes)
  refrescarVista: async () => {
    const fecha = get().fechaActual;
    const d = new Date(fecha);
    return get().cargarMes(d.getFullYear(), d.getMonth() + 1);
  },
}));


