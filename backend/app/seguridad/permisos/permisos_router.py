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

    # Documentos
    {"modulo": "documentos", "permiso": "ver"},
    {"modulo": "documentos", "permiso": "crear"},
    {"modulo": "documentos", "permiso": "editar"},
    {"modulo": "documentos", "permiso": "eliminar"},

    # Noticias
    {"modulo": "noticias", "permiso": "ver"},
    {"modulo": "noticias", "permiso": "crear"},
    {"modulo": "noticias", "permiso": "editar"},
    {"modulo": "noticias", "permiso": "eliminar"},

    # Mensajes
    {"modulo": "mensajes", "permiso": "ver"},
    {"modulo": "mensajes", "permiso": "crear"},
    {"modulo": "mensajes", "permiso": "editar"},
    {"modulo": "mensajes", "permiso": "eliminar"},

    # Auditoría
    {"modulo": "auditoria", "permiso": "ver"},
    {"modulo": "auditoria", "permiso": "crear"},
    {"modulo": "auditoria", "permiso": "editar"},
    {"modulo": "auditoria", "permiso": "eliminar"},

    # Logs
    {"modulo": "logs", "permiso": "ver"},
    {"modulo": "logs", "permiso": "crear"},
    {"modulo": "logs", "permiso": "editar"},
    {"modulo": "logs", "permiso": "eliminar"},

    # Dashboard
    {"modulo": "dashboard", "permiso": "ver"},
    {"modulo": "dashboard", "permiso": "crear"},
    {"modulo": "dashboard", "permiso": "editar"},
    {"modulo": "dashboard", "permiso": "eliminar"},

    # Maestros
    {"modulo": "maestros", "permiso": "ver"},
    {"modulo": "maestros", "permiso": "crear"},
    {"modulo": "maestros", "permiso": "editar"},
    {"modulo": "maestros", "permiso": "eliminar"},

    # Utilidades
    {"modulo": "utilidades", "permiso": "ver"},
    {"modulo": "utilidades", "permiso": "crear"},
    {"modulo": "utilidades", "permiso": "editar"},
    {"modulo": "utilidades", "permiso": "eliminar"},

    # Seguridad
    {"modulo": "seguridad", "permiso": "ver"},
    {"modulo": "seguridad", "permiso": "crear"},
    {"modulo": "seguridad", "permiso": "editar"},
    {"modulo": "seguridad", "permiso": "eliminar"},

    # Realtime
    {"modulo": "realtime", "permiso": "ver"},
    {"modulo": "realtime", "permiso": "crear"},
    {"modulo": "realtime", "permiso": "editar"},
    {"modulo": "realtime", "permiso": "eliminar"},

    # CTN (solo ver)
    {"modulo": "ctn", "permiso": "ver"},
    {"modulo": "ctn", "permiso": "crear"},
    {"modulo": "ctn", "permiso": "editar"},
    {"modulo": "ctn", "permiso": "eliminar"},
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
