import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export const ctnAPI = {
  listar: () => axios.get(`${API}/ctn/notarias`).then(r => r.data),

  obtener: (id) => axios.get(`${API}/ctn/notarias/${id}`).then(r => r.data),

  crear: (data) => axios.post(`${API}/ctn/notarias`, data).then(r => r.data),

  actualizar: (id, data) => axios.put(`${API}/ctn/notarias/${id}`, data).then(r => r.data),

  eliminar: (id) => axios.delete(`${API}/ctn/notarias/${id}`).then(r => r.data),

  importarExcel: (file) => {
    const form = new FormData();
    form.append("file", file);
    return axios.post(`${API}/ctn/importar-excel`, form).then(r => r.data);
  },

  // ⭐ NUEVO: obtener nº de firmas de una notaría
  obtenerFirmas: (id) =>
    axios.get(`${API}/ctn/notarias/${id}/firmas`).then(r => r.data)
};
