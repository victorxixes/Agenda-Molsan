import axios from "./axios";

/* =========================================================
   CRUD EMPLEADOS
========================================================= */

export const buscarEmpleados = async (params = {}) => {
  const res = await axios.get("/empleados/search", {
    params,
  });

  return {
    data: Array.isArray(res.data) ? res.data : [],
  };
};


export const listarEmpleados = async () => {
  const res = await axios.get("/empleados/");

  return {
    data: Array.isArray(res.data) ? res.data : [],
  };
};


export const obtenerEmpleado = async (id) => {
  const res = await axios.get(`/empleados/${id}`);

  return {
    data: res.data || null,
  };
};


export const crearEmpleado = async (payload) => {
  const res = await axios.post(
    "/empleados/",
    payload
  );

  return {
    data: res.data || null,
  };
};


export const editarEmpleado = async (
  id,
  payload
) => {
  const res = await axios.put(
    `/empleados/${id}`,
    payload
  );

  return {
    data: res.data || null,
  };
};


export const eliminarEmpleado = async (id) => {
  const res = await axios.delete(
    `/empleados/${id}`
  );

  return {
    data: res.data || null,
  };
};


/* =========================================================
   FOTO
========================================================= */

export const subirFotoEmpleado = async (
  id,
  file
) => {
  const formData = new FormData();

  formData.append(
    "archivo",
    file
  );

  const res = await axios.post(
    `/empleados/${id}/foto`,
    formData
  );

  return {
    data: res.data || null,
  };
};


/* =========================================================
   FICHA
========================================================= */

export const obtenerFichaEmpleado = async (
  id
) => {
  const res = await axios.get(
    `/empleados/${id}/ficha`
  );

  return {
    data: res.data || null,
  };
};


/* Alias
========================================================= */

export const obtenerFichaCompleta =
  obtenerFichaEmpleado;


/* =========================================================
   MÓDULOS
========================================================= */

export const actualizarModulosVisibles = async (
  id,
  modulos_visibles_list
) => {
  const res = await axios.put(
    `/empleados/${id}/modulos`,
    {
      modulos_visibles_list,
    }
  );

  return {
    data: res.data || null,
  };
};


/* =========================================================
   PERMISOS
========================================================= */

export const actualizarPermisosModulo = async (
  id,
  permisos_modulo_dict
) => {
  const res = await axios.put(
    `/empleados/${id}/permisos`,
    {
      permisos_modulo_dict,
    }
  );

  return {
    data: res.data || null,
  };
};


/* =========================================================
   PASSWORD
========================================================= */

export const resetPasswordEmpleado = async (
  id
) => {
  const res = await axios.post(
    `/empleados/${id}/reset-password`
  );

  return {
    data: res.data || null,
  };
};


/* =========================================================
   APODERADOS
========================================================= */

export const listarApoderados = async () => {
  const res = await listarEmpleados();

  const lista = Array.isArray(res.data)
    ? res.data.filter(
        (empleado) =>
          empleado.apoderado === true ||
          empleado.es_apoderado === true ||
          empleado.rol === "apoderado" ||
          empleado.rol?.nombre
            ?.toLowerCase() === "apoderado"
      )
    : [];

  return {
    data: lista,
  };
};
