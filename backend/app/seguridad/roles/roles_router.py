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
        # Comprobar si existe
        existe = db.execute(
            "SELECT id FROM roles WHERE id = :id",
            {"id": r["id"]}
        ).fetchone()

        if not existe:
            # Insertar rol
            db.execute("""
                INSERT INTO roles (id, nombre, descripcion, permisos_modulo_dict, modulos_visibles_list)
                VALUES (:id, :nombre, :descripcion, '{}'::jsonb, '[]'::jsonb)
            """, r)
            creados.append(r["nombre"])

    db.commit()

    return {"estado": "OK", "roles_creados": creados}
