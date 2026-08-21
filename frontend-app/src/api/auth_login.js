import axios from "../api/axios";

export const loginRequest = async (usuario, password) => {
  const res = await axios.post(
    "/auth/login",   // SIN /api
    { usuario, password }
  );

  return res.data;
};

