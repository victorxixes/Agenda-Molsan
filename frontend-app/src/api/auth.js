import axios from "../api/axios.js";

export const loginRequest = async (usuario, password) => {
  const res = await axios.post(
    "/auth/login",
    { usuario, password }
  );

  return res.data;
};
