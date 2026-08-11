from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.empleados.models_v2 import EmpleadoV2

router = APIRouter(prefix="/empleados_v2", tags=["Empleados V2"])

@router.post("")
def crear(data: dict, db: Session = Depends(get_db)):
    empleado = EmpleadoV2(
        nombre=data["nombre"],
        dni=data["dni"],
        usuario=data["dni"],
        password=data["dni"],
        activo=True
    )
    db.add(empleado)
    db.commit()
    db.refresh(empleado)
    return empleado

@router.get("")
def listar(db: Session = Depends(get_db)):
    return db.query(EmpleadoV2).all()
