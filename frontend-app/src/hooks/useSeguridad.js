import { useSeguridadStore } from "../store/seguridadStore";

/**
 * Hook premium SJ‑2026 — versión blindada
 * Limpieza total de datos para evitar React error #31
 */

export const useSeguridad = () => {
  const store = useSeguridadStore();

  // -----------------------------
  // LIMPIEZA DE ROLES
  // -----------------------------
  const roles = Array.isArray(store.roles)
    ? store.roles.filter(
        (r) =>
          r &&
          typeof r === "object" &&
          typeof r.id !== "undefined" &&
          typeof r.nombre === "string"
      )
    : [];

  // -----------------------------
  // LIMPIEZA DE PERMISOS
  // -----------------------------
  const permisos = Array.isArray(store.permisos)
    ? store.permisos.filter(
        (p) =>
          p &&
          typeof p === "object" &&
          typeof p.modulo === "string" &&
          typeof p.permiso === "string"
      )
    : [];

  // -----------------------------
  // LIMPIEZA DE EMPLEADOS
  // -----------------------------
  const empleados = Array.isArray(store.empleados)
    ? store.empleados.filter(
        (e) =>
          e &&
          typeof e === "object" &&
          typeof e.id === "number" &&
          typeof e.nombre === "string"
      )
    : [];

  // -----------------------------
  // LIMPIEZA DE AUDITORÍA
  // -----------------------------
  const auditoria = Array.isArray(store.auditoria)
    ? store.auditoria.filter(
        (a) =>
          a &&
          typeof a === "object" &&
          typeof a.id !== "undefined" &&
          typeof a.fecha === "string" &&
          typeof a.accion === "string" &&
          typeof a.descripcion === "string" &&
          typeof a.usuario === "string"
      )
    : [];

  // -----------------------------
  // LIMPIEZA DE LOGS
  // -----------------------------
  const logs = Array.isArray(store.logs)
    ? store.logs.filter(
        (l) =>
          l &&
          typeof l === "object" &&
          typeof l.id !== "undefined" &&
          typeof l.fecha === "string" &&
          typeof l.evento === "string" &&
          typeof l.detalle === "string"
      )
    : [];

  // -----------------------------
  // LIMPIEZA DE FICHA COMPLETA
  // -----------------------------
  const ficha =
    store.ficha &&
    typeof store.ficha === "object" &&
    typeof store.ficha.empleado === "object"
      ? {
          ...store.ficha,

          empleado: {
            ...store.ficha.empleado,
            id: Number(store.ficha.empleado.id),
            nombre: store.ficha.empleado.nombre || "",
            usuario: store.ficha.empleado.usuario || "",
            apellidos: store.ficha.empleado.apellidos || "",
            dni: store.ficha.empleado.dni || "",
            email_empresa: store.ficha.empleado.email_empresa || "",
            activo: Boolean(store.ficha.empleado.activo),
            rol_nombre: store.ficha.empleado.rol_nombre || "",
            foto:
              typeof store.ficha.empleado.foto === "string"
                ? store.ficha.empleado.foto
                : null,
            modulos_visibles_list: Array.isArray(
              store.ficha.empleado.modulos_visibles_list
            )
              ? store.ficha.empleado.modulos_visibles_list.filter(
                  (m) => typeof m === "string"
                )
              : [],
          },

          permisos_modulo_dict:
            typeof store.ficha.permisos_modulo_dict === "object"
              ? Object.fromEntries(
                  Object.entries(store.ficha.permisos_modulo_dict).map(
                    ([modulo, lista]) => [
                      modulo,
                      Array.isArray(lista)
                        ? lista.filter((p) => typeof p === "string")
                        : [],
                    ]
                  )
                )
              : {},
        }
      : null;

  // -----------------------------
  // DEVOLVER STORE LIMPIO
  // -----------------------------
  return {
    ...store,
    roles,
    permisos,
    empleados,
    auditoria,
    logs,
    ficha,
  };
};
