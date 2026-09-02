from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.auditoria.service import obtener_auditoria, obtener_metricas

router = APIRouter(
    prefix="/seguridad/auditoria",
    tags=["Seguridad - Auditoría"]
)

@router.get("/")
def listar_auditoria(db: Session = Depends(get_db)):
    return obtener_auditoria(db)

@router.get("/metricas")
def metricas(db: Session = Depends(get_db)):
    return obtener_metricas(db)
