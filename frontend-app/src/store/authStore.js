import { create } from "zustand";
import { login } from "../api/auth";
import { API_BASE } from "../api/config";

/**
 * =========================================================
 * AUTH STORE — MOLSAN ERP PREMIUM 2027
 * =========================================================
 *
 * Fuente principal de autenticación:
 *
 * POST /api/auth/login
 *
 * El backend devuelve:
 *
 * {
 *   token,
 *   empleado: {
 *      empleado_id,
 *      nombre,
 *      apellidos,
 *      usuario,
 *      foto,
 *      activo,
 *      rol_id,
 *      rol_nombre,
 *      departamento_id,
 *      seccion_id,
 *      cargo_id,
 *      modulos_visibles_list,
 *      permisos_modulo_dict
 *   }
 * }
 *
 * IMPORTANTE:
 * No hacemos una segunda llamada a /empleados/{id}/ficha
 * para obtener los módulos.
 *
 * El login ya los devuelve correctamente.
 * =========================================================
 */


/* =========================================================
   FOTO
========================================================= */

function prepararFoto(foto) {

  if (!foto) {
    return null;
  }

  // Si ya es una URL absoluta
  if (
    foto.startsWith("http://") ||
    foto.startsWith("https://")
  ) {
    return foto;
  }

  return `${API_BASE}${foto}`;
}


/* =========================================================
   NORMALIZAR EMPLEADO
========================================================= */

function normalizarEmpleado(empleado) {

  if (!empleado) {
    return null;
  }

  /*
   * -------------------------------------------------------
   * MÓDULOS
   * -------------------------------------------------------
   */

  let modulos = empleado.modulos_visibles_list;

  if (!Array.isArray(modulos)) {
    modulos = [];
  }


  /*
   * -------------------------------------------------------
   * PERMISOS
   * -------------------------------------------------------
   */

  let permisos = empleado.permisos_modulo_dict;

  if (
    !permisos ||
    typeof permisos !== "object" ||
    Array.isArray(permisos)
  ) {
    permisos = {};
  }


  /*
   * -------------------------------------------------------
   * EMPLEADO NORMALIZADO
   * -------------------------------------------------------
   */

  return {

    ...empleado,

    /*
     * ID PRINCIPAL
     *
     * Backend:
     * empleado_id
     *
     * Mantenemos también id para compatibilidad
     * con componentes antiguos.
     */

    id:
      empleado.id ??
      empleado.empleado_id ??
      null,

    empleado_id:
      empleado.empleado_id ??
      empleado.id ??
      null,


    /*
     * FOTO
     */

    foto: prepararFoto(
      empleado.foto
    ),


    /*
     * MÓDULOS
     */

    modulos_visibles_list:
      modulos,


    /*
     * Alias compatible con código antiguo
     */

    modulos_visibles:
      modulos,


    /*
     * PERMISOS
     */

    permisos_modulo_dict:
      permisos,


    /*
     * Alias compatible con código antiguo
     */

    permisos_modulo:
      permisos
  };
}


/* =========================================================
   STORE
========================================================= */

