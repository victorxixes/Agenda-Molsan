import { create } from "zustand";

import {
  listarEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  editarEmpleado,
  eliminarEmpleado,
  listarApoderados,
} from "../api/empleados";


const safe = (valor) => {

  if (
    valor === null ||
    valor === undefined
  ) {
    return "-";
  }

  if (
    typeof valor === "object"
  ) {

    try {
      return JSON.stringify(valor);
    } catch {
      return "-";
    }
  }

  return String(valor);
};


const safeEmpleado = (empleado) => {

  if (!empleado) {
    return null;
  }

  return {
    ...empleado,

    id: Number(
      empleado.id
    ),

    nombre: safe(
      empleado.nombre
    ),

    apellidos: safe(
      empleado.apellidos
    ),

    telefono: safe(
      empleado.telefono
    ),

    email_empresa: safe(
      empleado.email_empresa
    ),

    extension: safe(
      empleado.extension
    ),

    activo: Boolean(
      empleado.activo
    ),

    departamento_nombre:
      safe(
        empleado.departamento_nombre
      ),

    seccion_nombre:
      safe(
        empleado.seccion_nombre
      ),

    cargo_nombre:
      safe(
        empleado.cargo_nombre
      ),

    foto: safe(
      empleado.foto
    ),

    usuario: safe(
      empleado.usuario
    ),
  };
};


export const useEmpleadosStore = create(
  (set, get) => ({

    empleados: [],

    apoderados: [],

    cargando: false,

    error: null,


    // =====================================================
    // EMPLEADOS
    // =====================================================

    cargarEmpleados: async () => {

      try {

        set({
          cargando: true,
          error: null,
        });

        const res =
          await listarEmpleados();

        const lista =
          Array.isArray(res.data)
            ? res.data.map(
                safeEmpleado
              )
            : [];

        set({
          empleados: lista,
          cargando: false,
        });

      } catch (err) {

        console.error(
          "Error cargando empleados:",
          err
        );

        set({
          cargando: false,
          error:
            err?.response?.data?.detail ||
            err?.message ||
            "Error cargando empleados",
        });
      }
    },


    // =====================================================
    // APODERADOS
    // =====================================================

    cargarApoderados: async () => {

      try {

        set({
          cargando: true,
          error: null,
        });

        const res =
          await listarApoderados();

        const lista =
          Array.isArray(res.data)
            ? res.data.map(
                safeEmpleado
              )
            : [];

        set({
          apoderados: lista,
          cargando: false,
        });

      } catch (err) {

        console.error(
          "Error cargando apoderados:",
          err
        );

        set({
          cargando: false,
          error:
            err?.response?.data?.detail ||
            err?.message ||
            "Error cargando apoderados",
        });
      }
    },


    // =====================================================
    // OBTENER
    // =====================================================

    obtener: async (id) => {

      try {

        const res =
          await obtenerEmpleado(id);

        return res.data
          ? safeEmpleado(
              res.data
            )
          : null;

      } catch (err) {

        console.error(
          "Error obteniendo empleado:",
          err
        );

        return null;
      }
    },


    // =====================================================
    // CREAR
    // =====================================================

    crear: async (payload) => {

      const res =
        await crearEmpleado(
          payload
        );

      await get()
        .cargarEmpleados();

      return res.data
        ? safeEmpleado(
            res.data
          )
        : null;
    },


    // =====================================================
    // EDITAR
    // =====================================================

    editar: async (
      id,
      payload
    ) => {

      const res =
        await editarEmpleado(
          id,
          payload
        );

      await get()
        .cargarEmpleados();

      return res.data
        ? safeEmpleado(
            res.data
          )
        : null;
    },


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar: async (id) => {

      await eliminarEmpleado(
        id
      );

      await get()
        .cargarEmpleados();
    },
  })
);
