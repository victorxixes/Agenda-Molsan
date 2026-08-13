import axios from "axios";

export const loginRequest = async (usuario, password) => {
  const res = await axios.post(
    "/empleados/login",
    { usuario, password }
  );

  return res.data;
};
