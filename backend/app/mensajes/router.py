from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.empleados.service import obtener_empleado

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


# ⭐ LISTAR CONECTADOS (solo empleados, con foto y nombre)
@router.get("/conectados")
def conectados(db: Session = Depends(get_db)):
    conectados_raw = listar_usuarios_conectados(db)
    resultado = []

    for c in conectados_raw:
        empleado = obtener_empleado(db, c.usuario_id)

        # Solo empleados
        if not empleado:
            continue

        resultado.append({
            "usuario_id": empleado.id,
            "nombre": empleado.nombre,
            "apellidos": empleado.apellidos,
            "foto": empleado.foto,
            "rol": empleado.rol_nombre,
            "ultima_actividad": c.ultima_actividad,
        })

    return resultado


# ⭐ CONECTAR
@router.post("/conectar/{usuario_id}")
def conectar(usuario_id: int, db: Session = Depends(get_db)):
    return usuario_conectado(db, usuario_id)


# ⭐ DESCONECTAR
@router.post("/desconectar/{usuario_id}")
def desconectar(usuario_id: int, db: Session = Depends(get_db)):
    return usuario_desconectado(db, usuario_id)


# ⭐ CONVERSACIÓN
@router.get("/conversacion/{usuario1}/{usuario2}")
def conversacion(usuario1: int, usuario2: int, db: Session = Depends(get_db)):
    return listar_conversacion(db, usuario1, usuario2)


# ⭐ ENVIAR MENSAJE
@router.post("/")
def enviar(data: MensajeCreate, db: Session = Depends(get_db)):
    return crear_mensaje(db, data)


# ⭐ MARCAR LEÍDO
@router.put("/leido/{remitente}/{destinatario}")
def marcar_leido(remitente: int, destinatario: int, db: Session = Depends(get_db)):
    return marcar_conversacion_leida(db, remitente, destinatario)


# ⭐ NO LEÍDOS
@router.get("/no-leidos/{usuario_id}")
def no_leidos(usuario_id: int, db: Session = Depends(get_db)):
    return mensajes_no_leidos(db, usuario_id)
