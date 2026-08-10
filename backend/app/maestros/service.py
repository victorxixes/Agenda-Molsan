from sqlalchemy.orm import Session
from app.maestros.models import Departamento, Seccion, Cargo
from app.maestros.schemas import (
    DepartamentoCreate, SeccionCreate, CargoCreate
)

# -------------------------
# DEPARTAMENTOS
# -------------------------
def listar_departamentos(db: Session):
    return db.query(Departamento).all()

def crear_departamento(db: Session, data: DepartamentoCreate):
    dep = Departamento(**data.dict())
    db.add(dep)
    db.commit()
    db.refresh(dep)
    return dep

# -------------------------
# SECCIONES
# -------------------------
def listar_secciones(db: Session):
    return db.query(Seccion).all()

def crear_seccion(db: Session, data: SeccionCreate):
    sec = Seccion(**data.dict())
    db.add(sec)
    db.commit()
    db.refresh(sec)
    return sec

# -------------------------
# CARGOS
# -------------------------
def listar_cargos(db: Session):
    return db.query(Cargo).all()

def crear_cargo(db: Session, data: CargoCreate):
    cargo = Cargo(**data.dict())
    db.add(cargo)
    db.commit()
    db.refresh(cargo)
    return cargo
