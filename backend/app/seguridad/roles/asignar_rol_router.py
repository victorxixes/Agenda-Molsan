from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.empleados.models import Empleado
from backend.app.seguridad.roles.models import Rol

router = APIRouter(
    prefix="/seguridad/asignar",
    tags=["Seguridad - Asignación"]
)

@router.post("/empleado/{empleado_id}/rol/{rol_id}")
def asignar_rol(empleado_id: int, rol_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    rol = db.query(Rol).filter(Rol.id == rol_id).first()
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")

    empleado.rol_id = rol_id
    db.commit()

    return {
        "estado": "OK",
        "detalle": f"Rol '{rol.nombre}' asignado correctamente al empleado {empleado.nombre}"
    }
