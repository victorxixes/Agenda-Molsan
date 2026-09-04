from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db

router = APIRouter(
    prefix="/seguridad/roles",
    tags=["Seguridad - Roles"]
)

ROLES_BASE = [
    {"id": 1, "nombre": "admin", "descripcion": "Administrador del sistema"},
    {"id": 2, "nombre": "empleado", "descripcion": "Empleado estándar"},
    {"id": 3, "nombre": "rrhh", "descripcion": "Recursos Humanos"},
    {"id": 4, "nombre": "direccion", "descripcion": "Dirección"},
    {"id": 5, "nombre": "apoderado", "descripcion": "Apoderado"},
]

@router.post("/crear-base")
def crear_roles_base(db: Session = Depends(get_db)):
    creados = []

    for r in ROLES_BASE:
        existe = db.query(Rol).filter(Rol.id == r["id"]).first()
        if not existe:
            nuevo = Rol(
                id=r["id"],
                nombre=r["nombre"],
                descripcion=r["descripcion"],
                permisos_modulo_dict={},
                modulos_visibles_list=[]
            )
            db.add(nuevo)
            creados.append(r["nombre"])

    db.commit()

    return {"estado": "OK", "roles_creados": creados}
