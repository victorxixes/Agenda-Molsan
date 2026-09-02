from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.mensajes.schemas import MensajeCreate
from backend.app.mensajes.service import enviar_mensaje, listar_conversacion, marcar_leido

router = APIRouter(prefix="/mensajes", tags=["Mensajes"])

@router.post("/")
def enviar(datos: MensajeCreate, db: Session = Depends(get_db)):
    return enviar_mensaje(db, datos.dict())

@router.get("/{usuario_id}/{otro_id}")
def conversacion(usuario_id: int, otro_id: int, db: Session = Depends(get_db)):
    return listar_conversacion(db, usuario_id, otro_id)

@router.put("/leido/{mensaje_id}")
def leido(mensaje_id: int, db: Session = Depends(get_db)):
    return marcar_leido(db, mensaje_id)
