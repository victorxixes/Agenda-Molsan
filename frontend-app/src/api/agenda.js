import axios from "./axios";

/* CITAS */
export const getCitasDia = async (fecha) => {
  const res = await axios.get(`/agenda/dia/${fecha}`);
  return { data: Array.isArray(res.data) ? res.data : [] };
};

export const getCitasSemana = async (fecha) => {
  const res = await axios.get(`/agenda/semana/${fecha}`);
  return { data: Array.isArray(res.data) ? res.data : [] };
};

export const getCitasMes = async (year, month) => {
  const res = await axios.get(`/agenda/mes/${year}/${month}`);
  return { data: Array.isArray(res.data) ? res.data : [] };
};

export const buscarCitas = async (params) => {
  const res = await axios.get("/agenda/search", { params });
  return { data: Array.isArray(res.data) ? res.data : [] };
};

export const obtenerCita = async (id) => {
  const res = await axios.get(`/agenda/${id}`);
  return { data: res.data || null };
};

export const crearCita = async (data) => {
  const res = await axios.post("/agenda", data);
  return { data: res.data || null };
};

export const editarCita = async (id, data) => {
  const res = await axios.put(`/agenda/${id}`, data);
  return { data: res.data || null };
};

export const eliminarCita = async (id) => {
  const res = await axios.delete(`/agenda/${id}`);
  return { data: res.data || null };
};

export const moverCita = async (id, nueva_fecha, nueva_hora_inicio, nueva_hora_fin) => {
  const res = await axios.put(`/agenda/mover/${id}`, {
    nueva_fecha,
    nueva_hora_inicio,
    nueva_hora_fin,
  });
  return { data: res.data || null };
};

/* NOTARIOS — BLINDADO */
export const obtenerNotarios = async () => {
  const res = await axios.get("/ctn/notarias");
  return { data: Array.isArray(res.data) ? res.data : [] };
};
