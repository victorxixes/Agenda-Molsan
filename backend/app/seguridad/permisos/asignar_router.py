from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.empleados.models import Empleado

router = APIRouter(
    prefix="/seguridad/asignar",
    tags=["Seguridad - Asignación"]
)

@router.post("/empleado/{empleado_id}/modulos")
def asignar_modulos(empleado_id: int, modulos: list, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return {"error": "Empleado no encontrado"}

    empleado.modulos_visibles_list = modulos
    db.commit()

    return {"estado": "OK", "modulos_asignados": modulos}


@router.post("/empleado/{empleado_id}/permisos")
def asignar_permisos(empleado_id: int, permisos: dict, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return {"error": "Empleado no encontrado"}

    empleado.permisos_modulo_dict = permisos
    db.commit()

    return {"estado": "OK", "permisos_asignados": permisos}
