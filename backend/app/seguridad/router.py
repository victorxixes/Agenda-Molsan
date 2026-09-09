from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.service import (
    obtener_permisos,
    asignar_modulos,
    asignar_permisos,
    serializar_empleado_seguridad
)
from backend.app.empleados.models import Empleado

router = APIRouter(prefix="/seguridad", tags=["Seguridad"])


# -------------------------
# Ficha completa de seguridad del usuario
# -------------------------
@router.get("/ficha/{empleado_id}")
def get_ficha(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(404, "Empleado no encontrado")

    return serializar_empleado_seguridad(empleado)


# -------------------------
# Obtener permisos del usuario
# -------------------------
@router.get("/permisos/{empleado_id}")
def get_permisos(empleado_id: int, db: Session = Depends(get_db)):
    permisos = obtener_permisos(db, empleado_id)
    if not permisos:
        raise HTTPException(404, "Empleado no encontrado")
    return permisos


# -------------------------
# Asignar módulos visibles
# -------------------------
@router.post("/modulos/{empleado_id}")
def set_modulos(empleado_id: int, modulos: list, db: Session = Depends(get_db)):
    actualizado = asignar_modulos(db, empleado_id, modulos)
    if not actualizado:
        raise HTTPException(404, "Empleado no encontrado")
    return actualizado


# -------------------------
# Asignar permisos por módulo
# -------------------------
@router.post("/permisos-modulo/{empleado_id}")
def set_permisos_modulo(empleado_id: int, permisos: dict, db: Session = Depends(get_db)):
    actualizado = asignar_permisos(db, empleado_id, permisos)
    if not actualizado:
        raise HTTPException(404, "Empleado no encontrado")
    return actualizado
