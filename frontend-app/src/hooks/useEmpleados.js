import { useEmpleadosStore } from "../store/empleadosStore";

/**
 * ============================================================
 * useEmpleados
 * MOLSAN ERP — Empleados Premium 2027
 * ============================================================
 *
 * Hook centralizado para acceder al store de empleados.
 *
 * Incluye:
 * - empleados
 * - apoderados
 * - empleadoActual
 * - estados de carga/error
 * - CRUD
 * - búsqueda
 * - obtención individual
 * ============================================================
 */

export const useEmpleados = () => {
  const {
    empleados,
    apoderados,
    empleadoActual,

    cargando,
    error,

    cargarEmpleados,
    cargarApoderados,

    buscar,
    obtener,

    crear,
    editar,
    eliminar,
  } = useEmpleadosStore();

  return {
    empleados,
    apoderados,
    empleadoActual,

    cargando,
    error,

    cargarEmpleados,
    cargarApoderados,

    buscar,
    obtener,

    crear,
    editar,
    eliminar,
  };
};
