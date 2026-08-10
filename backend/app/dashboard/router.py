from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dashboard.service import resumen_agenda

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/agenda/{empleado_id}")
def dashboard_agenda(empleado_id: int, db: Session = Depends(get_db)):
    return resumen_agenda(db, empleado_id)

@router.get("/resumen")
def dashboard_resumen(db: Session = Depends(get_db)):
    # Aquí puedes devolver datos reales si quieres
    return {
        "citas_hoy": 0,
        "citas_semana": 0,
        "firmas_hoy": {"vc": 0, "p": 0},
        "firmas_semana": {"vc": 0, "p": 0},
        "firmas_por_mes": {},
    }
