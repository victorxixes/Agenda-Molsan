import axios from "../api/axios";

// API INTRANET
export const intranetAPI = {
  // ---------------------------------------------------------
  // NOTICIAS
  // ---------------------------------------------------------
  listarNoticias: () =>
    axios.get(`/intranet/noticias/`).then(r => r.data),

  crearNoticia: (data) =>
    axios.post(`/intranet/noticias/`, data).then(r => r.data),

  editarNoticia: (id, data) =>
    axios.put(`/intranet/noticias/${id}/`, data).then(r => r.data),

  eliminarNoticia: (id) =>
    axios.delete(`/intranet/noticias/${id}/`).then(r => r.data),

  // ---------------------------------------------------------
  // DOCUMENTOS
  // ---------------------------------------------------------
  listarDocumentos: () =>
    axios.get(`/intranet/documentos/`).then(r => r.data),

  crearDocumento: (formData) =>
    axios.post(`/intranet/documentos/`, formData).then(r => r.data),

  editarDocumento: (id, formData) =>
    axios.put(`/intranet/documentos/${id}/`, formData).then(r => r.data),

  eliminarDocumento: (id) =>
    axios.delete(`/intranet/documentos/${id}/`).then(r => r.data),

  descargarDocumento: (id) =>
    axios.get(`/intranet/documentos/${id}/descargar/`, {
      responseType: "blob",
    }),
};
