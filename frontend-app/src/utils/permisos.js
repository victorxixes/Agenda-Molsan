import { useAuthStore } from "../store/authStore";

export function puedeVerModulo(modulo) {
  const empleado = useAuthStore.getState().empleado;
  if (!empleado) return false;

  const modulos = empleado.modulos_visibles || [];
  return modulos.includes(modulo);
}

export function tienePermiso(modulo, accion) {
  const empleado = useAuthStore.getState().empleado;
  if (!empleado) return false;

  const permisos = empleado.permisos_modulo || {};
  const acciones = permisos[modulo] || [];

  return acciones.includes(accion);
}
