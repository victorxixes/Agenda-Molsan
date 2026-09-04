import axios from "./axios";

export const login = (usuario, password) =>
  axios.post("/empleados/empleados/login", {
    usuario,
    password,
  });
