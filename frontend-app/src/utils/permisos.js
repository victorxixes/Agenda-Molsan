import { useAuthStore } from "../store/authStore";

export function puedeVerModulo(modulo) {
  const empleado = useAuthStore.getState().empleado;
  if (!empleado) return false;

  const modulos = empleado.modulos_visibles || [];
  return modulos.includes(modulo);
}
