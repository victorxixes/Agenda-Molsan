import axios from "./axios";

/* ============================
   MAESTROS (Departamentos, Secciones, Cargos)
============================ */

export const getMaestros = async (tipo) => {
  const res = await axios.get(`/api/maestros/${tipo}`);
  return { data: Array.isArray(res.data) ? res.data : [] };
};

export const obtenerMaestro = async (tipo, id) => {
  const res = await axios.get(`/api/maestros/${tipo}/${id}`);
  return { data: res.data || null };
};

export const crearMaestro = async (tipo, nombre) => {
  const res = await axios.post(`/api/maestros/${tipo}`, { nombre });
  return { data: res.data || null };
};

export const editarMaestro = async (tipo, id, nombre) => {
  const res = await axios.put(`/api/maestros/${tipo}/${id}`, { nombre });
  return { data: res.data || null };
};

export const eliminarMaestro = async (tipo, id) => {
  const res = await axios.delete(`/api/maestros/${tipo}/${id}`);
  return { data: res.data || null };
};
