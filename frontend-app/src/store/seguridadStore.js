import { create } from "zustand";
import axios from "../api/axios";

const API = import.meta.env.VITE_API_URL;


// ============================================================
// HELPERS SEGUROS
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

      if (
        typeof modulo !== "string"
      ) {
        return;
      }

      resultado[modulo] =
        safeArrayStrings(
          permisos
        );
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
        ? safeNumber(rol.id)
        : null,

    nombre: safeString(
      rol.nombre
    ),
  };
};


// ============================================================
// NORMALIZAR PERMISO
// ============================================================

const normalizarPermiso = (permiso) => {
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
// NORMALIZAR EMPLEADO
// ============================================================

const normalizarEmpleado = (
  empleado,
  extras = {}
) => {

  if (
    !empleado ||
    typeof empleado !== "object"
  ) {
    return null;
  }

  const rol =
    empleado.rol &&
    typeof empleado.rol === "object"
      ? empleado.rol
      : null;

  const rolId =
    empleado.rol_id !== undefined &&
    empleado.rol_id !== null
      ? safeNumber(
          empleado.rol_id,
          null
        )
      : rol?.id !== undefined &&
        rol?.id !== null
        ? safeNumber(
            rol.id,
            null
          )
        : null;

  const rolNombre =
    empleado.rol_nombre ||
    rol?.nombre ||
    "";

  const modulos =
    Array.isArray(
      empleado.modulos_visibles_list
    )
      ? empleado.modulos_visibles_list
      : Array.isArray(
          extras.modulos_visibles
        )
        ? extras.modulos_visibles
        : [];

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

    persona_contacto:
      safeString(
        empleado.persona_contacto
      ),

    telefono_contacto:
      safeString(
        empleado.telefono_contacto
      ),

    observaciones:
      safeString(
        empleado.observaciones
      ),

    foto:
      typeof empleado.foto === "string" &&
      empleado.foto.trim()
        ? empleado.foto
        : null,

    departamento_id:
      empleado.departamento_id === null ||
      empleado.departamento_id === undefined
        ? null
        : safeNumber(
            empleado.departamento_id,
            null
          ),

    departamento_nombre:
      safeString(
        empleado.departamento_nombre
      ),

    seccion_id:
      empleado.seccion_id === null ||
      empleado.seccion_id === undefined
        ? null
        : safeNumber(
            empleado.seccion_id,
            null
          ),

    seccion_nombre:
      safeString(
        empleado.seccion_nombre
      ),

    cargo_id:
      empleado.cargo_id === null ||
      empleado.cargo_id === undefined
        ? null
        : safeNumber(
            empleado.cargo_id,
            null
          ),

    cargo_nombre:
      safeString(
        empleado.cargo_nombre
      ),

    rol_id: rolId,

    rol_nombre:
      safeString(
        rolNombre
      ),

    rol: rol
      ? {
          id:
            rol.id !== undefined &&
            rol.id !== null
              ? safeNumber(rol.id)
              : null,

          nombre:
            safeString(
              rol.nombre
            ),
        }
      : null,

    activo: safeBoolean(
      empleado.activo
    ),

    fecha_alta:
      empleado.fecha_alta ?? null,

    fecha_baja:
      empleado.fecha_baja ?? null,

    modulos_visibles_list:
      safeArrayStrings(
        modulos
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
    ...log,

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
    ...registro,

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
// STORE
// ============================================================

export const useSeguridadStore =
  create((set, get) => ({

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
                normalizarEmpleado
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
        empleadoId === undefined ||
        empleadoId === ""
      ) {
        set({
          ficha: null,
        });

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
        // EMPLEADO
        // ----------------------------------------------------

        const modulosVisibles =
          safeArrayStrings(
            data.modulos_visibles
          );


        const empleado =
          normalizarEmpleado(
            data.empleado,
            {
              modulos_visibles:
                modulosVisibles,
            }
          );


        // ----------------------------------------------------
        // PERMISOS
        //
        // Backend devuelve:
        //
        // "permisos_modulo": {...}
        //
        // El frontend trabajará internamente con:
        //
        // "permisos_modulo_dict"
        // ----------------------------------------------------

        const permisosModulo =
          safePermisosDict(
            data.permisos_modulo ??
            data.permisos_modulo_dict
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
        // FICHA NORMALIZADA
        // ----------------------------------------------------

        const fichaNormalizada = {

          ...data,

          empleado,

          modulos_visibles:
            modulosVisibles,

          permisos_modulo:
            permisosModulo,

          permisos_modulo_dict:
            permisosModulo,

          auditoria,

        };


        set({

          ficha:
            fichaNormalizada,

          auditoria,

        });

      } catch (error) {

        console.error(
          "SEGURIDAD — ERROR CARGANDO FICHA:",
          error
        );

        set({
          ficha: null,
          auditoria: [],
        });
      }
    },


    // ========================================================
    // ASIGNAR ROL
    //
    // BACKEND:
    // POST /api/seguridad/asignar/
    //      empleado/{empleado_id}/rol/{rol_id}
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

    await get().cargarTodo();

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


        await get()
          .cargarFicha(
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


        await get()
          .cargarFicha(
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
    // BLOQUEAR USUARIO
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


        await get()
          .cargarTodo();


        await get()
          .cargarFicha(
            empleadoId
          );

      } catch (error) {

        console.error(
          "SEGURIDAD — ERROR BLOQUEANDO USUARIO:",
          error
        );

        throw error;
      }
    },


    // ========================================================
    // DESBLOQUEAR USUARIO
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


        await get()
          .cargarTodo();


        await get()
          .cargarFicha(
            empleadoId
          );

      } catch (error) {

        console.error(
          "SEGURIDAD — ERROR DESBLOQUEANDO USUARIO:",
          error
        );

        throw error;
      }
    },

  }));
