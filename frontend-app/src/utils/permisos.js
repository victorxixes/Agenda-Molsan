import { useAuthStore } from "../store/authStore";

/**
 * Utilidades de permisos — Versión SJ‑2026 Premium
 * - Verificación de módulos visibles
 * - Verificación de permisos por módulo
 * - Basado en authStore (empleado)
 */

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
