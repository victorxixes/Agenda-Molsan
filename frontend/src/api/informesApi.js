import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export async function getInformeAgenda(year, month, day) {
  const { data } = await api.get(`/informes/agenda/${year}/${month}/${day}`);
  return data;
}

export async function getInformeApoderados() {
  const { data } = await api.get(`/informes/apoderados`);
  return data;
}

export async function getInformeZonas() {
  const { data } = await api.get(`/informes/zonas`);
  return data;
}
