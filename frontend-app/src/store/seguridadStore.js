import { create } from "zustand";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;


// ============================================================
// HELPERS
// ============================================================

const safeString = (valor, fallback = "") => {
  if (valor === null || valor === undefined) {
    return fallback;
  }

  if (typeof valor === "string") {
    return valor;
  }

  if (
    typeof valor === "number" ||
    typeof valor === "boolean"
  ) {
    return String(valor);
  }

  try {
    return JSON.stringify(valor);
  } catch {
    return fallback;
  }
};


const safeNumber = (valor, fallback = 0) => {
  const numero = Number(valor);

  return Number.isFinite(numero)
    ? numero
    : fallback;
};


const safeNullableNumber = (valor) => {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return null;
  }

  const numero = Number(valor);

  return Number.isFinite(numero)
    ? numero
    : null;
};


const safeBoolean = (valor) => {
  if (typeof valor === "boolean") {
    return valor;
  }

  if (typeof valor === "number") {
    return valor !== 0;
  }

  if (typeof valor === "string") {
    const normalizado = valor
      .trim()
      .toLowerCase();

    if (
      normalizado === "false" ||
      normalizado === "0" ||
      normalizado === "no" ||
      normalizado === ""
    ) {
      return false;
    }

    if (
      normalizado === "true" ||
      normalizado === "1" ||
      normalizado === "si" ||
      normalizado === "sí"
    ) {
      return true;
    }
  }

  return Boolean(valor);
};


const safeArrayStrings = (valor) => {
  if (!Array.isArray(valor)) {
    return [];
  }

  return valor
    .filter(
      (item) =>
        typeof item === "string"
    )
    .map(
      (item) =>
        item.trim()
    )
    .filter(Boolean);
};


const safePermisosDict = (valor) => {
  if (
    !valor ||
    typeof valor !== "object" ||
    Array.isArray(valor)
  ) {
    return {};
  }

  const resultado = {};

  Object.entries(valor).forEach(
    ([modulo, permisos]) => {
      if (typeof modulo !== "string") {
        return;
      }

      resultado[modulo] =
        safeArrayStrings(permisos);
    }
  );

  return resultado;
};


// ============================================================
// NORMALIZAR ROL
// ============================================================

const normalizarRol = (rol) => {
  if (
    !rol ||
    typeof rol !== "object"
  ) {
    return null;
  }

  return {
    ...rol,

    id:
      rol.id !== undefined &&
      rol.id !== null
        ? safeNumber(rol.id, null)
        : null,

    nombre: safeString(
      rol.nombre
    ),
  };
};


// ============================================================
// NORMALIZAR EMPLEADO
// ============================================================

const normalizarEmpleado = (
  empleado,
  rol = null,
  modulosVisibles = []
) => {
  if (
    !empleado ||
    typeof empleado !== "object"
  ) {
    return null;
  }

  const rolNormalizado =
    normalizarRol(rol);

  return {
    ...empleado,

    id: safeNumber(
      empleado.id
    ),

    nombre: safeString(
      empleado.nombre
    ),

    apellidos: safeString(
      empleado.apellidos
    ),

    dni: safeString(
      empleado.dni
    ),

    telefono: safeString(
      empleado.telefono
    ),

    email_personal: safeString(
      empleado.email_personal
    ),

    email_empresa: safeString(
      empleado.email_empresa
    ),

    extension: safeString(
      empleado.extension
    ),

    usuario: safeString(
      empleado.usuario
    ),

    direccion: safeString(
      empleado.direccion
    ),

    codigo_postal: safeString(
      empleado.codigo_postal
    ),

    poblacion: safeString(
      empleado.poblacion
    ),

    provincia: safeString(
      empleado.provincia
    ),

    fecha_nacimiento:
      empleado.fecha_nacimiento ?? null,

    alergias: safeString(
      empleado.alergias
    ),

    persona_contacto: safeString(
      empleado.persona_contacto
    ),

    telefono_contacto: safeString(
      empleado.telefono_contacto
    ),

    observaciones: safeString(
      empleado.observaciones
    ),

    activo: safeBoolean(
      empleado.activo
    ),

    foto:
      typeof empleado.foto === "string" &&
      empleado.foto.trim()
        ? empleado.foto
        : null,

    departamento_id:
      safeNullableNumber(
        empleado.departamento_id
      ),

    seccion_id:
      safeNullableNumber(
        empleado.seccion_id
      ),

    cargo_id:
      safeNullableNumber(
        empleado.cargo_id
      ),

    rol_id:
      rolNormalizado?.id ??
      safeNullableNumber(
        empleado.rol_id
      ),

    rol_nombre:
      rolNormalizado?.nombre ||
      safeString(
        empleado.rol_nombre
      ),

    // Compatibilidad con SeguridadFicha
    modulos_visibles_list:
      safeArrayStrings(
        modulosVisibles
      ),
  };
};


// ============================================================
// NORMALIZAR LOG
// ============================================================

