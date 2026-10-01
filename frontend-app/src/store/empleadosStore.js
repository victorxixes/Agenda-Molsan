import { create } from "zustand";

import {
  listarEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  editarEmpleado,
  eliminarEmpleado,
  listarApoderados,
  actualizarModulosVisibles,
  actualizarPermisosModulo,
  obtenerFichaCompleta,
} from "../api/empleados";

/* =========================================================
   UTILIDADES
========================================================= */

const safe = (v) => {
  if (v === null || v === undefined) return "-";

  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return "-";
    }
  }

  return String(v);
};


/* =========================================================
   EMPLEADO PARA LISTADOS
   No convertir objetos de seguridad aquí.
========================================================= */

const safeEmpleado = (e) => ({
  id: Number(e.id),

  nombre: safe(e.nombre),
  apellidos: safe(e.apellidos),

  telefono: safe(e.telefono),
  email_empresa: safe(e.email_empresa),

  activo: Boolean(e.activo),

  departamento_nombre: safe(e.departamento_nombre),
  seccion_nombre: safe(e.seccion_nombre),
  cargo_nombre: safe(e.cargo_nombre),

  foto: safe(e.foto),
  usuario: safe(e.usuario),
});


/* =========================================================
   FICHA COMPLETA
========================================================= */

const safeFicha = (data) => {
  if (!data) return null;

  const empleado = data.empleado || {};

  return {
    empleado: {
      ...empleado,

      id: Number(empleado.id),

      nombre: empleado.nombre ?? "",
      apellidos: empleado.apellidos ?? "",
      dni: empleado.dni ?? "",

      telefono: empleado.telefono ?? "",
      email_personal: empleado.email_personal ?? "",
      email_empresa: empleado.email_empresa ?? "",
      extension: empleado.extension ?? "",

      usuario: empleado.usuario ?? "",

      direccion: empleado.direccion ?? "",
      codigo_postal: empleado.codigo_postal ?? "",
      poblacion: empleado.poblacion ?? "",
      provincia: empleado.provincia ?? "",

      fecha_nacimiento: empleado.fecha_nacimiento ?? "",

      alergias: empleado.alergias ?? "",
      persona_contacto: empleado.persona_contacto ?? "",
      telefono_contacto: empleado.telefono_contacto ?? "",

      observaciones: empleado.observaciones ?? "",

      foto: empleado.foto ?? "",

      departamento_id: empleado.departamento_id ?? null,
      seccion_id: empleado.seccion_id ?? null,
      cargo_id: empleado.cargo_id ?? null,

      fecha_alta: empleado.fecha_alta ?? "",
      fecha_baja: empleado.fecha_baja ?? "",

      activo: Boolean(empleado.activo),
    },

    /*
     * El rol es INFORMATIVO.
     *
     * No genera permisos.
     * No modifica módulos.
     */
    rol: data.empleado?.rol || data.rol || null,

    departamento: data.departamento || null,
    seccion: data.seccion || null,
    cargo: data.cargo || null,

    /*
     * Los permisos pertenecen directamente al empleado.
     */
    modulos_visibles: Array.isArray(data.modulos_visibles)
      ? data.modulos_visibles
      : [],

    permisos_modulo:
      data.permisos_modulo &&
      typeof data.permisos_modulo === "object"
        ? data.permisos_modulo
        : {},

    auditoria: Array.isArray(data.auditoria)
      ? data.auditoria
      : [],
  };
};


/* =========================================================
   STORE
========================================================= */

