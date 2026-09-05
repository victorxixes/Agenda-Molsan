from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.empleados.models import Empleado

router = APIRouter(
    prefix="/seguridad/asignar",
    tags=["Seguridad - Asignación"]
)

@router.post("/empleado/{empleado_id}/bloquear")
def bloquear_empleado(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    empleado.activo = False
    db.commit()

    return {
        "estado": "OK",
        "detalle": f"Empleado {empleado.usuario} ha sido BLOQUEADO"
    }


@router.post("/empleado/{empleado_id}/desbloquear")
def desbloquear_empleado(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    empleado.activo = True
    db.commit()

    return {
        "estado": "OK",
        "detalle": f"Empleado {empleado.usuario} ha sido DESBLOQUEADO"
    }
