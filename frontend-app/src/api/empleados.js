import axios from "./axios";


/* =========================================================
   CRUD EMPLEADOS
========================================================= */


/**
 * Buscar empleados utilizando los parámetros indicados.
 */
export const buscarEmpleados = async (
  params = {}
) => {
  const res = await axios.get(
    "/empleados/search",
    {
      params,
    }
  );

  return {
    data: Array.isArray(res.data)
      ? res.data
      : [],
  };
};


/**
 * Obtener todos los empleados.
 */
export const listarEmpleados = async () => {
  const res = await axios.get(
    "/empleados/"
  );

  return {
    data: Array.isArray(res.data)
      ? res.data
      : [],
  };
};


/**
 * Obtener un empleado por ID.
 */
export const obtenerEmpleado = async (
  id
) => {
  const res = await axios.get(
    `/empleados/${id}`
  );

  return {
    data: res.data || null,
  };
};


/**
 * Crear empleado.
 */
export const crearEmpleado = async (
  payload
) => {
  const res = await axios.post(
    "/empleados/",
    payload
  );

  return {
    data: res.data || null,
  };
};


/**
 * Editar empleado.
 */
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


/**
 * Eliminar empleado.
 */
export const eliminarEmpleado = async (
  id
) => {
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


/**
 * Subir o actualizar la fotografía
 * de un empleado.
 */
export const subirFotoEmpleado = async (
  id,
  file
) => {
  const formData =
    new FormData();

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
   FICHA COMPLETA
========================================================= */


/**
 * Obtener la ficha completa del empleado.
 *
 * Incluye:
 * - datos del empleado
 * - módulos visibles
 * - permisos
 * - auditoría
 */
export const obtenerFichaEmpleado =
  async (id) => {
    const res = await axios.get(
      `/empleados/${id}/ficha`
    );

    return {
      data: res.data || null,
    };
  };


/**
 * Alias utilizado por ModalEmpleado.
 *
 * Se mantiene para compatibilidad
 * con el componente actual.
 */
export const obtenerFichaCompleta =
  obtenerFichaEmpleado;


/* =========================================================
   MÓDULOS VISIBLES
========================================================= */


/**
 * Actualizar módulos visibles
 * del empleado.
 */
export const actualizarModulosVisibles =
  async (
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


/**
 * Actualizar permisos por módulo.
 */
export const actualizarPermisosModulo =
  async (
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


/**
 * Resetear contraseña del empleado.
 */
export const resetPasswordEmpleado =
  async (id) => {
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


/**
 * Obtener empleados que actúan
 * como apoderados.
 *
 * Se mantienen varias comprobaciones
 * por compatibilidad con las diferentes
 * estructuras que puede devolver el backend.
 */
export const listarApoderados =
  async () => {
    const res =
      await listarEmpleados();

    const lista =
      Array.isArray(res.data)
        ? res.data.filter(
            (empleado) =>
              empleado.apoderado === true ||
              empleado.es_apoderado === true ||
              empleado.rol === "apoderado" ||
              empleado.rol?.nombre
                ?.toLowerCase() ===
                "apoderado"
          )
        : [];

    return {
      data: lista,
    };
  };
