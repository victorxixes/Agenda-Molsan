import { useMemo } from "react";
import { useSeguridadStore } from "../store/seguridadStore";

/**
 * Hook Seguridad — Molsan ERP
 *
 * Versión estabilizada:
 *
 * - No devuelve un objeto nuevo innecesariamente.
 * - Las colecciones normalizadas utilizan useMemo.
 * - Las acciones del Zustand se obtienen directamente del store.
 * - Evita renders innecesarios derivados de filtros/arrays nuevos.
 */

export const useSeguridad = () => {

  // ============================================================
  // DATOS DEL STORE
  // ============================================================

  const rolesStore =
    useSeguridadStore(
      (state) => state.roles
    );

  const permisosStore =
    useSeguridadStore(
      (state) => state.permisos
    );

  const empleadosStore =
    useSeguridadStore(
      (state) => state.empleados
    );

  const auditoriaStore =
    useSeguridadStore(
      (state) => state.auditoria
    );

  const logsStore =
    useSeguridadStore(
      (state) => state.logs
    );

  const fichaStore =
    useSeguridadStore(
      (state) => state.ficha
    );

  const loading =
    useSeguridadStore(
      (state) => state.loading
    );


  // ============================================================
  // ACCIONES
  // ============================================================

  const cargarTodo =
    useSeguridadStore(
      (state) => state.cargarTodo
    );

  const cargarFicha =
    useSeguridadStore(
      (state) => state.cargarFicha
    );

  const asignarRol =
    useSeguridadStore(
      (state) => state.asignarRol
    );

  const asignarPermisos =
    useSeguridadStore(
      (state) => state.asignarPermisos
    );

  const asignarModulos =
    useSeguridadStore(
      (state) => state.asignarModulos
    );

  const resetPassword =
    useSeguridadStore(
      (state) => state.resetPassword
    );

  const bloquear =
    useSeguridadStore(
      (state) => state.bloquear
    );

  const desbloquear =
    useSeguridadStore(
      (state) => state.desbloquear
    );


  // ============================================================
  // LIMPIEZA DE ROLES
  // ============================================================

  const roles = useMemo(() => {

    if (!Array.isArray(rolesStore)) {
      return [];
    }

    return rolesStore.filter(
      (rol) =>
        rol &&
        typeof rol === "object" &&
        typeof rol.id !== "undefined" &&
        typeof rol.nombre === "string"
    );

  }, [rolesStore]);


  // ============================================================
  // LIMPIEZA DE PERMISOS
  // ============================================================

  const permisos = useMemo(() => {

    if (!Array.isArray(permisosStore)) {
      return [];
    }

    return permisosStore.filter(
      (permiso) =>
        permiso &&
        typeof permiso === "object" &&
        typeof permiso.modulo === "string" &&
        typeof permiso.permiso === "string"
    );

  }, [permisosStore]);


  // ============================================================
  // LIMPIEZA DE EMPLEADOS
  // ============================================================

  const empleados = useMemo(() => {

    if (!Array.isArray(empleadosStore)) {
      return [];
    }

    return empleadosStore.filter(
      (empleado) =>
        empleado &&
        typeof empleado === "object" &&
        typeof empleado.id === "number" &&
        typeof empleado.nombre === "string"
    );

  }, [empleadosStore]);


  // ============================================================
  // LIMPIEZA DE AUDITORÍA
  // ============================================================

  const auditoria = useMemo(() => {

    if (!Array.isArray(auditoriaStore)) {
      return [];
    }

    return auditoriaStore.filter(
      (registro) =>
        registro &&
        typeof registro === "object" &&
        typeof registro.id !== "undefined" &&
        typeof registro.fecha === "string" &&
        typeof registro.accion === "string" &&
        typeof registro.descripcion === "string" &&
        typeof registro.usuario === "string"
    );

  }, [auditoriaStore]);


  // ============================================================
  // LIMPIEZA DE LOGS
  // ============================================================

  const logs = useMemo(() => {

    if (!Array.isArray(logsStore)) {
      return [];
    }

    return logsStore.filter(
      (log) =>
        log &&
        typeof log === "object" &&
        typeof log.id !== "undefined" &&
        typeof log.fecha === "string" &&
        typeof log.evento === "string" &&
        typeof log.detalle === "string"
    );

  }, [logsStore]);


  // ============================================================
  // LIMPIEZA DE FICHA
  // ============================================================

  const ficha = useMemo(() => {

    if (
      !fichaStore ||
      typeof fichaStore !== "object" ||
      !fichaStore.empleado ||
      typeof fichaStore.empleado !== "object"
    ) {
      return null;
    }

    const empleado =
      fichaStore.empleado;


    const permisosModulo =
      fichaStore.permisos_modulo_dict;


    return {

      ...fichaStore,

      empleado: {

        ...empleado,

        id: Number(
          empleado.id
        ),

        nombre:
          empleado.nombre || "",

        usuario:
          empleado.usuario || "",

        apellidos:
          empleado.apellidos || "",

        dni:
          empleado.dni || "",

        email_empresa:
          empleado.email_empresa || "",

        activo:
          Boolean(
            empleado.activo
          ),

        rol_nombre:
          empleado.rol_nombre || "",

        foto:
          typeof empleado.foto === "string"
            ? empleado.foto
            : null,

        modulos_visibles_list:
          Array.isArray(
            empleado.modulos_visibles_list
          )
            ? empleado.modulos_visibles_list.filter(
                (modulo) =>
                  typeof modulo === "string"
              )
            : [],
      },

      permisos_modulo_dict:
        permisosModulo &&
        typeof permisosModulo === "object" &&
        !Array.isArray(permisosModulo)

          ? Object.fromEntries(

              Object.entries(
                permisosModulo
              ).map(
                ([modulo, lista]) => [

                  modulo,

                  Array.isArray(lista)
                    ? lista.filter(
                        (permiso) =>
                          typeof permiso === "string"
                      )
                    : [],

                ]
              )

            )

          : {},
    };

  }, [fichaStore]);


  // ============================================================
  // DEVOLVER API DEL HOOK
  // ============================================================

  return {

    roles,

    permisos,

    empleados,

    auditoria,

    logs,

    ficha,

    loading,

    cargarTodo,

    cargarFicha,

    asignarRol,

    asignarPermisos,

    asignarModulos,

    resetPassword,

    bloquear,

    desbloquear,

  };
};
