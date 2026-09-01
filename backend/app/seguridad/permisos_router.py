from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.empleados.models import Empleado

router = APIRouter(prefix="/seguridad", tags=["Seguridad"])

# ---------------------------------------------------------
# PERMISOS COMPLETOS DEL EMPLEADO (incluye rol)
# ---------------------------------------------------------
@router.get("/permisos/{empleado_id}")
def permisos_por_empleado(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    # 🔥 Módulos del empleado
    modulos_empleado = empleado.modulos_visibles_list or []

    # 🔥 Permisos del empleado
    permisos_empleado = empleado.permisos_modulo_dict or {}

    # 🔥 Módulos del rol
    modulos_rol = empleado.rol.modulos_visibles_list if empleado.rol else []

    # 🔥 Permisos del rol
    permisos_rol = empleado.rol.permisos_modulo_dict if empleado.rol else {}

    # 🔥 Herencia de módulos
    modulos_totales = list(set(modulos_empleado + modulos_rol))

    # 🔥 Herencia de permisos
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

# ---------------------------------------------------------
# MÓDULOS COMPLETOS DEL EMPLEADO (incluye rol)
# ---------------------------------------------------------
@router.get("/modulos/{empleado_id}")
def modulos_por_empleado(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    modulos_empleado = empleado.modulos_visibles_list or []
    modulos_rol = empleado.rol.modulos_visibles_list if empleado.rol else []

    modulos_totales = list(set(modulos_empleado + modulos_rol))

    return {
        "empleado_id": empleado_id,
        "modulos": modulos_totales,
    }
