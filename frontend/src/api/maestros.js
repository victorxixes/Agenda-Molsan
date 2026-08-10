import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export const maestrosAPI = {
  departamentos: {
    listar: () => axios.get(`${API}/maestros/departamentos`).then(r => r.data),
    crear: (data) => axios.post(`${API}/maestros/departamentos`, data).then(r => r.data),
  },

  secciones: {
    listar: () => axios.get(`${API}/maestros/secciones`).then(r => r.data),
    crear: (data) => axios.post(`${API}/maestros/secciones`, data).then(r => r.data),
  },

  cargos: {
    listar: () => axios.get(`${API}/maestros/cargos`).then(r => r.data),
    crear: (data) => axios.post(`${API}/maestros/cargos`, data).then(r => r.data),
  },
};
