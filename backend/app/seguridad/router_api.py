# backend/app/seguridad/router_api.py
from fastapi import APIRouter

router = APIRouter(prefix="/seguridad", tags=["Seguridad API"])

@router.get("/eventos")
def get_eventos():
    return []

@router.get("/usuarios")
def get_usuarios():
    return []
