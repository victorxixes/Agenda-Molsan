export function puedeVerModulo(modulo) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario || !usuario.permisos) return false;
  return usuario.permisos.includes(modulo);
}
