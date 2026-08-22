from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.mensajes.service import (
    usuario_conectado,
    usuario_desconectado,
    listar_usuarios_conectados,
    listar_conversacion,
    crear_mensaje,
    marcar_conversacion_leida,
    mensajes_no_leidos
)

from backend.app.mensajes.schemas import MensajeCreate

router = APIRouter(prefix="/mensajes", tags=["Mensajes"])

@router.post("/conectar/{usuario_id}")
def conectar(usuario_id: int, db: Session = Depends(get_db)):
    return usuario_conectado(db, usuario_id)

@router.post("/desconectar/{usuario_id}")
def desconectar(usuario_id: int, db: Session = Depends(get_db)):
    return usuario_desconectado(db, usuario_id)

@router.get("/conectados")
def conectados(db: Session = Depends(get_db)):
    return listar_usuarios_conectados(db)

@router.get("/conversacion/{usuario1}/{usuario2}")
def conversacion(usuario1: int, usuario2: int, db: Session = Depends(get_db)):
    return listar_conversacion(db, usuario1, usuario2)

@router.post("/")
def enviar(data: MensajeCreate, db: Session = Depends(get_db)):
    return crear_mensaje(db, data)

@router.put("/leido/{remitente}/{destinatario}")
def marcar_leido(remitente: int, destinatario: int, db: Session = Depends(get_db)):
    return marcar_conversacion_leida(db, remitente, destinatario)

@router.get("/no-leidos/{usuario_id}")
def no_leidos(usuario_id: int, db: Session = Depends(get_db)):
    return mensajes_no_leidos(db, usuario_id)

@router.get("/debug/columns")
def debug_columns():
    return Mensaje.__table__.columns.keys()
