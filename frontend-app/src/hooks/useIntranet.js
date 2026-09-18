import { useIntranetStore } from "../store/intranetStore";

// Sanitizador seguro SJ‑2026 (blindado)
const safe = (v) => {
  if (v === null || v === undefined) return "-";

  // Evitar objetos y JSON en el render
  if (typeof v === "object") {
    if (Array.isArray(v)) return v.join(", ");
    if (typeof v.nombre === "string") return v.nombre;
    return "-"; // nunca JSON.stringify
  }

  if (typeof v === "boolean") return v ? "Sí" : "No";

  return String(v);
};

// Sanitizar documento (blindado)
const safeDoc = (d) => ({
  id: safe(d.id),
  titulo: safe(d.titulo),
  concepto: safe(
    typeof d.concepto === "string"
      ? d.concepto
      : d.concepto?.nombre || "-"
  ),
  fecha_publicacion: safe(d.fecha_publicacion),

  // fichero debe ser SIEMPRE string o "-"
  fichero:
    typeof d.fichero === "string"
      ? d.fichero
      : "-",
});

// Sanitizar noticia (blindado)
const safeNoticia = (n) => ({
  id: safe(n.id),
  titulo: safe(n.titulo),
  descripcion: safe(n.descripcion),
  fecha_publicacion: safe(n.fecha_publicacion),
});

export const useIntranet = () => {
  const store = useIntranetStore();

  return {
    documentos: Array.isArray(store.documentos)
      ? store.documentos.map(safeDoc)
      : [],

    noticias: Array.isArray(store.noticias)
      ? store.noticias.map(safeNoticia)
      : [],

    cargarDocumentos: store.cargarDocumentos,
    cargarNoticias: store.cargarNoticias,
    eliminarDocumento: store.eliminarDocumento,
    eliminarNoticia: store.eliminarNoticia,
    loading: store.loading,
    error: store.error,
  };
};
