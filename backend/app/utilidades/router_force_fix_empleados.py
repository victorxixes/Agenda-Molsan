from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.database import get_db

router = APIRouter(prefix="/force", tags=["Force"])

@router.post("/fix_empleados_columns")
def fix_empleados_columns(db: Session = Depends(get_db)):
    comandos = [
        "ALTER TABLE empleados ADD COLUMN IF NOT EXISTS direccion VARCHAR(255);",
        "ALTER TABLE empleados ADD COLUMN IF NOT EXISTS fecha_nacimiento VARCHAR(20);",
        "ALTER TABLE empleados ADD COLUMN IF NOT EXISTS alergias TEXT;",
        "ALTER TABLE empleados ADD COLUMN IF NOT EXISTS persona_contacto VARCHAR(150);",
        "ALTER TABLE empleados ADD COLUMN IF NOT EXISTS telefono_contacto VARCHAR(20);",
        "ALTER TABLE empleados ADD COLUMN IF NOT EXISTS observaciones TEXT;",
        "ALTER TABLE empleados ADD COLUMN IF NOT EXISTS modulos_visibles_list JSONB;",
        "ALTER TABLE empleados ADD COLUMN IF NOT EXISTS permisos_modulo_dict JSONB;"
    ]

    for cmd in comandos:
        db.execute(text(cmd))

    db.commit()
    return {"status": "ok", "message": "Columnas de empleados reparadas"}
