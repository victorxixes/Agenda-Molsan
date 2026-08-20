import axios from "../api/axios";

export async function getInformeAgenda(year, month, day) {
  const { data } = await axios.get(`/api/informes/agenda/${year}/${month}/${day}`);
  return data;
}

export async function getInformeApoderados() {
  const { data } = await axios.get(`/api/informes/apoderados`);
  return data;
}

export async function getInformeZonas() {
  const { data } = await axios.get(`/api/informes/zonas`);
  return data;
}
