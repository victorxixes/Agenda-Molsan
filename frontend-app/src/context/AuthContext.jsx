const puedeVerModulo = (modulo) => {
  return usuario?.modulos_visibles_list?.includes(modulo);
};

const tienePermiso = (modulo, permiso) => {
  return usuario?.permisos_modulo_dict?.[modulo]?.includes(permiso);
};
