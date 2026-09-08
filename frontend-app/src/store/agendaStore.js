import { create } from "zustand";
import * as api from "../api/agenda";

export const useAgendaStore = create((set, get) => ({
  citas: [],
  cargando: false,
  vista: "mes",
  fechaActual: new Date().toISOString().slice(0, 10),

  cargarMes: async (year, month) => {
    // Marcar como cargando
    set({ cargando: true });

    const res = await api.getCitasMes(year, month);

    // Blindaje total: siempre array
    const citas = Array.isArray(res.data) ? res.data : [];

    set({
      citas,
      vista: "mes",
      fechaActual: `${year}-${month}-01`,
      cargando: false,
    });
  },

  buscar: async (params) => {
    set({ cargando: true });

    const res = await api.buscarCitas(params);
    const citas = Array.isArray(res.data) ? res.data : [];

    set({ citas, cargando: false });
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
    const fecha = get().fechaActual;
    const d = new Date(fecha);
    return get().cargarMes(d.getFullYear(), d.getMonth() + 1);
  },
}));
