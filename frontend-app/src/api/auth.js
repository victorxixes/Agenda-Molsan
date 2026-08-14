import axios from "../api/axios.js";

export const loginRequest = async (usuario, password) => {
  return axios({
    method: "POST",
    url: "/empleados/login",
    data: { usuario, password },
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.data);
};

