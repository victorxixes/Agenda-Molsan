import { useMemo } from "react";
import { useSeguridadStore } from "../store/seguridadStore";

/**
 * ============================================================
 * HOOK SEGURIDAD — MOLSAN ERP SAAS PREMIUM 2027
 * ============================================================
 *
 * Capa intermedia entre los componentes React y Zustand.
 *
 * Responsabilidades:
 *
 * - Leer datos del store.
 * - Normalizar datos para los componentes.
 * - Exponer todas las acciones de seguridad.
 * - No realizar peticiones automáticamente.
 *
 * IMPORTANTE:
 *
 * La carga general mediante cargarTodo() debe realizarse
 * desde el componente padre de Seguridad.
 *
 * La ficha individual puede solicitarse mediante cargarFicha()
 * cuando un componente necesita consultar un empleado concreto.
 * ============================================================
 */


/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

const arraySeguro = (valor) =>
  Array.isArray(valor)
    ? valor
    : [];


const textoSeguro = (
  valor,
  fallback = ""
) => {

  if (
    valor === null ||
    typeof valor === "undefined"
  ) {
    return fallback;
  }

  return String(valor);
};


const numeroSeguro = (
  valor,
  fallback = null
) => {

  if (
    valor === null ||
    typeof valor === "undefined" ||
    valor === ""
  ) {
    return fallback;
  }

  const numero =
    Number(valor);

  return Number.isFinite(numero)
    ? numero
    : fallback;
};


const booleanoSeguro = (
  valor,
  fallback = false
) => {

  if (
    typeof valor === "boolean"
  ) {
    return valor;
  }

  if (
    typeof valor === "number"
  ) {
    return valor !== 0;
  }

  if (
    typeof valor === "string"
  ) {

    const normalizado =
      valor
        .trim()
        .toLowerCase();

    if (
      [
        "false",
        "0",
        "no",
        "off",
        "",
      ].includes(normalizado)
    ) {
      return false;
    }

    if (
      [
        "true",
        "1",
        "si",
        "sí",
        "on",
      ].includes(normalizado)
    ) {
      return true;
    }

  }

  return fallback;
};


/**
 * ============================================================
 * HOOK
 * ============================================================
 */

