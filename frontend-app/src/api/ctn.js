import axios from "../api/axios";

export const ctnAPI = {
  listar: () => axios.get(`/ctn/notarias`).then(r => r.data),

  obtener: (id) => axios.get(`/ctn/notarias/${id}`).then(r => r.data),

  crear: (data) => axios.post(`/ctn/notarias`, data).then(r => r.data),

  actualizar: (id, data) => axios.put(`/ctn/notarias/${id}`, data).then(r => r.data),

  eliminar: (id) => axios.delete(`/ctn/notarias/${id}`).then(r => r.data),

  importarExcel: (file) => {
    const form = new FormData();
    form.append("file", file);
    return axios.post(`/ctn/importar-excel`, form).then(r => r.data);
  },

  obtenerFirmas: (id) =>
    axios.get(`/ctn/notarias/${id}/firmas`).then(r => r.data)
};
