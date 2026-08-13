import axios from "axios";

export const loginRequest = async (usuario, password) => {
  const res = await axios.post(
    "https://agenda-intranet-b.onrender.com/empleados/login",
    {
      usuario,
      password
    }
  );

  return res.data;
};