export const useSeguridad = () => {

  // ==========================================================
  // DATOS DEL STORE
  // ==========================================================

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


  const fichaAuditoriaStore =
    useSeguridadStore(
      (state) => state.fichaAuditoria
    );


  const loading =
    useSeguridadStore(
      (state) => state.loading
    );


  const loadingFicha =
    useSeguridadStore(
      (state) => state.loadingFicha
    );


  const errorStore =
    useSeguridadStore(
      (state) => state.error
    );


  // ==========================================================
  // ACCIONES
  // ==========================================================

  const cargarTodo =
    useSeguridadStore(
      (state) => state.cargarTodo
    );


  const cargarRoles =
    useSeguridadStore(
      (state) => state.cargarRoles
    );


  const cargarFicha =
    useSeguridadStore(
      (state) => state.cargarFicha
    );


  const limpiarFicha =
    useSeguridadStore(
      (state) => state.limpiarFicha
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


  // ==========================================================
  // ROLES
  // ==========================================================

  const roles =
    useMemo(() => {

      return arraySeguro(
        rolesStore
      )
        .filter(
          (rol) =>
            rol &&
            typeof rol === "object"
        )
        .map(
          (rol) => ({

            ...rol,

            id:
              numeroSeguro(
                rol.id,
                null
              ),

            nombre:
              textoSeguro(
                rol.nombre ??
                rol.name
              ),

            descripcion:
              textoSeguro(
                rol.descripcion
              ),

          })
        )
        .filter(
          (rol) =>
            rol.nombre.trim() !== ""
        );

    }, [
      rolesStore,
    ]);


  // ==========================================================
  // PERMISOS
  // ==========================================================

  const permisos =
    useMemo(() => {

      return arraySeguro(
        permisosStore
      )
        .filter(
          (permiso) =>
            permiso &&
            typeof permiso === "object"
        )
        .map(
          (permiso) => ({

            ...permiso,

            id:
              numeroSeguro(
                permiso.id,
                null
              ),

            modulo:
              textoSeguro(
                permiso.modulo ??
                permiso.module
              ),

            permiso:
              textoSeguro(
                permiso.permiso ??
                permiso.nombre ??
                permiso.permission
              ),

          })
        )
        .filter(
          (permiso) =>
            permiso.modulo.trim() !== "" &&
            permiso.permiso.trim() !== ""
        );

    }, [
      permisosStore,
    ]);


  // ==========================================================
  // EMPLEADOS
  // ==========================================================

  const empleados =
    useMemo(() => {

      return arraySeguro(
        empleadosStore
      )
        .filter(
          (empleado) =>
            empleado &&
            typeof empleado === "object"
        )
        .map(
          (empleado) => ({

            ...empleado,

            id:
              numeroSeguro(
                empleado.id,
                null
              ),

            nombre:
              textoSeguro(
                empleado.nombre ??
                empleado.name
              ),

            usuario:
              textoSeguro(
                empleado.usuario ??
                empleado.username
              ),

            apellidos:
              textoSeguro(
                empleado.apellidos
              ),

            dni:
              textoSeguro(
                empleado.dni
              ),

            email_empresa:
              textoSeguro(
                empleado.email_empresa ??
                empleado.email
              ),

            activo:
              booleanoSeguro(
                empleado.activo,
                true
              ),

          })
        );

    }, [
      empleadosStore,
    ]);


  // ==========================================================
  // AUDITORÍA GLOBAL
  // ==========================================================

  const auditoria =
    useMemo(() => {

      return arraySeguro(
        auditoriaStore
      )
        .filter(
          (registro) =>
            registro &&
            typeof registro === "object"
        )
        .map(
          (registro) => ({

            ...registro,

            id:
              numeroSeguro(
                registro.id,
                null
              ),

            fecha:
              textoSeguro(
                registro.fecha ??
                registro.created_at ??
                registro.fecha_creacion
              ),

            accion:
              textoSeguro(
                registro.accion ??
                registro.evento ??
                registro.action
              ),

            descripcion:
              textoSeguro(
                registro.descripcion ??
                registro.detalle ??
                registro.description
              ),

            usuario:
              textoSeguro(
                registro.usuario ??
                registro.username ??
                registro.usuario_nombre
              ),

            modulo:
              textoSeguro(
                registro.modulo ??
                registro.module
              ),

          })
        );

    }, [
      auditoriaStore,
    ]);


  // ==========================================================
  // AUDITORÍA DE LA FICHA
  // ==========================================================

  const fichaAuditoria =
    useMemo(() => {

      return arraySeguro(
        fichaAuditoriaStore
      )
        .filter(
          (registro) =>
            registro &&
            typeof registro === "object"
        )
        .map(
          (registro) => ({

            ...registro,

            id:
              numeroSeguro(
                registro.id,
                null
              ),

            fecha:
              textoSeguro(
                registro.fecha ??
                registro.created_at ??
                registro.fecha_creacion
              ),

            accion:
              textoSeguro(
                registro.accion ??
                registro.evento ??
                registro.action
              ),

            descripcion:
              textoSeguro(
                registro.descripcion ??
                registro.detalle ??
                registro.description
              ),

            usuario:
              textoSeguro(
                registro.usuario ??
                registro.username ??
                registro.usuario_nombre
              ),

            modulo:
              textoSeguro(
                registro.modulo ??
                registro.module
              ),

          })
        );

    }, [
      fichaAuditoriaStore,
    ]);


  // ==========================================================
  // LOGS
  // ==========================================================

  const logs =
    useMemo(() => {

      return arraySeguro(
        logsStore
      )
        .filter(
          (log) =>
            log &&
            typeof log === "object"
        )
        .map(
          (log) => ({

            ...log,

            id:
              numeroSeguro(
                log.id,
                null
              ),

            fecha:
              textoSeguro(
                log.fecha ??
                log.created_at ??
                log.fecha_creacion
              ),

            evento:
              textoSeguro(
                log.evento ??
                log.event ??
                log.accion
              ),

            detalle:
              textoSeguro(
                log.detalle ??
                log.descripcion ??
                log.message ??
                log.mensaje
              ),

            ip:
              textoSeguro(
                log.ip ??
                log.ip_address
              ),

            usuario:
              textoSeguro(
                log.usuario ??
                log.username
              ),

            modulo:
              textoSeguro(
                log.modulo ??
                log.module
              ),

            nivel:
              textoSeguro(
                log.nivel ??
                log.level ??
                log.severidad ??
                "INFO"
              ).toUpperCase(),

          })
        );

    }, [
      logsStore,
    ]);


  // ==========================================================
  // FICHA DEL EMPLEADO
  // ==========================================================

  const ficha =
    useMemo(() => {

      if (
        !fichaStore ||
        typeof fichaStore !== "object"
      ) {
        return null;
      }


      const empleadoOriginal =
        fichaStore.empleado;


      if (
        !empleadoOriginal ||
        typeof empleadoOriginal !== "object"
      ) {

        return {

          ...fichaStore,

          empleado: null,

          modulos_visibles: [],

          permisos_modulo: {},

          permisos_modulo_dict: {},

        };

      }


      const permisosModulo =
        fichaStore.permisos_modulo_dict ??
        fichaStore.permisos_modulo ??
        fichaStore.permisos ??
        {};


      const modulosVisibles =
        fichaStore.modulos_visibles ??
        fichaStore.modulos_visibles_list ??
        empleadoOriginal.modulos_visibles_list ??
        empleadoOriginal.modulos_visibles ??
        [];


      const rolOriginal =
        empleadoOriginal.rol &&
        typeof empleadoOriginal.rol === "object"
          ? empleadoOriginal.rol
          : null;


      const empleadoNormalizado = {

        ...empleadoOriginal,

        id:
          numeroSeguro(
            empleadoOriginal.id,
            null
          ),

        nombre:
          textoSeguro(
            empleadoOriginal.nombre
          ),

        usuario:
          textoSeguro(
            empleadoOriginal.usuario
          ),

        apellidos:
          textoSeguro(
            empleadoOriginal.apellidos
          ),

        dni:
          textoSeguro(
            empleadoOriginal.dni
          ),

        email_empresa:
          textoSeguro(
            empleadoOriginal.email_empresa ??
            empleadoOriginal.email
          ),

        activo:
          booleanoSeguro(
            empleadoOriginal.activo,
            true
          ),

        foto:
          typeof empleadoOriginal.foto === "string" &&
          empleadoOriginal.foto.trim() !== ""
            ? empleadoOriginal.foto
            : null,

        rol_nombre:
          textoSeguro(
            empleadoOriginal.rol_nombre ??
            empleadoOriginal.rol?.nombre ??
            empleadoOriginal.rol
          ),

        rol:
          rolOriginal
            ? {
                id:
                  numeroSeguro(
                    rolOriginal.id,
                    null
                  ),

                nombre:
                  textoSeguro(
                    rolOriginal.nombre
                  ),
              }
            : null,

        modulos_visibles_list:
          arraySeguro(
            modulosVisibles
          ).filter(
            (modulo) =>
              typeof modulo === "string" &&
              modulo.trim() !== ""
          ),

      };


      const permisosNormalizados =
        permisosModulo &&
        typeof permisosModulo === "object" &&
        !Array.isArray(permisosModulo)

          ? Object.fromEntries(

              Object.entries(
                permisosModulo
              ).map(
                ([modulo, lista]) => [

                  modulo,

                  arraySeguro(
                    lista
                  )
                    .filter(
                      (permiso) =>
                        typeof permiso === "string"
                    )
                    .map(
                      (permiso) =>
                        permiso.trim()
                    )
                    .filter(Boolean),

                ]
              )

            )

          : {};


      return {

        ...fichaStore,

        empleado:
          empleadoNormalizado,

        modulos_visibles:
          empleadoNormalizado.modulos_visibles_list,

        permisos_modulo:
          permisosNormalizados,

        permisos_modulo_dict:
          permisosNormalizados,

      };

    }, [
      fichaStore,
    ]);


  // ==========================================================
  // API PÚBLICA DEL HOOK
  // ==========================================================

  return {

    // Datos globales
    roles,
    permisos,
    empleados,
    auditoria,
    logs,

    // Ficha
    ficha,
    fichaAuditoria,

    // Estado
    loading,
    loadingFicha,
    error: errorStore,

    // Cargas
    cargarTodo,
    cargarRoles,
    cargarFicha,
    limpiarFicha,

    // Seguridad
    asignarRol,
    asignarPermisos,
    asignarModulos,
    resetPassword,
    bloquear,
    desbloquear,

  };

};
