from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db

router = APIRouter(
    prefix="/seguridad/permisos",
    tags=["Seguridad - Permisos"]
)

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db

router = APIRouter(
    prefix="/seguridad/permisos",
    tags=["Seguridad - Permisos"]
)

PERMISOS_BASE = [
    # Agenda
    {"modulo": "agenda", "permiso": "ver"},
    {"modulo": "agenda", "permiso": "crear"},
    {"modulo": "agenda", "permiso": "editar"},
    {"modulo": "agenda", "permiso": "eliminar"},

    # Empleados
    {"modulo": "empleados", "permiso": "ver"},
    {"modulo": "empleados", "permiso": "crear"},
    {"modulo": "empleados", "permiso": "editar"},
    {"modulo": "empleados", "permiso": "eliminar"},

    # Intranet
    {"modulo": "intranet", "permiso": "ver"},
    {"modulo": "intranet", "permiso": "crear"},
    {"modulo": "intranet", "permiso": "editar"},
    {"modulo": "intranet", "permiso": "eliminar"},

    # Noticias
    {"modulo": "noticias", "permiso": "ver"},
    {"modulo": "noticias", "permiso": "crear"},
    {"modulo": "noticias", "permiso": "editar"},
    {"modulo": "noticias", "permiso": "eliminar"},

    # Documentos
    {"modulo": "documentos", "permiso": "ver"},
    {"modulo": "documentos", "permiso": "crear"},
    {"modulo": "documentos", "permiso": "editar"},
    {"modulo": "documentos", "permiso": "eliminar"},

    # CTN (solo ver)
    {"modulo": "ctn", "permiso": "ver"},
]
@router.post("/crear-base")
def crear_permisos_base(db: Session = Depends(get_db)):
    creados = []

    for p in PERMISOS_BASE:
        # Comprobar si existe
        existe = db.execute(
            """
            SELECT id FROM permisos
            WHERE modulo = :modulo AND permiso = :permiso
            """,
            p
        ).fetchone()

        if not existe:
            # Insertar permiso
            db.execute("""
                INSERT INTO permisos (modulo, permiso)
                VALUES (:modulo, :permiso)
            """, p)
            creados.append(f"{p['modulo']}:{p['permiso']}")

    db.commit()

    return {"estado": "OK", "permisos_creados": creados}
