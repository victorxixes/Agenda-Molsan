from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.seguridad.service import obtener_permisos_por_rol

router = APIRouter(prefix="/seguridad", tags=["Seguridad"])

# ---------------------------------------------------------
# PERMISOS DEL ADMIN (ruta que el frontend necesita)
# ---------------------------------------------------------
@router.get("/permisos")
def permisos_admin(db: Session = Depends(get_db)):
    # Módulos del ERP
    modulos = [
        "dashboard",
        "agenda",
        "empleados",
        "ctn",
        "intranet",
        "mensajes",
        "seguridad",
        "auditoria",
        "sistema",
        "utilidades",
        "monitor",
        "logs",
        "perfil"
    ]

    acciones = {
        modulo: ["ver", "crear", "editar", "eliminar"]
        for modulo in modulos
    }

    return {
        "rol": "Administrador",
        "modulos": modulos,
        "acciones": acciones
    }

# ---------------------------------------------------------
# PERMISOS POR ROL (opcional)
# ---------------------------------------------------------
@router.get("/permisos/{rol_id}")
def permisos_por_rol(rol_id: int, db: Session = Depends(get_db)):
    permisos = obtener_permisos_por_rol(db, rol_id)

    modulos = [p.modulo for p in permisos]

    acciones = {
        p.modulo: p.acciones.split(",")
        for p in permisos
    }

    return {
        "rol_id": rol_id,
        "modulos": modulos,
        "acciones": acciones
    }
