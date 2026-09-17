import { create } from "zustand";
import * as api from "../api/intranet";

export const useIntranetStore = create((set, get) => ({
  documentos: [],
  noticias: [],
  loading: false,
  error: null,

  // DOCUMENTOS
  cargarDocumentos: async (search = "") => {
    set({ loading: true, error: null });

    try {
      const res = await api.listarDocumentos(search);

      const lista = Array.isArray(res.data)
        ? res.data
        : [];

      set({ documentos: lista, loading: false });
    } catch {
      set({ documentos: [], loading: false, error: "Error cargando documentos" });
    }
  },

  crearDocumento: async (data) => {
    const res = await api.crearDocumento(data);
    await get().cargarDocumentos();
    return res.data;
  },

  actualizarDocumento: async (id, data) => {
    const res = await api.actualizarDocumento(id, data);
    await get().cargarDocumentos();
    return res.data;
  },

  eliminarDocumento: async (id) => {
    await api.eliminarDocumento(id);
    await get().cargarDocumentos();
  },

  // NOTICIAS
  cargarNoticias: async (search = "") => {
    set({ loading: true, error: null });

    try {
      const res = await api.listarNoticias(search);

      const lista = Array.isArray(res.data)
        ? res.data
        : [];

      set({ noticias: lista, loading: false });
    } catch {
      set({ noticias: [], loading: false, error: "Error cargando noticias" });
    }
  },

  crearNoticia: async (data) => {
    const res = await api.crearNoticia(data);
    await get().cargarNoticias();
    return res.data;
  },

  actualizarNoticia: async (id, data) => {
    const res = await api.actualizarNoticia(id, data);
    await get().cargarNoticias();
    return res.data;
  },

  eliminarNoticia: async (id) => {
    await api.eliminarNoticia(id);
    await get().cargarNoticias();
  },
}));
