import { create } from "zustand";
import * as api from "../api/intranet";

export const useIntranetStore = create((set, get) => ({
  documentos: [],
  noticias: [],

  // DOCUMENTOS
  cargarDocumentos: async (search = "") => {
    const res = await api.listarDocumentos(search);
    set({ documentos: res.data });
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
    const res = await api.listarNoticias(search);
    set({ noticias: res.data });
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

