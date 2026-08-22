from sqlalchemy.orm import Session
from datetime import datetime

from backend.app.mensajes.models import Mensaje, UsuarioEstado
from backend.app.mensajes.schemas import MensajeCreate


# ---------------------------------------------------------
# USUARIOS CONECTADOS
# ---------------------------------------------------------

def usuario_conectado(db: Session, usuario_id: int):
    estado = db.query(UsuarioEstado).filter(UsuarioEstado.usuario_id == usuario_id).first()
    if not estado:
        estado = UsuarioEstado(usuario_id=usuario_id, conectado=True)
        db.add(estado)
    else:
        estado.conectado = True
        estado.ultima_actividad = datetime.now()

    db.commit()
    db.refresh(estado)
    return estado


def usuario_desconectado(db: Session, usuario_id: int):
    estado = db.query(UsuarioEstado).filter(UsuarioEstado.usuario_id == usuario_id).first()
    if estado:
        estado.conectado = False
        estado.ultima_actividad = datetime.now()
        db.commit()
        db.refresh(estado)
    return estado


def listar_usuarios_conectados(db: Session):
    return db.query(UsuarioEstado).filter(UsuarioEstado.conectado == True).all()


# ---------------------------------------------------------
# MENSAJES
# ---------------------------------------------------------

def listar_conversacion(db: Session, usuario1: int, usuario2: int):
    return db.query(Mensaje).filter(
        ((Mensaje.remitente_id == usuario1) & (Mensaje.destinatario_id == usuario2)) |
        ((Mensaje.remitente_id == usuario2) & (Mensaje.destinatario_id == usuario1))
    ).order_by(Mensaje.fecha.asc()).all()


def crear_mensaje(db: Session, data: MensajeCreate):
    mensaje = Mensaje(
        remitente_id=data.remitente_id,
        destinatario_id=data.destinatario_id,
        mensaje=data.texto  # el frontend envía "texto"
    )

    db.add(mensaje)
    db.commit()
    db.refresh(mensaje)
    return mensaje


def marcar_conversacion_leida(db: Session, remitente: int, destinatario: int):
    mensajes = db.query(Mensaje).filter(
        Mensaje.remitente_id == remitente,
        Mensaje.destinatario_id == destinatario,
        Mensaje.leido == False
    ).all()

    for m in mensajes:
        m.leido = True

    db.commit()
    return True


def mensajes_no_leidos(db: Session, usuario_id: int):
    try:
        count = db.query(Mensaje).filter(
            Mensaje.destinatario_id == usuario_id,
            Mensaje.leido == False
        ).count()

        return count

    except Exception as e:
        print("ERROR mensajes_no_leidos:", e)
        return 0
