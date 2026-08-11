from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.empleados.schemas import EmpleadoCreate, EmpleadoResponse
from app.empleados.service import crear_empleado, listar_empleados

router = APIRouter(prefix="/empleados", tags=["Empleados"])

@router.post("", response_model=EmpleadoResponse)
def crear(data: EmpleadoCreate, db: Session = Depends(get_db)):
    return crear_empleado(db, data)

@router.get("", response_model=list[EmpleadoResponse])
def listar(db: Session = Depends(get_db)):
    return listar_empleados(db)
