import { useEmpleadosStore } from "../store/empleadosStore";

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
