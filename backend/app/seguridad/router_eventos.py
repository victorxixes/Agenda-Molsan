from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.models import EventoSeguridad
from backend.app.seguridad.schemas import Evento

router = APIRouter(prefix="/seguridad", tags=["Seguridad"])

@router.get("/eventos", response_model=list[Evento])
def listar_eventos(db: Session = Depends(get_db)):
    eventos = db.query(EventoSeguridad).order_by(EventoSeguridad.creado_en.desc()).all()
    return eventos
