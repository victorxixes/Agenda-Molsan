import { useEmpleadosStore } from "../store/empleadosStore";

/**
 * Hook premium SJ‑2026
 * Acceso completo al store de Empleados:
 * - Estado (empleados, empleadoActual)
 * - Acciones CRUD
 * - Gestión de módulos visibles
 * - Gestión de permisos por módulo
 */
export const useEmpleados = () => {
  const {
    empleados,
    empleadoActual,

    cargarEmpleados,
    buscar,
    obtener,
    crear,
    editar,
    eliminar,

    actualizarModulos,
    actualizarPermisos,
  } = useEmpleadosStore();

  return {
    empleados,
    empleadoActual,

    cargarEmpleados,
    buscar,
    obtener,
    crear,
    editar,
    eliminar,

    actualizarModulos,
    actualizarPermisos,
  };
};
