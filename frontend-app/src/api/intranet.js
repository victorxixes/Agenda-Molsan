import axios from "axios";
const API = import.meta.env.VITE_API_URL;

// API INTRANET
export const intranetAPI = {
  // ---------------------------------------------------------
  // NOTICIAS
  // ---------------------------------------------------------
  listarNoticias: () =>
    axios.get(`${API}/intranet/noticias/`).then(r => r.data),

  crearNoticia: (data) =>
    axios.post(`${API}/intranet/noticias/`, data).then(r => r.data),

  editarNoticia: (id, data) =>
    axios.put(`${API}/intranet/noticias/${id}/`, data).then(r => r.data),

  eliminarNoticia: (id) =>
    axios.delete(`${API}/intranet/noticias/${id}/`).then(r => r.data),

  // ---------------------------------------------------------
  // DOCUMENTOS
  // ---------------------------------------------------------
  listarDocumentos: () =>
    axios.get(`${API}/intranet/documentos/`).then(r => r.data),

  crearDocumento: (formData) =>
    axios.post(`${API}/intranet/documentos/`, formData).then(r => r.data),

  editarDocumento: (id, formData) =>
    axios.put(`${API}/intranet/documentos/${id}/`, formData).then(r => r.data),

  eliminarDocumento: (id) =>
    axios.delete(`${API}/intranet/documentos/${id}/`).then(r => r.data),

  descargarDocumento: (id) =>
    axios.get(`${API}/intranet/documentos/${id}/descargar/`, {
      responseType: "blob",
    }),
};
