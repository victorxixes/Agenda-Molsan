import axios from "./axios";

export const login = (usuario, password) =>
  axios.post("/auth/login", {
    usuario,
    password,
  });

