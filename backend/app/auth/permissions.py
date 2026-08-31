from fastapi import HTTPException

def requiere_modulo(usuario, modulo: str):
    if modulo not in usuario["modulos_visibles"]:
        raise HTTPException(status_code=403, detail="No tienes acceso a este módulo")

def requiere_permiso(usuario, modulo: str, accion: str):
    permisos = usuario["permisos_modulo"]

    if modulo not in permisos:
        raise HTTPException(status_code=403, detail="No tienes acceso a este módulo")

    if accion not in permisos.get(modulo, []):
        raise HTTPException(status_code=403, detail="No tienes permiso para esta acción")
