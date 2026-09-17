import { useIntranetStore } from "../store/intranetStore";

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

export const useIntranet = () => {
  const store = useIntranetStore();

  return {
    ...store,

    documentos: Array.isArray(store.documentos)
      ? store.documentos.map(safeDoc)
      : [],

    noticias: Array.isArray(store.noticias)
      ? store.noticias.map(safeNoticia)
      : [],
  };
};
