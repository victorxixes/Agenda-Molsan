from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.roles.models import Rol
from backend.app.seguridad.roles.schemas import RolCreate, RolOut

router = APIRouter(
    prefix="/seguridad/roles",
    tags=["Seguridad - Roles"]
)

# ---------------------------------------------------------
# CREAR ROLES BASE (TU ENDPOINT)
# ---------------------------------------------------------
ROLES_BASE = [
    {"id": 1, "nombre": "admin"},
    {"id": 2, "nombre": "empleado"},
    {"id": 3, "nombre": "rrhh"},
    {"id": 4, "nombre": "direccion"},
    {"id": 5, "nombre": "apoderado"},
]

@router.post("/crear-base")
def crear_roles_base(db: Session = Depends(get_db)):
    creados = []

    for r in ROLES_BASE:
        existe = db.execute(
            "SELECT id FROM roles WHERE id = :id",
            {"id": r["id"]}
        ).fetchone()

        if not existe:
            db.execute("""
                INSERT INTO roles (id, nombre)
                VALUES (:id, :nombre)
            """, r)
            creados.append(r["nombre"])

    db.commit()
    return {"estado": "OK", "roles_creados": creados}


# ---------------------------------------------------------
# LISTAR ROLES
# ---------------------------------------------------------
@router.get("/", response_model=list[RolOut])
def listar_roles(db: Session = Depends(get_db)):
    return db.query(Rol).order_by(Rol.id.asc()).all()


# ---------------------------------------------------------
# CREAR ROL
# ---------------------------------------------------------
@router.post("/", response_model=RolOut)
def crear_rol(data: RolCreate, db: Session = Depends(get_db)):
    existente = db.query(Rol).filter(Rol.nombre == data.nombre).first()
    if existente:
        raise HTTPException(status_code=400, detail="El rol ya existe")

    rol = Rol(nombre=data.nombre, descripcion=data.descripcion)
    db.add(rol)
    db.commit()
    db.refresh(rol)
    return rol
