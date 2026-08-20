import axios from "../api/axios";

// API INTRANET
export const intranetAPI = {
  // ---------------------------------------------------------
  // NOTICIAS
  // ---------------------------------------------------------
  listarNoticias: () =>
    axios.get(`/api/intranet/noticias/`).then(r => r.data),

  crearNoticia: (data) =>
    axios.post(`/api/intranet/noticias/`, data).then(r => r.data),

  editarNoticia: (id, data) =>
    axios.put(`/api/intranet/noticias/${id}/`, data).then(r => r.data),

  eliminarNoticia: (id) =>
    axios.delete(`/api/intranet/noticias/${id}/`).then(r => r.data),

  // ---------------------------------------------------------
  // DOCUMENTOS
  // ---------------------------------------------------------
  listarDocumentos: () =>
    axios.get(`/api/intranet/documentos/`).then(r => r.data),

  crearDocumento: (formData) =>
    axios.post(`/api/intranet/documentos/`, formData).then(r => r.data),

  editarDocumento: (id, formData) =>
    axios.put(`/api/intranet/documentos/${id}/`, formData).then(r => r.data),

  eliminarDocumento: (id) =>
    axios.delete(`/api/intranet/documentos/${id}/`).then(r => r.data),

  descargarDocumento: (id) =>
    axios.get(`/api/intranet/documentos/${id}/descargar/`, {
      responseType: "blob",
    }),
};
