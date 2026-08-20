import axios from "../api/axios";

export const maestrosAPI = {
  departamentos: {
    listar: () => axios.get(`/api/maestros/departamentos`).then(r => r.data),
    crear: (data) => axios.post(`/api/maestros/departamentos`, data).then(r => r.data),
  },

  secciones: {
    listar: () => axios.get(`/api/maestros/secciones`).then(r => r.data),
    crear: (data) => axios.post(`/api/maestros/secciones`, data).then(r => r.data),
  },

  cargos: {
    listar: () => axios.get(`/api/maestros/cargos`).then(r => r.data),
    crear: (data) => axios.post(`/api/maestros/cargos`, data).then(r => r.data),
  },
};
