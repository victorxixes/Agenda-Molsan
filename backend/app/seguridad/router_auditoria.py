from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.models import Auditoria

router = APIRouter(prefix="/seguridad", tags=["Seguridad"])

@router.get("/auditoria")
def listar_auditoria(db: Session = Depends(get_db)):
    registros = db.query(Auditoria).order_by(Auditoria.creado_en.desc()).all()
    return registros
