from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.maestros.service import (
    listar_departamentos, crear_departamento,
    listar_secciones, crear_seccion,
    listar_cargos, crear_cargo
)
from app.maestros.schemas import (
    DepartamentoCreate, SeccionCreate, CargoCreate
)

router = APIRouter(prefix="/maestros", tags=["Maestros"])

# Departamentos
@router.get("/departamentos")
def get_departamentos(db: Session = Depends(get_db)):
    return listar_departamentos(db)

@router.post("/departamentos")
def post_departamento(data: DepartamentoCreate, db: Session = Depends(get_db)):
    return crear_departamento(db, data)

# Secciones
@router.get("/secciones")
def get_secciones(db: Session = Depends(get_db)):
    return listar_secciones(db)

@router.post("/secciones")
def post_seccion(data: SeccionCreate, db: Session = Depends(get_db)):
    return crear_seccion(db, data)

# Cargos
@router.get("/cargos")
def get_cargos(db: Session = Depends(get_db)):
    return listar_cargos(db)

@router.post("/cargos")
def post_cargo(data: CargoCreate, db: Session = Depends(get_db)):
    return crear_cargo(db, data)
