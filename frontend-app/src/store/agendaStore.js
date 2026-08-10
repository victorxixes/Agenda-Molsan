import { create } from "zustand";
import { agendaAPI } from "../api/agendaAPI.js";
import { crearLog } from "../lib/log";

export const useAgendaStore = create((set, get) => ({
  citasDia: [],
  citas: [],          // alias seguro
  citaActual: null,
  loading: false,

  // ---------------------------------------------------------
  // CARGAR CITAS DEL DÍA
  // ---------------------------------------------------------
  cargarDia: async (fecha) => {
    set({ loading: true });

    const data = await agendaAPI.citasDia(fecha);
    const safe = Array.isArray(data) ? data : [];

    set({
      citasDia: safe,
      citas: safe,
      loading: false
    });
  },

  // ---------------------------------------------------------
  // CARGAR UNA CITA COMPLETA (detalle)
  // ---------------------------------------------------------
  cargarCita: async (id) => {
    const data = await agendaAPI.obtener(id);
    set({ citaActual: data });
  },

  // ---------------------------------------------------------
  // CREAR CITA
  // ---------------------------------------------------------
  crear: async (data) => {
    const payload = {
      fecha: data.fecha,
      hora_inicio: data.hora_inicio,
      hora_fin: data.hora_fin,
      tipo_cita: data.tipo_cita,
      notario_id: Number(data.notario_id),
      tipo_firma: data.tipo_firma || "",
      apoderado_id: Number(data.apoderado_id),
      estado: data.estado,
      observaciones: data.observaciones || "",
    };

    const res = await agendaAPI.crear(payload);

    await crearLog(
      "agenda",
      "crear",
      `Cita creada para el día ${res.fecha}`,
      res
    );

    await get().cargarDia(res.fecha);
  },

  // ---------------------------------------------------------
  // MOVER CITA (drag & drop)
  // ---------------------------------------------------------
  mover: async (id, nuevaFecha, hi, hf) => {
    const res = await agendaAPI.mover(id, nuevaFecha, hi, hf);

    await crearLog(
      "agenda",
      "mover",
      `Cita ${id} movida a ${nuevaFecha}`,
      res
    );

    await get().cargarDia(nuevaFecha);
  },

  // ---------------------------------------------------------
  // CAMBIAR ESTADO
  // ---------------------------------------------------------
  cambiarEstado: async (id, nuevoEstado) => {
    const res = await agendaAPI.cambiarEstado(id, nuevoEstado);

    await crearLog(
      "agenda",
      "estado",
      `Estado de cita ${id} cambiado a ${nuevoEstado}`,
      res
    );

    await get().cargarCita(id);
  },
}));
