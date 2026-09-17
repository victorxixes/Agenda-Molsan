import { create } from "zustand";
import * as api from "../api/ctn";

/**
 * Store CTN — Versión SJ‑2026 Premium
 * Gestiona:
 * - Listado de notarias
 * - Paginación
 * - Notaria seleccionada
 * - Firmas de la notaria
 */

export const useCtnStore = create((set) => ({
  items: [],
  total: 0,
  page: 1,
  page_size: 15,
  notaria: null,
  firmas: null,
  loading: false,

  // ---------------------------------------------------------
  // CARGAR NOTARIAS (LISTADO + PAGINACIÓN)
  // ---------------------------------------------------------
  cargarNotarias: async (filtros = {}, page = 1, page_size = 15) => {
  set({ loading: true });

  try {
    const res = await api.listarNotarias({
      ...filtros,
      page,
      page_size,
    });

    set({
      items: res.data.items || [],
      total: res.data.total || 0,
      page: res.data.page || page,
      page_size: res.data.page_size || page_size,
      loading: false,
    });
  } catch {
    set({
      items: [],
      total: 0,
      page,
      page_size,
      loading: false,
    });
  }
},


  // ---------------------------------------------------------
  // CARGAR NOTARIA (DETALLE)
  // ---------------------------------------------------------
  cargarNotaria: async (id) => {
    set({ loading: true });

    try {
      const res = await api.obtenerNotaria(id);
      set({ notaria: res.data, loading: false });
    } catch {
      set({ notaria: null, loading: false });
    }
  },

  // ---------------------------------------------------------
  // CARGAR FIRMAS DE UNA NOTARIA
  // ---------------------------------------------------------
  cargarFirmasNotaria: async (id) => {
    try {
      const res = await api.obtenerFirmasNotaria(id);
      set({ firmas: res.data });
    } catch {
      set({ firmas: null });
    }
  },
}));
