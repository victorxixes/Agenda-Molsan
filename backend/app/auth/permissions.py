from fastapi import HTTPException


# ---------------------------------------------------------
# SISTEMA DE PERMISOS BASADO EN EMPLEADO + ROL
# ---------------------------------------------------------
def require_perm_modulo(usuario, modulo: str, accion: str):
    """
    🔥 Verifica permisos combinando:
    - permisos del empleado
    - permisos heredados del rol
    - wildcards del módulo (ej: seguridad.*)
    - permisos globales (ej: "*": ["ver", "editar"])
    """

    # -----------------------------
    # PERMISOS DEL EMPLEADO
    # -----------------------------
    permisos_empleado = usuario.permisos_modulo_dict or {}

    # -----------------------------
    # PERMISOS DEL ROL
    # -----------------------------
    permisos_rol = {}
    if usuario.rol:
        permisos_rol = usuario.rol.permisos_modulo_dict or {}

    # -----------------------------
    # COMBINAR PERMISOS
    # -----------------------------
    acciones_empleado = permisos_empleado.get(modulo, [])
    acciones_rol = permisos_rol.get(modulo, [])

    acciones_totales = set(acciones_empleado + acciones_rol)

    # -----------------------------
    # WILDCARD DEL MÓDULO
    # -----------------------------
    wildcard_modulo = f"{modulo}.*"

    if wildcard_modulo in permisos_empleado:
        acciones_totales.update(permisos_empleado[wildcard_modulo])

    if wildcard_modulo in permisos_rol:
        acciones_totales.update(permisos_rol[wildcard_modulo])

    # -----------------------------
    # PERMISOS GLOBALES "*"
    # -----------------------------
    if "*" in permisos_empleado:
        acciones_totales.update(permisos_empleado["*"])

    if "*" in permisos_rol:
        acciones_totales.update(permisos_rol["*"])

    # -----------------------------
    # VALIDAR ACCIÓN
    # -----------------------------
    if accion not in acciones_totales:
        raise HTTPException(
            status_code=403,
            detail=f"No tienes permiso para '{accion}' en el módulo '{modulo}'"
        )

    return True


# ---------------------------------------------------------
# COMPATIBILIDAD CON ROUTERS ANTIGUOS
# ---------------------------------------------------------
def require_permission(usuario, permiso: str):
    """
    🔥 Compatibilidad con código antiguo.
    Permiso viene en formato: 'modulo.accion'
    Ejemplo: 'seguridad.ver'
    """

    if "." not in permiso:
        raise HTTPException(status_code=400, detail="Permiso inválido")

    modulo, accion = permiso.split(".", 1)

    return require_perm_modulo(usuario, modulo, accion)
