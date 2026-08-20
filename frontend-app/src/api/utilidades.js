import axios from "../api/axios";

export const utilidadesAPI = {
  importarCTN: (file) => {
    const form = new FormData();
    form.append("file", file);
    return axios.post(`/utilidades/importar-ctn`, form).then(r => r.data);
  },

  crearNoticia: (payload) =>
    axios.post(`/utilidades/crear-noticia`, payload).then(r => r.data),

  subirDocumento: (formData) =>
    axios.post(`/utilidades/subir-documento`, formData).then(r => r.data)
};
