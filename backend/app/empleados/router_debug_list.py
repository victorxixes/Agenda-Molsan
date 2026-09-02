from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.empleados.service import listar_empleados

router = APIRouter(prefix="/empleados-debug", tags=["Empleados Debug"])

@router.get("/listar")
def debug_listar_empleados(db: Session = Depends(get_db)):
    try:
        empleados = listar_empleados(db)
        return {"status": "ok", "total": len(empleados)}
    except Exception as e:
        return {
            "status": "error",
            "error_type": str(type(e)),
            "error_message": str(e)
        }
