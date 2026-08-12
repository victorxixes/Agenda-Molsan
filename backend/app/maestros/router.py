from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.maestros.service import (
    listar_departamentos, crear_departamento, editar_departamento, eliminar_departamento,
    listar_secciones, crear_seccion, editar_seccion, eliminar_seccion,
    listar_cargos, crear_cargo, editar_cargo, eliminar_cargo
)
from backend.app.maestros.schemas import (
    DepartamentoCreate, SeccionCreate, CargoCreate
)

router = APIRouter(prefix="/maestros", tags=["Maestros"])

# -------------------------
# DEPARTAMENTOS
# -------------------------
@router.get("/departamentos")
def get_departamentos(db: Session = Depends(get_db)):
    return listar_departamentos(db)

@router.post("/departamentos")
def post_departamento(data: DepartamentoCreate, db: Session = Depends(get_db)):
    return crear_departamento(db, data)

@router.put("/departamentos/{id}")
def put_departamento(id: int, data: DepartamentoCreate, db: Session = Depends(get_db)):
    dep = editar_departamento(db, id, data)
    if not dep:
        raise HTTPException(404, "Departamento no encontrado")
    return dep

@router.delete("/departamentos/{id}")
def delete_departamento(id: int, db: Session = Depends(get_db)):
    ok = eliminar_departamento(db, id)
    if not ok:
        raise HTTPException(404, "Departamento no encontrado")
    return {"detail": "Departamento eliminado"}

# -------------------------
# SECCIONES
# -------------------------
@router.get("/secciones")
def get_secciones(db: Session = Depends(get_db)):
    return listar_secciones(db)

@router.post("/secciones")
def post_seccion(data: SeccionCreate, db: Session = Depends(get_db)):
    return crear_seccion(db, data)

@router.put("/secciones/{id}")
def put_seccion(id: int, data: SeccionCreate, db: Session = Depends(get_db)):
    sec = editar_seccion(db, id, data)
    if not sec:
        raise HTTPException(404, "Sección no encontrada")
    return sec

@router.delete("/secciones/{id}")
def delete_seccion(id: int, db: Session = Depends(get_db)):
    ok = eliminar_seccion(db, id)
    if not ok:
        raise HTTPException(404, "Sección no encontrada")
    return {"detail": "Sección eliminada"}

# -------------------------
# CARGOS
# -------------------------
@router.get("/cargos")
def get_cargos(db: Session = Depends(get_db)):
    return listar_cargos(db)

@router.post("/cargos")
def post_cargo(data: CargoCreate, db: Session = Depends(get_db)):
    return crear_cargo(db, data)

@router.put("/cargos/{id}")
def put_cargo(id: int, data: CargoCreate, db: Session = Depends(get_db)):
    cargo = editar_cargo(db, id, data)
    if not cargo:
        raise HTTPException(404, "Cargo no encontrado")
    return cargo

@router.delete("/cargos/{id}")
def delete_cargo(id: int, db: Session = Depends(get_db)):
    ok = eliminar_cargo(db, id)
    if not ok:
        raise HTTPException(404, "Cargo no encontrado")
    return {"detail": "Cargo eliminado"}
