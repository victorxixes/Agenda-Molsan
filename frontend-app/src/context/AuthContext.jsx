const puedeVerModulo = (modulo) => {

  if (!usuario) {
    return false;
  }

  // ADMIN -> puede ver absolutamente todos los módulos
  if (
    usuario.usuario === "admin" ||
    usuario.rol_id === 0
  ) {
    return true;
  }

  return (
    usuario.modulos_visibles_list?.includes(
      modulo
    ) ?? false
  );
};


const tienePermiso = (
  modulo,
  permiso
) => {

  if (!usuario) {
    return false;
  }

  // ADMIN -> tiene todos los permisos
  if (
    usuario.usuario === "admin" ||
    usuario.rol_id === 0
  ) {
    return true;
  }

  const permisos =
    usuario.permisos_modulo_dict;

  if (!permisos) {
    return false;
  }

  // Permisos específicos del módulo
  if (
    permisos[modulo]?.includes(permiso)
  ) {
    return true;
  }

  // Permisos globales *
  if (
    permisos["*"]?.includes(permiso)
  ) {
    return true;
  }

  return false;
};
