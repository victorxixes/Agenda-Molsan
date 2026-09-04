import axios from "./axios";

export const importarCTN = (file) => {
  const form = new FormData();
  form.append("fichero", file);
  return axios.post("/utilidades/ctn/importar", form);
};
