from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db

router = APIRouter(
    prefix="/seguridad/permisos",
    tags=["Seguridad - Permisos"]
)

PERMISOS_BASE = [
    {"modulo": "agenda", "permiso": "ver"},
    {"modulo": "agenda", "permiso": "crear"},
    {"modulo": "agenda", "permiso": "editar"},
    {"modulo": "agenda", "permiso": "eliminar"},

    {"modulo": "ctn", "permiso": "ver"},

    {"modulo": "empleados", "permiso": "ver"},
    {"modulo": "empleados", "permiso": "editar"},

    {"modulo": "intranet", "permiso": "ver"},
    {"modulo": "intranet", "permiso": "crear"},
    {"modulo": "intranet", "permiso": "editar"},
    {"modulo": "intranet", "permiso": "eliminar"},
]

@router.post("/crear-base")
def crear_permisos_base(db: Session = Depends(get_db)):
    creados = []

    for p in PERMISOS_BASE:
        existe = db.query(Permiso).filter(
            Permiso.modulo == p["modulo"],
            Permiso.permiso == p["permiso"]
        ).first()

        if not existe:
            nuevo = Permiso(
                modulo=p["modulo"],
                permiso=p["permiso"]
            )
            db.add(nuevo)
            creados.append(f"{p['modulo']}:{p['permiso']}")

    db.commit()

    return {"estado": "OK", "permisos_creados": creados}
