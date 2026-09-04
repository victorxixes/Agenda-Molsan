from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db

router = APIRouter(
    prefix="/seguridad/permisos",
    tags=["Seguridad - Permisos"]
)

@router.post("/repair-create-table")
def repair_create_table(db: Session = Depends(get_db)):
    db.execute("""
        CREATE TABLE IF NOT EXISTS permisos (
            id SERIAL PRIMARY KEY,
            modulo VARCHAR(255) NOT NULL,
            permiso VARCHAR(255) NOT NULL
        );
    """)
    db.commit()

    return {"estado": "OK", "tabla": "permisos creada o ya existente"}
