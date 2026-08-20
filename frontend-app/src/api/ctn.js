import axios from "../api/axios";

export const ctnAPI = {
  listar: () => axios.get(`/api/ctn/notarias`).then(r => r.data),

  obtener: (id) => axios.get(`/api/ctn/notarias/${id}`).then(r => r.data),

  crear: (data) => axios.post(`/api/ctn/notarias`, data).then(r => r.data),

  actualizar: (id, data) => axios.put(`/api/ctn/notarias/${id}`, data).then(r => r.data),

  eliminar: (id) => axios.delete(`/api/ctn/notarias/${id}`).then(r => r.data),

  importarExcel: (file) => {
    const form = new FormData();
    form.append("file", file);
    return axios.post(`/api/ctn/importar-excel`, form).then(r => r.data);
  },

  obtenerFirmas: (id) =>
    axios.get(`/api/ctn/notarias/${id}/firmas`).then(r => r.data)
};
