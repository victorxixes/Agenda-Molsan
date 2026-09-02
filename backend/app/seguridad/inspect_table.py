from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.app.database import get_db

router = APIRouter(
    prefix="/seguridad/inspect",
    tags=["Seguridad - Inspect"],
)

@router.get("/table")
def inspect_table(name: str, db: Session = Depends(get_db)):
    try:
        columnas = db.execute(text(f"""
            SELECT column_name 
            FROM information_schema.columns
            WHERE table_name = '{name}';
        """)).fetchall()

        if not columnas:
            raise HTTPException(status_code=404, detail=f"La tabla '{name}' no existe")

        columnas = [c[0] for c in columnas]

        filas = db.execute(text(f"SELECT * FROM {name}")).fetchall()
        datos = [dict(f) for f in filas]

        return {
            "tabla": name,
            "columnas": columnas,
            "filas": datos
        }

    except Exception as e:
        return {"error": str(e)}
