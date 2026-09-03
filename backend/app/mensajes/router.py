from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from uuid import uuid4
import os

from backend.app.database import get_db
from backend.app.mensajes.schemas import MensajeCreate
from backend.app.mensajes.service import (
    enviar_mensaje,
    listar_conversacion,
    marcar_leido,
    marcar_conversacion_leida
)
from backend.app.mensajes.ws_manager import manager

router = APIRouter(prefix="/mensajes", tags=["Mensajes"])

# ---------------------------------------------------------
# EMPLEADOS CONECTADOS
# ---------------------------------------------------------
@router.get("/conectados")
def conectados():
    return list(manager.conectados.keys())


# ---------------------------------------------------------
# ENVIAR MENSAJE (REST)
# ---------------------------------------------------------
@router.post("/")
def enviar(datos: MensajeCreate, db: Session = Depends(get_db)):
    return enviar_mensaje(db, datos.dict())


# ---------------------------------------------------------
# SUBIR ARCHIVO (PDF, Word, imágenes…)
# ---------------------------------------------------------
@router.post("/upload")
def subir_archivo(file: UploadFile = File(...)):
    # Validar extensión
    ext = file.filename.split(".")[-1].lower()
    extensiones_permitidas = ["pdf", "doc", "docx", "jpg", "jpeg", "png"]

    if ext not in extensiones_permitidas:
        return {
            "status": "error",
            "msg": f"Extensión no permitida: .{ext}"
        }

    # Crear nombre único
    nombre = f"{uuid4()}.{ext}"

    # Ruta interna
    carpeta = "/tmp/mensajes"
    os.makedirs(carpeta, exist_ok=True)

    ruta = f"{carpeta}/{nombre}"

    # Guardar archivo
    with open(ruta, "wb") as f:
        f.write(file.file.read())

    # URL accesible (el frontend la usará)
    archivo_url = f"/static/mensajes/{nombre}"

    return {
        "status": "ok",
        "archivo_url": archivo_url
    }


# ---------------------------------------------------------
# CONVERSACIÓN ENTRE DOS EMPLEADOS
# ---------------------------------------------------------
@router.get("/{usuario_id}/{otro_id}")
def conversacion(usuario_id: int, otro_id: int, db: Session = Depends(get_db)):
    return listar_conversacion(db, usuario_id, otro_id)


# ---------------------------------------------------------
# MARCAR UN MENSAJE COMO LEÍDO
# ---------------------------------------------------------
@router.put("/leido/{mensaje_id}")
def leido(mensaje_id: int, db: Session = Depends(get_db)):
    return marcar_leido(db, mensaje_id)


# ---------------------------------------------------------
# MARCAR TODA LA CONVERSACIÓN COMO LEÍDA
# ---------------------------------------------------------
@router.put("/leido/conversacion/{usuario_id}/{otro_id}")
def marcar_conversacion(usuario_id: int, otro_id: int, db: Session = Depends(get_db)):
    return marcar_conversacion_leida(db, usuario_id, otro_id)
