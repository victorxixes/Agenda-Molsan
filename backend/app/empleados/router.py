from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.empleados.schemas import EmpleadoCreate, EmpleadoUpdate
from app.empleados.service import (
    listar_empleados,
    crear_empleado,
    editar_empleado,
    eliminar_empleado,
    obtener_empleado,
    login_empleado
)

router = APIRouter(prefix="/empleados", tags=["Empleados"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login")
def login(usuario: str, password: str, db: Session = Depends(get_db)):
    resultado = login_empleado(db, usuario, password)
    if not resultado:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    return resultado


@router.get("/")
def listar(db: Session = Depends(get_db)):
    return listar_empleados(db)


@router.get("/{empleado_id}")
def obtener(empleado_id: int, db: Session = Depends(get_db)):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado


@router.post("/")
def crear(data: EmpleadoCreate, db: Session = Depends(get_db)):
    try:
        return crear_empleado(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{empleado_id}")
def editar(empleado_id: int, data: EmpleadoUpdate, db: Session = Depends(get_db)):
    empleado = editar_empleado(db, empleado_id, data)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado


@router.delete("/{empleado_id}")
def eliminar(empleado_id: int, db: Session = Depends(get_db)):
    ok = eliminar_empleado(db, empleado_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return {"status": "ok", "message": "Empleado eliminado"}
