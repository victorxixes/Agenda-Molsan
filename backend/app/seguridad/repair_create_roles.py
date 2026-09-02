from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.app.database import get_db
from backend.app.seguridad.init_roles import init_roles

router = APIRouter(
    prefix="/seguridad/repair-create-roles",
    tags=["Seguridad - Repair Create Roles"],
)

@router.post("")
def repair_create_roles(db: Session = Depends(get_db)):
    # Crear tabla roles si no existe
    db.execute(text("""
        CREATE TABLE IF NOT EXISTS roles (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            descripcion VARCHAR(255),
            permisos_modulo_dict JSON DEFAULT '{}'::json,
            modulos_visibles_list JSON DEFAULT '[]'::json
        );
    """))

    db.commit()

    # Inicializar roles base
    init_roles()

    return {
        "estado": "OK - tabla roles creada y roles base inicializados"
    }
