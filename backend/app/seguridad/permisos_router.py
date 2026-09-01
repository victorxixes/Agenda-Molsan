from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from backend.app.database import get_db
from backend.app.empleados.models import Empleado

router = APIRouter(prefix="/seguridad", tags=["Seguridad"])

def _safe_list(value):
    if isinstance(value, str):
        try:
            return json.loads(value)
        except:
            return []
    return value or []

def _safe_dict(value):
    if isinstance(value, str):
        try:
            return json.loads(value)
        except:
            return {}
    return value or {}

@router.get("/permisos/{empleado_id}")
def permisos_por_empleado(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    modulos_empleado = _safe_list(empleado.modulos_visibles_list)
    permisos_empleado = _safe_dict(empleado.permisos_modulo_dict)

    modulos_rol = []
    permisos_rol = {}

    if empleado.rol:
        modulos_rol = _safe_list(empleado.rol.modulos_visibles_list)
        permisos_rol = _safe_dict(empleado.rol.permisos_modulo_dict)

    modulos_totales = list(set(modulos_empleado + modulos_rol))

    permisos_totales = permisos_empleado.copy()
    for modulo, acciones in permisos_rol.items():
        permisos_totales.setdefault(modulo, [])
        permisos_totales[modulo] = list(set(permisos_totales[modulo] + acciones))

    return {
        "empleado_id": empleado_id,
        "rol_id": empleado.rol_id,
        "rol_nombre": empleado.rol.nombre if empleado.rol else None,
        "modulos": modulos_totales,
        "acciones": permisos_totales,
    }

@router.get("/modulos/{empleado_id}")
def modulos_por_empleado(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    modulos_empleado = _safe_list(empleado.modulos_visibles_list)
    modulos_rol = _safe_list(empleado.rol.modulos_visibles_list) if empleado.rol else []

    modulos_totales = list(set(modulos_empleado + modulos_rol))

    return {
        "empleado_id": empleado_id,
        "modulos": modulos_totales,
    }
