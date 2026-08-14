import axios from "../api/axios";

export const loginRequest = async (usuario, password) => {
  const res = await axios.post(
    "/api/auth/login",
    { usuario, password }
  );

  return res.data;
};

