import axios from "./axios";

/**
 * API Intranet — Versión SJ‑2026 Premium
 * Gestiona:
 * - Documentos
 * - Noticias
 * - Descargas
 */

/* ---------------------------------------------------------
   DOCUMENTOS
--------------------------------------------------------- */
export const listarDocumentos = (search) =>
  axios.get("/documentos", { params: { search } });

export const obtenerDocumento = (id) =>
  axios.get(`/documentos/${id}`);

export const crearDocumento = (formData) =>
  axios.post("/documentos", formData);

export const actualizarDocumento = (id, formData) =>
  axios.put(`/documentos/${id}`, formData);

export const eliminarDocumento = (id) =>
  axios.delete(`/documentos/${id}`);

export const descargarDocumento = (id) =>
  axios.get(`/documentos/descargar/${id}`, {
    responseType: "blob",
  });


/* ---------------------------------------------------------
   NOTICIAS
--------------------------------------------------------- */
export const listarNoticias = (search) =>
  axios.get("/noticias", { params: { search } });

export const obtenerNoticia = (id) =>
  axios.get(`/noticias/${id}`);

export const crearNoticia = (data) =>
  axios.post("/noticias", data);

export const actualizarNoticia = (id, data) =>
  axios.put(`/noticias/${id}`, data);

export const eliminarNoticia = (id) =>
  axios.delete(`/noticias/${id}`);
