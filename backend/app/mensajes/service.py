from sqlalchemy.orm import Session
from backend.app.mensajes.models import Mensaje

def enviar_mensaje(db: Session, datos):
    mensaje = Mensaje(**datos)
    db.add(mensaje)
    db.commit()
    db.refresh(mensaje)
    return mensaje

def listar_conversacion(db: Session, usuario_id: int, otro_id: int):
    return db.query(Mensaje).filter(
        ((Mensaje.remitente_id == usuario_id) & (Mensaje.destinatario_id == otro_id)) |
        ((Mensaje.remitente_id == otro_id) & (Mensaje.destinatario_id == usuario_id))
    ).order_by(Mensaje.fecha.asc()).all()

def marcar_leido(db: Session, mensaje_id: int):
    mensaje = db.query(Mensaje).filter(Mensaje.id == mensaje_id).first()
    if mensaje:
        mensaje.leido = True
        db.commit()
    return mensaje
