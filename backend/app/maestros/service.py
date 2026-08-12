from sqlalchemy.orm import Session
from app.maestros.models import Departamento, Seccion, Cargo
from app.maestros.schemas import DepartamentoCreate, SeccionCreate, CargoCreate

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

def editar_departamento(db: Session, id: int, data: DepartamentoCreate):
    dep = db.query(Departamento).filter(Departamento.id == id).first()
    if not dep:
        return None
    for k, v in data.dict().items():
        setattr(dep, k, v)
    db.commit()
    db.refresh(dep)
    return dep

def eliminar_departamento(db: Session, id: int):
    dep = db.query(Departamento).filter(Departamento.id == id).first()
    if not dep:
        return False
    db.delete(dep)
    db.commit()
    return True

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

def editar_seccion(db: Session, id: int, data: SeccionCreate):
    sec = db.query(Seccion).filter(Seccion.id == id).first()
    if not sec:
        return None
    for k, v in data.dict().items():
        setattr(sec, k, v)
    db.commit()
    db.refresh(sec)
    return sec

def eliminar_seccion(db: Session, id: int):
    sec = db.query(Seccion).filter(Seccion.id == id).first()
    if not sec:
        return False
    db.delete(sec)
    db.commit()
    return True

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

def editar_cargo(db: Session, id: int, data: CargoCreate):
    cargo = db.query(Cargo).filter(Cargo.id == id).first()
    if not cargo:
        return None
    for k, v in data.dict().items():
        setattr(cargo, k, v)
    db.commit()
    db.refresh(cargo)
    return cargo

def eliminar_cargo(db: Session, id: int):
    cargo = db.query(Cargo).filter(Cargo.id == id).first()
    if not cargo:
        return False
    db.delete(cargo)
    db.commit()
    return True
