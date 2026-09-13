import axios from "./axios";

/* ============================
   CITAS
   ============================ */

/** Día */
export const getCitasDia = async (fecha) => {
  const res = await axios.get(`/agenda/dia/${fecha}`);
  return { data: Array.isArray(res.data) ? res.data : [] };
};

/** Semana */
export const getCitasSemana = async (fecha) => {
  const res = await axios.get(`/agenda/semana/${fecha}`);
  return { data: Array.isArray(res.data) ? res.data : [] };
};

/** Mes */
export const getCitasMes = async (year, month) => {
  const res = await axios.get(`/agenda/mes/${year}/${month}`);
  return { data: Array.isArray(res.data) ? res.data : [] };
};

/** Buscar */
export const buscarCitas = async (params) => {
  const res = await axios.get("/agenda/search", { params });
  return { data: Array.isArray(res.data) ? res.data : [] };
};

/** Obtener una cita */
export const obtenerCita = async (id) => {
  const res = await axios.get(`/agenda/${id}`);
  return { data: res.data || null };
};

/** Crear */
export const crearCita = async (data) => {
  const res = await axios.post("/agenda", data);
  return { data: res.data || null };
};

/** Editar */
export const editarCita = async (id, data) => {
  const res = await axios.put(`/agenda/${id}`, data);
  return { data: res.data || null };
};

/** Eliminar */
export const eliminarCita = async (id) => {
  const res = await axios.delete(`/agenda/${id}`);
  return { data: res.data || null };
};

/** Mover */
export const moverCita = async (id, nueva_fecha, nueva_hora_inicio, nueva_hora_fin) => {
  const res = await axios.put(`/agenda/mover/${id}`, {
    nueva_fecha,
    nueva_hora_inicio,
    nueva_hora_fin,
  });
  return { data: res.data || null };
};

/* ============================
   NOTARIOS
   ============================ */

export const obtenerNotarios = async () => {
  const res = await axios.get("/ctn/notarias");
  return { data: Array.isArray(res.data) ? res.data : [] };
};
