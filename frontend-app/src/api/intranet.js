import axios from "./axios";

// DOCUMENTOS
export const listarDocumentos = (search) =>
  axios.get("/intranet/documentos", { params: { search } });

export const obtenerDocumento = (id) =>
  axios.get(`/intranet/documentos/${id}`);

export const crearDocumento = (formData) =>
  axios.post("/intranet/documentos", formData);

export const actualizarDocumento = (id, formData) =>
  axios.put(`/intranet/documentos/${id}`, formData);

export const eliminarDocumento = (id) =>
  axios.delete(`/intranet/documentos/${id}`);

export const descargarDocumento = (id) =>
  axios.get(`/intranet/documentos/descargar/${id}`, {
    responseType: "blob",
  });

// NOTICIAS
export const listarNoticias = (search) =>
  axios.get("/intranet/noticias", { params: { search } });

export const obtenerNoticia = (id) =>
  axios.get(`/intranet/noticias/${id}`);

export const crearNoticia = (data) =>
  axios.post("/intranet/noticias", data);

export const actualizarNoticia = (id, data) =>
  axios.put(`/intranet/noticias/${id}`, data);

export const eliminarNoticia = (id) =>
  axios.delete(`/intranet/noticias/${id}`);

