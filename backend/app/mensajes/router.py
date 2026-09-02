from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.mensajes.schemas import MensajeCreate
from backend.app.mensajes.service import enviar_mensaje, listar_conversacion, marcar_leido
from backend.app.mensajes.ws_manager import manager

router = APIRouter(prefix="/mensajes", tags=["Mensajes"])

# -------------------------
# EMPLEADOS CONECTADOS
# -------------------------
@router.get("/conectados")
def conectados():
    return list(manager.conectados.keys())

# -------------------------
# ENVIAR MENSAJE
# -------------------------
@router.post("/")
def enviar(datos: MensajeCreate, db: Session = Depends(get_db)):
    return enviar_mensaje(db, datos.dict())

# -------------------------
# CONVERSACIÓN ENTRE DOS EMPLEADOS
# -------------------------
@router.get("/{usuario_id}/{otro_id}")
def conversacion(usuario_id: int, otro_id: int, db: Session = Depends(get_db)):
    return listar_conversacion(db, usuario_id, otro_id)

# -------------------------
# MARCAR MENSAJE COMO LEÍDO
# -------------------------
@router.put("/leido/{mensaje_id}")
def leido(mensaje_id: int, db: Session = Depends(get_db)):
    return marcar_leido(db, mensaje_id)

