import axios from "axios";

const API_URL = "https://agenda-intranet-backend.onrender.com";

export const loginRequest = async (usuario, password) => {
  const { data } = await axios.post(
    `${API_URL}/auth/login`,
    { usuario, password }
  );

  return {
    empleado_id: data.empleado_id,
    nombre: data.nombre,
    rol: data.rol,
    modulos: data.modulos || [],
    permisos: data.permisos || [],
    token: data.token
  };
};