export const useEmpleadosStore = create((set, get) => ({
  /* -------------------------------------------------------
     ESTADO
  ------------------------------------------------------- */

  empleados: [],
  apoderados: [],

  empleadoActual: null,

  cargando: false,
  error: null,


  /* =======================================================
     LISTAR EMPLEADOS
  ======================================================= */

  cargarEmpleados: async () => {
    try {
      set({
        cargando: true,
        error: null,
      });

      const res = await listarEmpleados();

      const lista = Array.isArray(res.data)
        ? res.data.map(safeEmpleado)
        : [];

      set({
        empleados: lista,
        cargando: false,
      });

      return lista;

    } catch (err) {

      console.error(
        "Error cargando empleados:",
        err
      );

      set({
        cargando: false,
        error: err.message || "Error cargando empleados",
      });

      return [];
    }
  },


  /* =======================================================
     BUSCAR EMPLEADOS
  ======================================================= */

  buscar: async (params = {}) => {
    try {
      set({
        cargando: true,
        error: null,
      });

      /*
       * Importamos dinámicamente para no cambiar
       * el comportamiento del resto del módulo.
       */
      const { buscarEmpleados } = await import(
        "../api/empleados"
      );

      const res = await buscarEmpleados(params);

      const lista = Array.isArray(res.data)
        ? res.data.map(safeEmpleado)
        : [];

      set({
        empleados: lista,
        cargando: false,
      });

      return lista;

    } catch (err) {

      console.error(
        "Error buscando empleados:",
        err
      );

      set({
        cargando: false,
        error: err.message || "Error buscando empleados",
      });

      return [];
    }
  },


  /* =======================================================
     CARGAR APODERADOS
  ======================================================= */

  cargarApoderados: async () => {
    try {
      set({
        cargando: true,
        error: null,
      });

      const res = await listarApoderados();

      const lista = Array.isArray(res.data)
        ? res.data.map(safeEmpleado)
        : [];

      set({
        apoderados: lista,
        cargando: false,
      });

      return lista;

    } catch (err) {

      console.error(
        "Error cargando apoderados:",
        err
      );

      set({
        cargando: false,
        error: err.message || "Error cargando apoderados",
      });

      return [];
    }
  },


  /* =======================================================
     OBTENER EMPLEADO
  ======================================================= */

  obtener: async (id) => {
    try {

      const res = await obtenerEmpleado(id);

      return res.data
        ? safeEmpleado(res.data)
        : null;

    } catch (err) {

      console.error(
        "Error obteniendo empleado:",
        err
      );

      return null;
    }
  },


  /* =======================================================
     OBTENER FICHA COMPLETA
  ======================================================= */

  obtenerFicha: async (id) => {
    try {

      set({
        cargando: true,
        error: null,
      });

      const res = await obtenerFichaCompleta(id);

      const ficha = safeFicha(res.data);

      set({
        empleadoActual: ficha,
        cargando: false,
      });

      return ficha;

    } catch (err) {

      console.error(
        "Error obteniendo ficha completa:",
        err
      );

      set({
        empleadoActual: null,
        cargando: false,
        error:
          err.message ||
          "Error obteniendo ficha del empleado",
      });

      return null;
    }
  },


  /* =======================================================
     CREAR
  ======================================================= */

  crear: async (payload) => {

    const res = await crearEmpleado(payload);

    await get().cargarEmpleados();

    return res.data
      ? safeEmpleado(res.data)
      : null;
  },


  /* =======================================================
     EDITAR
  ======================================================= */

  editar: async (id, payload) => {

    const res = await editarEmpleado(
      id,
      payload
    );

    await get().cargarEmpleados();

    /*
     * Si estamos editando la ficha actualmente abierta,
     * la volvemos a cargar.
     */
    if (
      get().empleadoActual?.empleado?.id === Number(id)
    ) {
      await get().obtenerFicha(id);
    }

    return res.data
      ? safeEmpleado(res.data)
      : null;
  },


  /* =======================================================
     ELIMINAR
  ======================================================= */

  eliminar: async (id) => {

    await eliminarEmpleado(id);

    await get().cargarEmpleados();

    if (
      get().empleadoActual?.empleado?.id === Number(id)
    ) {
      set({
        empleadoActual: null,
      });
    }
  },


  /* =======================================================
     ACTUALIZAR MÓDULOS VISIBLES
  ======================================================= */

  actualizarModulos: async (
    id,
    modulos_visibles_list
  ) => {

    try {

      const res =
        await actualizarModulosVisibles(
          id,
          modulos_visibles_list
        );

      /*
       * Actualizamos ficha si está abierta.
       */
      if (
        get().empleadoActual?.empleado?.id === Number(id)
      ) {
        await get().obtenerFicha(id);
      }

      /*
       * Actualizamos también el listado.
       */
      await get().cargarEmpleados();

      return res.data || null;

    } catch (err) {

      console.error(
        "Error actualizando módulos:",
        err
      );

      set({
        error:
          err.message ||
          "Error actualizando módulos",
      });

      throw err;
    }
  },


  /* =======================================================
     ACTUALIZAR PERMISOS
  ======================================================= */

  actualizarPermisos: async (
    id,
    permisos_modulo_dict
  ) => {

    try {

      const res =
        await actualizarPermisosModulo(
          id,
          permisos_modulo_dict
        );

      /*
       * Actualizar ficha inmediatamente.
       */
      if (
        get().empleadoActual?.empleado?.id === Number(id)
      ) {
        await get().obtenerFicha(id);
      }

      /*
       * Actualizar listado.
       */
      await get().cargarEmpleados();

      return res.data || null;

    } catch (err) {

      console.error(
        "Error actualizando permisos:",
        err
      );

      set({
        error:
          err.message ||
          "Error actualizando permisos",
      });

      throw err;
    }
  },


  /* =======================================================
     LIMPIAR EMPLEADO ACTUAL
  ======================================================= */

  limpiarEmpleadoActual: () => {
    set({
      empleadoActual: null,
    });
  },


  /* =======================================================
     LIMPIAR ERROR
  ======================================================= */

  limpiarError: () => {
    set({
      error: null,
    });
  },
}));
