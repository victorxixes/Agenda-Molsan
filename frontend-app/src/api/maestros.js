import axios from "../api/axios";

export const maestrosAPI = {
  departamentos: {
    listar: () => axios.get(`/maestros/departamentos`).then(r => r.data),
    crear: (data) => axios.post(`/maestros/departamentos`, data).then(r => r.data),
  },

  secciones: {
    listar: () => axios.get(`/maestros/secciones`).then(r => r.data),
    crear: (data) => axios.post(`/maestros/secciones`, data).then(r => r.data),
  },

  cargos: {
    listar: () => axios.get(`/maestros/cargos`).then(r => r.data),
    crear: (data) => axios.post(`/maestros/cargos`, data).then(r => r.data),
  },
};

