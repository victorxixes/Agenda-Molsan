from fastapi import HTTPException

def require_perm_modulo(usuario, modulo: str, accion: str):
    permisos_empleado = usuario.permisos_modulo_dict or {}

    # 🔥 FIX: evitar error cuando usuario.rol es None
    permisos_rol = {}
    rol = getattr(usuario, "rol", None)
    if rol and hasattr(rol, "permisos_modulo_dict"):
        permisos_rol = rol.permisos_modulo_dict or {}

    acciones_empleado = permisos_empleado.get(modulo, [])
    acciones_rol = permisos_rol.get(modulo, [])

    acciones_totales = set(acciones_empleado + acciones_rol)

    wildcard_modulo = f"{modulo}.*"

    if wildcard_modulo in permisos_empleado:
        acciones_totales.update(permisos_empleado[wildcard_modulo])

    if wildcard_modulo in permisos_rol:
        acciones_totales.update(permisos_rol[wildcard_modulo])

    if "*" in permisos_empleado:
        acciones_totales.update(permisos_empleado["*"])

    if "*" in permisos_rol:
        acciones_totales.update(permisos_rol["*"])

    if accion not in acciones_totales:
        raise HTTPException(
            status_code=403,
            detail=f"No tienes permiso para '{accion}' en el módulo '{modulo}'"
        )

    return True


def require_permission(usuario, permiso: str):
    if "." not in permiso:
        raise HTTPException(status_code=400, detail="Permiso inválido")

    modulo, accion = permiso.split(".", 1)
    return require_perm_modulo(usuario, modulo, accion)
