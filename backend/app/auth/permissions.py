from fastapi import HTTPException

def requiere_rol(usuario, roles_permitidos: list[str]):
    if usuario["rol"] not in roles_permitidos:
        raise HTTPException(status_code=403, detail="No tienes permiso para acceder a este módulo")

def requiere_permiso(usuario, modulo: str, accion: str):
    permisos = usuario["permisos"]

    if modulo not in permisos["modulos"]:
        raise HTTPException(status_code=403, detail="No tienes acceso a este módulo")

    if accion not in permisos["acciones"].get(modulo, []):
        raise HTTPException(status_code=403, detail="No tienes permiso para esta acción")
