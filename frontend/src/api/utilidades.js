import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export const utilidadesAPI = {
  importarCTN: (file) => {
    const form = new FormData();
    form.append("file", file);
    return axios.post(`${API}/utilidades/importar-ctn`, form).then(r => r.data);
  },

  crearNoticia: (payload) =>
    axios.post(`${API}/utilidades/crear-noticia`, payload).then(r => r.data),

  subirDocumento: (formData) =>
    axios.post(`${API}/utilidades/subir-documento`, formData).then(r => r.data)
};
