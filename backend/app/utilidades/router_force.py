from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.app.database import get_db

router = APIRouter(prefix="/force", tags=["Force"])

@router.delete("/drop_empleados")
def drop_empleados(db: Session = Depends(get_db)):
    db.execute(text("DROP TABLE IF EXISTS empleados CASCADE;"))
    db.execute(text("DROP TABLE IF EXISTS empleados_v2 CASCADE;"))
    db.commit()
    return {"status": "ok", "message": "Tablas eliminadas"}
@router.delete("/drop_empleados_v2")
def drop_empleados_v2(db: Session = Depends(get_db)):
    db.execute(text("DROP TABLE IF EXISTS empleados_v2 CASCADE;"))
    db.commit()
    return {"status": "ok", "message": "Tabla empleados_v2 eliminada"}