const normalizarLog = (log) => {
  if (
    !log ||
    typeof log !== "object"
  ) {
    return null;
  }

  return {
    id:
      log.id !== undefined &&
      log.id !== null
        ? log.id
        : null,

    fecha: safeString(
      log.fecha
    ),

    evento: safeString(
      log.evento
    ),

    detalle: safeString(
      log.detalle
    ),

    ip: safeString(
      log.ip
    ),
  };
};


// ============================================================
// NORMALIZAR AUDITORÍA
// ============================================================

const normalizarAuditoria = (
  registro
) => {
  if (
    !registro ||
    typeof registro !== "object"
  ) {
    return null;
  }

  return {
    id:
      registro.id !== undefined &&
      registro.id !== null
        ? registro.id
        : null,

    fecha: safeString(
      registro.fecha
    ),

    usuario: safeString(
      registro.usuario
    ),

    modulo: safeString(
      registro.modulo
    ),

    accion: safeString(
      registro.accion
    ),

    descripcion: safeString(
      registro.descripcion
    ),
  };
};


// ============================================================
// NORMALIZAR PERMISO
// ============================================================

const normalizarPermiso = (
  permiso
) => {
  if (
    !permiso ||
    typeof permiso !== "object"
  ) {
    return null;
  }

  return {
    ...permiso,

    id:
      permiso.id !== undefined &&
      permiso.id !== null
        ? permiso.id
        : null,

    modulo: safeString(
      permiso.modulo
    ),

    permiso: safeString(
      permiso.permiso
    ),
  };
};


// ============================================================
// STORE
// ============================================================

