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

    {"modulo": "empleados", "permiso": "ver"},
    {"modulo": "empleados", "permiso": "crear"},
    {"modulo": "empleados", "permiso": "editar"},
    {"modulo": "empleados", "permiso": "eliminar"},

    {"modulo": "intranet", "permiso": "ver"},
    {"modulo": "intranet", "permiso": "crear"},
    {"modulo": "intranet", "permiso": "editar"},
    {"modulo": "intranet", "permiso": "eliminar"},

    {"modulo": "documentos", "permiso": "ver"},
    {"modulo": "documentos", "permiso": "crear"},
    {"modulo": "documentos", "permiso": "editar"},
    {"modulo": "documentos", "permiso": "eliminar"},

    {"modulo": "noticias", "permiso": "ver"},
    {"modulo": "noticias", "permiso": "crear"},
    {"modulo": "noticias", "permiso": "editar"},
    {"modulo": "noticias", "permiso": "eliminar"},

    {"modulo": "mensajes", "permiso": "ver"},
    {"modulo": "mensajes", "permiso": "crear"},
    {"modulo": "mensajes", "permiso": "editar"},
    {"modulo": "mensajes", "permiso": "eliminar"},

    {"modulo": "auditoria", "permiso": "ver"},
    {"modulo": "auditoria", "permiso": "crear"},
    {"modulo": "auditoria", "permiso": "editar"},
    {"modulo": "auditoria", "permiso": "eliminar"},

    {"modulo": "logs", "permiso": "ver"},
    {"modulo": "logs", "permiso": "crear"},
    {"modulo": "logs", "permiso": "editar"},
    {"modulo": "logs", "permiso": "eliminar"},

    {"modulo": "dashboard", "permiso": "ver"},
    {"modulo": "dashboard", "permiso": "crear"},
    {"modulo": "dashboard", "permiso": "editar"},
    {"modulo": "dashboard", "permiso": "eliminar"},

    {"modulo": "maestros", "permiso": "ver"},
    {"modulo": "maestros", "permiso": "crear"},
    {"modulo": "maestros", "permiso": "editar"},
    {"modulo": "maestros", "permiso": "eliminar"},

    {"modulo": "utilidades", "permiso": "ver"},
    {"modulo": "utilidades", "permiso": "crear"},
    {"modulo": "utilidades", "permiso": "editar"},
    {"modulo": "utilidades", "permiso": "eliminar"},

    {"modulo": "seguridad", "permiso": "ver"},
    {"modulo": "seguridad", "permiso": "crear"},
    {"modulo": "seguridad", "permiso": "editar"},
    {"modulo": "seguridad", "permiso": "eliminar"},

    {"modulo": "realtime", "permiso": "ver"},
    {"modulo": "realtime", "permiso": "crear"},
    {"modulo": "realtime", "permiso": "editar"},
    {"modulo": "realtime", "permiso": "eliminar"},

    {"modulo": "ctn", "permiso": "ver"},
    {"modulo": "ctn", "permiso": "crear"},
    {"modulo": "ctn", "permiso": "editar"},
    {"modulo": "ctn", "permiso": "eliminar"},
]

@router.get("/")
def obtener_permisos(db: Session = Depends(get_db)):
    permisos = db.execute("""
        SELECT id, modulo, permiso
        FROM permisos
        ORDER BY modulo, permiso
    """).fetchall()

    return [
        {"id": p.id, "modulo": p.modulo, "permiso": p.permiso}
        for p in permisos
    ]

@router.post("/crear-base")
def crear_permisos_base(db: Session = Depends(get_db)):
    creados = []

    for p in PERMISOS_BASE:
        existe = db.execute(
            """
            SELECT id FROM permisos
            WHERE modulo = :modulo AND permiso = :permiso
            """,
            p
        ).fetchone()

        if not existe:
            db.execute("""
                INSERT INTO permisos (modulo, permiso)
                VALUES (:modulo, :permiso)
            """, p)
            creados.append(f"{p['modulo']}:{p['permiso']}")

    db.commit()
    return {"estado": "OK", "permisos_creados": creados}
