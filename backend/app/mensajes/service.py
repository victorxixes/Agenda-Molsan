from sqlalchemy.orm import Session
from datetime import datetime
from backend.app.mensajes.models import Mensaje

# ---------------------------------------------------------
# ENVIAR MENSAJE (REST)
# ---------------------------------------------------------
def enviar_mensaje(db: Session, datos):
    """
    Envía un mensaje desde REST.
    Puede contener texto o archivo_url.
    """
    mensaje = Mensaje(**datos)
    db.add(mensaje)
    db.commit()
    db.refresh(mensaje)
    return mensaje


# ---------------------------------------------------------
# GUARDAR MENSAJE (WebSocket)
# ---------------------------------------------------------
def guardar_mensaje_ws(db: Session, remitente_id: int, destinatario_id: int, contenido: str = None, archivo_url: str = None):
    """
    Guarda un mensaje enviado por WebSocket.
    Puede ser texto, archivo o ambos.
    """
    mensaje = Mensaje(
        remitente_id=remitente_id,
        destinatario_id=destinatario_id,
        contenido=contenido,
        archivo_url=archivo_url,
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
    """
    Devuelve la conversación completa entre dos empleados,
    ordenada por fecha y por ID para evitar desorden.
    """
    return db.query(Mensaje).filter(
        ((Mensaje.remitente_id == usuario_id) & (Mensaje.destinatario_id == otro_id)) |
        ((Mensaje.remitente_id == otro_id) & (Mensaje.destinatario_id == usuario_id))
    ).order_by(Mensaje.fecha.asc(), Mensaje.id.asc()).all()


# ---------------------------------------------------------
# MARCAR UN MENSAJE COMO LEÍDO
# ---------------------------------------------------------
def marcar_leido(db: Session, mensaje_id: int):
    """
    Marca un mensaje individual como leído.
    """
    mensaje = db.query(Mensaje).filter(Mensaje.id == mensaje_id).first()
    if mensaje:
        mensaje.leido = True
        db.commit()
    return mensaje


# ---------------------------------------------------------
# MARCAR TODA LA CONVERSACIÓN COMO LEÍDA
# ---------------------------------------------------------
def marcar_conversacion_leida(db: Session, usuario_id: int, otro_id: int):
    """
    Marca como leídos todos los mensajes que el otro usuario
    envió a este usuario.
    """
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
