from sqlalchemy.orm import Session
from backend.app.maestros.models import Departamento, Seccion, Cargo, Rol

# ---------------------------
# GENERIC CRUD
# ---------------------------

def listar(db: Session, modelo):
    return db.query(modelo).order_by(modelo.id.asc()).all()

def obtener(db: Session, modelo, id: int):
    return db.query(modelo).filter(modelo.id == id).first()

def crear(db: Session, modelo, nombre: str):
    existente = db.query(modelo).filter(modelo.nombre == nombre).first()
    if existente:
        raise ValueError("Ya existe un registro con ese nombre")

    registro = modelo(nombre=nombre)
    db.add(registro)
    db.commit()
    db.refresh(registro)
    return registro

def editar(db: Session, modelo, id: int, nombre: str):
    registro = obtener(db, modelo, id)
    if not registro:
        return None

    registro.nombre = nombre
    db.commit()
    db.refresh(registro)
    return registro

def eliminar(db: Session, modelo, id: int):
    registro = obtener(db, modelo, id)
    if not registro:
        return False

    db.delete(registro)
    db.commit()
    return True
