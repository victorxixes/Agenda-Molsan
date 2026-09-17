import { create } from "zustand";
import * as api from "../api/intranet";

// Sanitizador universal SJ‑2026
const safe = (v) => {
  if (v === null || v === undefined) return "-";
  if (typeof v === "object") {
    if (Array.isArray(v)) return v.join(", ");
    try { return JSON.stringify(v); } catch { return "-" }
  }
  return String(v);
};

// Sanitizar documento
const safeDoc = (d) => ({
  id: safe(d.id),
  titulo: safe(d.titulo),
  concepto: safe(d.concepto),
  fecha_publicacion: safe(d.fecha_publicacion),
  fichero: safe(d.fichero),
});

// Sanitizar noticia
const safeNoticia = (n) => ({
  id: safe(n.id),
  titulo: safe(n.titulo),
  descripcion: safe(n.descripcion),
  fecha_publicacion: safe(n.fecha_publicacion),
});

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
        ? res.data.map(safeDoc)
        : [];

      set({ documentos: lista, loading: false });
    } catch {
      set({ documentos: [], loading: false, error: "Error cargando documentos" });
    }
  },

  crearDocumento: async (data) => {
    const res = await api.crearDocumento(data);
    await get().cargarDocumentos();
    return safeDoc(res.data);
  },

  actualizarDocumento: async (id, data) => {
    const res = await api.actualizarDocumento(id, data);
    await get().cargarDocumentos();
    return safeDoc(res.data);
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
        ? res.data.map(safeNoticia)
        : [];

      set({ noticias: lista, loading: false });
    } catch {
      set({ noticias: [], loading: false, error: "Error cargando noticias" });
    }
  },

  crearNoticia: async (data) => {
    const res = await api.crearNoticia(data);
    await get().cargarNoticias();
    return safeNoticia(res.data);
  },

  actualizarNoticia: async (id, data) => {
    const res = await api.actualizarNoticia(id, data);
    await get().cargarNoticias();
    return safeNoticia(res.data);
  },

  eliminarNoticia: async (id) => {
    await api.eliminarNoticia(id);
    await get().cargarNoticias();
  },
}));
