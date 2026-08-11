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
# ---------------------------------------------------------
# EDITAR (AQUÍ ESTÁ EL PUT QUE FALTABA)
# ---------------------------------------------------------
@router.put("/{empleado_id}", response_model=EmpleadoResponse)
def editar(empleado_id: int, data: EmpleadoUpdate, db: Session = Depends(get_db)):
    empleado = editar_empleado(db, empleado_id, data)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado
