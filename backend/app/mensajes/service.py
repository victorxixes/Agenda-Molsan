from sqlalchemy.orm import Session
from datetime import datetime
from backend.app.mensajes.models import Mensaje

# ---------------------------------------------------------
# ENVIAR MENSAJE (REST)
# ---------------------------------------------------------
def enviar_mensaje(db: Session, datos):
    mensaje = Mensaje(**datos)
    db.add(mensaje)
    db.commit()
    db.refresh(mensaje)
    return mensaje


# ---------------------------------------------------------
# GUARDAR MENSAJE (WebSocket)
# ---------------------------------------------------------
def guardar_mensaje_ws(db: Session, remitente_id: int, destinatario_id: int, contenido: str):
    mensaje = Mensaje(
        remitente_id=remitente_id,
        destinatario_id=destinatario_id,
        contenido=contenido,
        fecha=datetime.now(),
        leido=False
    )

    db.add(mensaje)
    db.commit()
    db.refresh(mensaje)

    return mensaje


# ---------------------------------------------------------
# LISTAR CONVERSACIÓN ENTRE DOS EMPLEADOS
# ---------------------------------------------------------
def listar_conversacion(db: Session, usuario_id: int, otro_id: int):
    return db.query(Mensaje).filter(
        ((Mensaje.remitente_id == usuario_id) & (Mensaje.destinatario_id == otro_id)) |
        ((Mensaje.remitente_id == otro_id) & (Mensaje.destinatario_id == usuario_id))
    ).order_by(Mensaje.fecha.asc(), Mensaje.id.asc()).all()


# ---------------------------------------------------------
# MARCAR UN MENSAJE COMO LEÍDO
# ---------------------------------------------------------
def marcar_leido(db: Session, mensaje_id: int):
    mensaje = db.query(Mensaje).filter(Mensaje.id == mensaje_id).first()
    if mensaje:
        mensaje.leido = True
        db.commit()
    return mensaje


# ---------------------------------------------------------
# MARCAR TODA LA CONVERSACIÓN COMO LEÍDA
# ---------------------------------------------------------
def marcar_conversacion_leida(db: Session, usuario_id: int, otro_id: int):
    mensajes = db.query(Mensaje).filter(
        Mensaje.remitente_id == otro_id,
        Mensaje.destinatario_id == usuario_id,
        Mensaje.leido == False
    ).all()

    for m in mensajes:
        m.leido = True

    db.commit()

    return {
        "status": "ok",
        "marcados": len(mensajes)
    }

