import { create } from "zustand";
import { maestrosAPI } from "../api/maestros";

export const useMaestrosStore = create((set) => ({
  departamentos: [],
  secciones: [],
  cargos: [],

  cargarDepartamentos: async () => {
    const data = await maestrosAPI.departamentos.listar();
    set({ departamentos: data });
  },

  cargarSecciones: async () => {
    const data = await maestrosAPI.secciones.listar();
    set({ secciones: data });
  },

  cargarCargos: async () => {
    const data = await maestrosAPI.cargos.listar();
    set({ cargos: data });
  },

  crearDepartamento: async (data) => {
    await maestrosAPI.departamentos.crear(data);
    await set.getState().cargarDepartamentos();
  },

  crearSeccion: async (data) => {
    await maestrosAPI.secciones.crear(data);
    await set.getState().cargarSecciones();
  },

  crearCargo: async (data) => {
    await maestrosAPI.cargos.crear(data);
    await set.getState().cargarCargos();
  },
}));
