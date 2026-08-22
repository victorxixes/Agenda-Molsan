from fastapi import APIRouter

router = APIRouter(prefix="/seguridad", tags=["Seguridad"])

@router.get("/permisos")
def get_permisos():
    return {"detail": "ok"}

@router.get("/eventos")
def get_eventos():
    return []

@router.get("/usuarios")
def get_usuarios():
    return []
