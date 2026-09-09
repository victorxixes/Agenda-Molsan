import axios from "./axios";

/* ============================
   CRUD EMPLEADOS (BLINDADO)
============================ */

export const buscarEmpleados = async (params) => {
  const res = await axios.get("/empleados/search", { params });
  return { data: Array.isArray(res.data) ? res.data : [] };
};

export const listarEmpleados = async () => {
  const res = await axios.get("/empleados/");
  return { data: Array.isArray(res.data) ? res.data : [] };
};

export const obtenerEmpleado = async (id) => {
  const res = await axios.get(`/empleados/${id}`);
  return { data: res.data || null };
};

export const crearEmpleado = async (payload) => {
  const res = await axios.post("/empleados/", payload);
  return { data: res.data || null };
};

export const editarEmpleado = async (id, payload) => {
  const res = await axios.put(`/empleados/${id}`, payload);
  return { data: res.data || null };
};

export const eliminarEmpleado = async (id) => {
  const res = await axios.delete(`/empleados/${id}`);
  return { data: res.data || null };
};

/* ============================
   FOTO EMPLEADO
============================ */

export const subirFotoEmpleado = async (id, file) => {
  const formData = new FormData();
  formData.append("archivo", file);

  const res = await axios.post(`/empleados/${id}/foto`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return { data: res.data || null };
};

/* ============================
   SEGURIDAD
============================ */

export const actualizarModulosVisibles = async (id, modulos_visibles_list) => {
  const res = await axios.put(`/empleados/${id}/modulos`, {
    modulos_visibles_list,
  });
  return { data: res.data || null };
};

export const actualizarPermisosModulo = async (id, permisos_modulo_dict) => {
  const res = await axios.put(`/empleados/${id}/permisos`, {
    permisos_modulo_dict,
  });
  return { data: res.data || null };
};

export const obtenerFichaCompleta = async (id) => {
  const res = await axios.get(`/seguridad/empleado/${id}/ficha-completa`);
  return { data: res.data || null };
};

/* ============================
   RESET PASSWORD (NUEVO)
============================ */

export const resetPasswordEmpleado = async (id) => {
  const res = await axios.post(`/empleados/${id}/reset-password`);
  return { data: res.data || null };
};

/* ============================
   APODERADOS (BLINDADO)
============================ */

export const listarApoderados = async () => {
  const res = await listarEmpleados();

  const lista = Array.isArray(res.data)
    ? res.data.filter(
        (e) =>
          e.apoderado === true ||
          e.es_apoderado === true ||
          e.rol === "apoderado"
      )
    : [];

  return { data: lista };
};
