from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.empleados.models import Empleado
from backend.app.empleados.service import hash_password

router = APIRouter(
    prefix="/seguridad/asignar",
    tags=["Seguridad - Asignación"]
)

@router.post("/empleado/{empleado_id}/password")
def resetear_password(empleado_id: int, nueva_password: str, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    empleado.password = hash_password(nueva_password)
    db.commit()

    return {
        "estado": "OK",
        "detalle": f"Contraseña actualizada correctamente para el empleado {empleado.usuario}"
    }
