import axios from "./axios";

export const listarNotarias = (search = "") =>
  axios.get("/ctn", { params: { search } });

export const obtenerNotaria = (id) =>
  axios.get(`/ctn/${id}`);
