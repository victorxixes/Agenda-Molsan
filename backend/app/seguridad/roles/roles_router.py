from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db

router = APIRouter(
    prefix="/seguridad/roles",
    tags=["Seguridad - Roles"]
)

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
        # Comprobar si existe
        existe = db.execute(
            "SELECT id FROM roles WHERE id = :id",
            {"id": r["id"]}
        ).fetchone()

        if not existe:
            # Insertar SOLO las columnas reales
            db.execute("""
                INSERT INTO roles (id, nombre)
                VALUES (:id, :nombre)
            """, r)
            creados.append(r["nombre"])

    db.commit()

    return {"estado": "OK", "roles_creados": creados}
