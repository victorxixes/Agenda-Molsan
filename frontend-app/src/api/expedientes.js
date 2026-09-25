import axios from "axios";

export async function obtenerListadoExpedientes(params = {}) {
  const res = await axios.get("/api/expedientes/listado", { params });
  return res.data;
}

export async function obtenerResumenExpedientes() {
  const res = await axios.get("/api/expedientes/resumen");
  return res.data;
}

export async function exportarExcelExpedientes(params = {}) {
  const res = await axios.get("/api/expedientes/exportar-excel", {
    params,
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = "expedientes.xlsx";
  a.click();
}
