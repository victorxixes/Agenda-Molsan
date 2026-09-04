import axios from "./axios";

export const listarNotarias = ({
  provincia,
  municipio,
  vc,
  apoderado,
  q,
  page = 1,
  page_size = 50,
} = {}) =>
  axios.get("/ctn/notarias", {
    params: { provincia, municipio, vc, apoderado, q, page, page_size },
  });

export const obtenerNotaria = (id) =>
  axios.get(`/ctn/notarias/${id}`);

export const obtenerFirmasNotaria = (id) =>
  axios.get(`/ctn/notarias/${id}/firmas`);
