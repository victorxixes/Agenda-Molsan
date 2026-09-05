from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db

router = APIRouter(
    prefix="/herramientasswager",
    tags=["Herramientas Swagger"]
)

TABLAS_PERMITIDAS = {"roles", "empleados", "departamentos", "secciones"}

@router.post("/drop-table")
def drop_table(nombre: str, db: Session = Depends(get_db)):
    if nombre not in TABLAS_PERMITIDAS:
        raise HTTPException(status_code=400, detail="Tabla no permitida")

    db.execute(f"DROP TABLE IF EXISTS {nombre};")
    db.commit()

    return {"estado": "OK", "tabla_borrada": nombre}