export const useSeguridadStore =
  create((set, get) => ({

    // ========================================================
    // ESTADO
    // ========================================================

    roles: [],

    permisos: [],

    empleados: [],

    ficha: null,

    auditoria: [],

    logs: [],

    loading: false,


    // ========================================================
    // CARGAR TODO
    // ========================================================

    cargarTodo: async () => {
      set({
        loading: true,
      });

      try {
        const [
          rolesRes,
          permisosRes,
          empleadosRes,
          auditoriaRes,
          logsRes,
        ] = await Promise.all([
          axios.get(
            `${API}/seguridad/roles`
          ),

          axios.get(
            `${API}/seguridad/permisos`
          ),

          axios.get(
            `${API}/empleados`
          ),

          axios.get(
            `${API}/seguridad/auditoria`
          ),

          axios.get(
            `${API}/seguridad/logs`
          ),
        ]);


        const rolesData =
          Array.isArray(
            rolesRes.data
          )
            ? rolesRes.data
            : [];


        const permisosData =
          Array.isArray(
            permisosRes.data
          )
            ? permisosRes.data
            : [];


        const empleadosData =
          Array.isArray(
            empleadosRes.data
          )
            ? empleadosRes.data
            : Array.isArray(
                empleadosRes.data?.empleados
              )
              ? empleadosRes.data.empleados
              : [];


        const auditoriaData =
          Array.isArray(
            auditoriaRes.data
          )
            ? auditoriaRes.data
            : [];


        const logsData =
          Array.isArray(
            logsRes.data
          )
            ? logsRes.data
            : [];


        set({
          roles:
            rolesData
              .map(normalizarRol)
              .filter(Boolean),

          permisos:
            permisosData
              .map(normalizarPermiso)
              .filter(
                (permiso) =>
                  permiso.modulo &&
                  permiso.permiso
              ),

          empleados:
            empleadosData
              .map(
                (empleado) =>
                  normalizarEmpleado(
                    empleado
                  )
              )
              .filter(Boolean),

          auditoria:
            auditoriaData
              .map(
                normalizarAuditoria
              )
              .filter(Boolean),

          logs:
            logsData
              .map(normalizarLog)
              .filter(Boolean),

          loading: false,
        });

      } catch (error) {
        console.error(
          "SEGURIDAD — ERROR CARGANDO DATOS:",
          error
        );

        set({
          loading: false,
        });
      }
    },


    // ========================================================
    // CARGAR FICHA COMPLETA
    // ========================================================

    cargarFicha: async (
      empleadoId
    ) => {
      if (
        empleadoId === null ||
        empleadoId === undefined
      ) {
        return;
      }

      try {
        const res =
          await axios.get(
            `${API}/seguridad/empleado/${empleadoId}/ficha-completa`
          );

        const data =
          res.data &&
          typeof res.data === "object"
            ? res.data
            : {};


        // ----------------------------------------------------
        // ROL
        // ----------------------------------------------------

        const rol =
          normalizarRol(
            data.empleado?.rol
          );


        // ----------------------------------------------------
        // MÓDULOS
        // ----------------------------------------------------

        const modulosVisibles =
          safeArrayStrings(
            data.modulos_visibles
          );


        // ----------------------------------------------------
        // PERMISOS
        //
        // Backend devuelve:
        // permisos_modulo
        //
        // El frontend mantiene:
        // permisos_modulo_dict
        // ----------------------------------------------------

        const permisosModulo =
          safePermisosDict(
            data.permisos_modulo
          );


        // ----------------------------------------------------
        // EMPLEADO
        // ----------------------------------------------------

        const empleado =
          normalizarEmpleado(
            data.empleado,
            rol,
            modulosVisibles
          );


        // ----------------------------------------------------
        // AUDITORÍA
        // ----------------------------------------------------

        const auditoria =
          Array.isArray(
            data.auditoria
          )
            ? data.auditoria
                .map(
                  normalizarAuditoria
                )
                .filter(Boolean)
            : [];


        // ----------------------------------------------------
        // GUARDAR FICHA NORMALIZADA
        // ----------------------------------------------------

        set({
          ficha: {
            ...data,

            empleado,

            rol,

            modulos_visibles:
              modulosVisibles,

            permisos_modulo_dict:
              permisosModulo,

            auditoria,
          },

          auditoria,

        });

      } catch (error) {
        console.error(
          "SEGURIDAD — ERROR CARGANDO FICHA:",
          error
        );

        set({
          ficha: null,
        });
      }
    },


    // ========================================================
    // ASIGNAR ROL
    // ========================================================
    //
    // BACKEND:
    //
    // POST
    // /seguridad/asignar/empleado/{empleado_id}/rol/{rol_id}
    //
    // ========================================================

    asignarRol: async (
      empleadoId,
      rolId
    ) => {
      if (
        empleadoId === null ||
        empleadoId === undefined ||
        rolId === null ||
        rolId === undefined
      ) {
        return;
      }

      try {
        await axios.post(
          `${API}/seguridad/asignar/empleado/${empleadoId}/rol/${rolId}`
        );

        await get().cargarFicha(
          empleadoId
        );

      } catch (error) {
        console.error(
          "SEGURIDAD — ERROR ASIGNANDO ROL:",
          error
        );

        throw error;
      }
    },


    // ========================================================
    // ASIGNAR PERMISOS
    // ========================================================

    asignarPermisos: async (
      empleadoId,
      permisos
    ) => {
      if (
        empleadoId === null ||
        empleadoId === undefined
      ) {
        return;
      }

      try {
        await axios.post(
          `${API}/seguridad/asignar/empleado/${empleadoId}/permisos`,
          permisos
        );

        await get().cargarFicha(
          empleadoId
        );

      } catch (error) {
        console.error(
          "SEGURIDAD — ERROR ASIGNANDO PERMISOS:",
          error
        );

        throw error;
      }
    },


    // ========================================================
    // ASIGNAR MÓDULOS
    // ========================================================

    asignarModulos: async (
      empleadoId,
      modulos
    ) => {
      if (
        empleadoId === null ||
        empleadoId === undefined
      ) {
        return;
      }

      try {
        await axios.post(
          `${API}/seguridad/asignar/empleado/${empleadoId}/modulos`,
          modulos
        );

        await get().cargarFicha(
          empleadoId
        );

      } catch (error) {
        console.error(
          "SEGURIDAD — ERROR ASIGNANDO MÓDULOS:",
          error
        );

        throw error;
      }
    },


    // ========================================================
    // RESET PASSWORD
    // ========================================================

    resetPassword: async (
      empleadoId,
      nuevaPassword
    ) => {
      if (
        empleadoId === null ||
        empleadoId === undefined ||
        !nuevaPassword
      ) {
        return;
      }

      try {
        await axios.post(
          `${API}/seguridad/asignar/empleado/${empleadoId}/password`,
          {
            nueva_password:
              nuevaPassword,
          }
        );

      } catch (error) {
        console.error(
          "SEGURIDAD — ERROR RESETEANDO PASSWORD:",
          error
        );

        throw error;
      }
    },


    // ========================================================
    // BLOQUEAR
    // ========================================================

    bloquear: async (
      empleadoId
    ) => {
      if (
        empleadoId === null ||
        empleadoId === undefined
      ) {
        return;
      }

      try {
        await axios.post(
          `${API}/seguridad/asignar/empleado/${empleadoId}/bloquear`
        );

        await get().cargarTodo();

        await get().cargarFicha(
          empleadoId
        );

      } catch (error) {
        console.error(
          "SEGURIDAD — ERROR BLOQUEANDO EMPLEADO:",
          error
        );

        throw error;
      }
    },


    // ========================================================
    // DESBLOQUEAR
    // ========================================================

    desbloquear: async (
      empleadoId
    ) => {
      if (
        empleadoId === null ||
        empleadoId === undefined
      ) {
        return;
      }

      try {
        await axios.post(
          `${API}/seguridad/asignar/empleado/${empleadoId}/desbloquear`
        );

        await get().cargarTodo();

        await get().cargarFicha(
          empleadoId
        );

      } catch (error) {
        console.error(
          "SEGURIDAD — ERROR DESBLOQUEANDO EMPLEADO:",
          error
        );

        throw error;
      }
    },

  }));