export const useAuthStore = create(
  (set) => ({

    /*
     * -----------------------------------------------------
     * ESTADO
     * -----------------------------------------------------
     */

    empleado: null,

    token: null,

    loading: true,

    authReady: false,


    /*
     * -----------------------------------------------------
     * MODAL PERFIL
     * -----------------------------------------------------
     */

    perfilModal: null,

    setPerfilModal: (id) => {

      set({
        perfilModal: id
      });

    },


    /*
     * =====================================================
     * HIDRATACIÓN INICIAL
     * =====================================================
     */

    init: async () => {

      const token =
        localStorage.getItem(
          "token"
        );

      const empleadoLS =
        localStorage.getItem(
          "empleado"
        );


      /*
       * ---------------------------------------------------
       * NO HAY SESIÓN
       * ---------------------------------------------------
       */

      if (
        !token ||
        !empleadoLS
      ) {

        set({

          token: null,

          empleado: null,

          loading: false,

          authReady: true

        });

        return;
      }


      /*
       * ---------------------------------------------------
       * RECUPERAR EMPLEADO
       * ---------------------------------------------------
       */

      try {

        const empleadoGuardado =
          JSON.parse(
            empleadoLS
          );


        const empleado =
          normalizarEmpleado(
            empleadoGuardado
          );


        /*
         * Si el empleado guardado no tiene ID
         * consideramos inválida la sesión.
         */

        if (
          !empleado ||
          !empleado.empleado_id
        ) {

          throw new Error(
            "Empleado almacenado inválido"
          );

        }


        /*
         * -------------------------------------------------
         * RESTAURAR SESIÓN
         * -------------------------------------------------
         */

        set({

          token,

          empleado,

          loading: false,

          authReady: true

        });

      }

      catch (error) {

        console.warn(
          "Sesión almacenada inválida. Cerrando sesión.",
          error
        );


        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "empleado"
        );


        set({

          token: null,

          empleado: null,

          loading: false,

          authReady: true

        });

      }

    },


    /*
     * =====================================================
     * INICIAR SESIÓN
     * =====================================================
     */

    iniciarSesion: async (
      usuario,
      password
    ) => {

      try {

        /*
         * -------------------------------------------------
         * LOGIN BACKEND
         * -------------------------------------------------
         */

        const res =
          await login(
            usuario,
            password
          );


        /*
         * -------------------------------------------------
         * COMPROBAR RESPUESTA
         * -------------------------------------------------
         */

        if (
          !res.data ||
          !res.data.token ||
          !res.data.empleado
        ) {

          console.error(
            "Respuesta de login inválida:",
            res.data
          );

          return false;

        }


        /*
         * -------------------------------------------------
         * EMPLEADO DEVUELTO POR BACKEND
         * -------------------------------------------------
         */

        const empleado =
          normalizarEmpleado(
            res.data.empleado
          );


        /*
         * -------------------------------------------------
         * COMPROBAR EMPLEADO
         * -------------------------------------------------
         */

        if (
          !empleado ||
          !empleado.empleado_id
        ) {

          console.error(
            "El backend no ha devuelto un empleado válido:",
            res.data.empleado
          );

          return false;

        }


        /*
         * -------------------------------------------------
         * DEBUG TEMPORAL
         * -------------------------------------------------
         *
         * Esto nos permitirá comprobar en Render/browser
         * que el admin recibe todos los módulos.
         */

        console.log(
          "========================================"
        );

        console.log(
          "LOGIN CORRECTO"
        );

        console.log(
          "USUARIO:",
          empleado.usuario
        );

        console.log(
          "ID:",
          empleado.empleado_id
        );

        console.log(
          "ROL:",
          empleado.rol_id
        );

        console.log(
          "ROL NOMBRE:",
          empleado.rol_nombre
        );

        console.log(
          "MÓDULOS:",
          empleado.modulos_visibles_list
        );

        console.log(
          "PERMISOS:",
          empleado.permisos_modulo_dict
        );

        console.log(
          "========================================"
        );


        /*
         * -------------------------------------------------
         * GUARDAR EN ZUSTAND
         * -------------------------------------------------
         */

        set({

          empleado,

          token:
            res.data.token,

          loading: false,

          authReady: true

        });


        /*
         * -------------------------------------------------
         * GUARDAR SESIÓN
         * -------------------------------------------------
         */

        localStorage.setItem(
          "token",
          res.data.token
        );

        localStorage.setItem(
          "empleado",
          JSON.stringify(
            empleado
          )
        );


        /*
         * -------------------------------------------------
         * OK
         * -------------------------------------------------
         */

        return true;

      }

      catch (error) {

        console.error(
          "ERROR LOGIN:",
          error
        );


        return false;

      }

    },


    /*
     * =====================================================
     * LOGOUT
     * =====================================================
     */

    logout: () => {

      set({

        empleado: null,

        token: null,

        loading: false,

        authReady: true

      });


      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "empleado"
      );

    }

  })
);
