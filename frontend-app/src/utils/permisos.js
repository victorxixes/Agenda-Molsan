import { useAuthStore } from "../store/authStore";

/**
 * Permisos — SJ‑2026 Premium
 * Utilidades centralizadas para:
 * - Verificar módulos visibles
 * - Verificar permisos por acción
 * - Basado en authStore (empleado)
 *
 * Diseño:
 * - Lectura directa del estado con getState() (rápido y sin re-render)
 * - Normalización defensiva
 * - Funciones puras y estables
 */

/**
 * Verifica si el empleado puede ver un módulo concreto.
 */
export function puedeVerModulo(modulo) {
  const empleado = useAuthStore.getState().empleado;
  if (!empleado) return false;

  const modulos = empleado.modulos_visibles || [];
  return modulos.includes(modulo);
}

/**
 * Verifica si el empleado tiene un permiso específico dentro de un módulo.
 */
export function tienePermiso(modulo, accion) {
  const empleado = useAuthStore.getState().empleado;
  if (!empleado) return false;

  const permisos = empleado.permisos_modulo || {};
  const acciones = permisos[modulo] || [];

  return acciones.includes(accion);
}
