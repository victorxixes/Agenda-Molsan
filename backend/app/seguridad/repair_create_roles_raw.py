from fastapi import APIRouter, Depends
from sqlalchemy import text
from backend.app.database import get_db

router = APIRouter(
    prefix="/seguridad/repair-create-roles-raw",
    tags=["Seguridad - Repair RAW"],
)

@router.post("")
def repair_create_roles_raw(db = Depends(get_db)):
    try:
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

        return {"estado": "OK - tabla roles creada"}

    except Exception as e:
        return {"error": str(e)}
