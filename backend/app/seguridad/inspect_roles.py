from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.app.database import get_db

router = APIRouter(
    prefix="/seguridad/inspect",
    tags=["Seguridad - Inspect"],
)

@router.get("/roles")
def inspect_roles(db: Session = Depends(get_db)):
    filas = db.execute(text("SELECT * FROM roles")).fetchall()
    columnas = [c for c in filas[0].keys()] if filas else []
    datos = [dict(f) for f in filas]
    return {
        "columnas": columnas,
        "datos": datos
    }
