from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
import os

from backend.app.database import get_db
from backend.app.intranet.documentos.service import (
    listar_documentos,
    obtener_documento,
    crear_documento,
    actualizar_documento,
    eliminar_documento
)

# WebSockets
from backend.app.websockets.intranet_ws import intranet_broadcast
from backend.app.websockets.notificaciones_ws import broadcast_notificacion

router = APIRouter(
    prefix="/intranet/documentos",
    tags=["Documentos"]
)

# ---------------------------------------------------------
# LISTAR DOCUMENTOS
# ---------------------------------------------------------
@router.get("/")
def listar(db: Session = Depends(get_db)):
    return listar_documentos(db)

# ---------------------------------------------------------
# OBTENER DOCUMENTO
# ---------------------------------------------------------
@router.get("/{documento_id}")
def obtener(documento_id: int, db: Session = Depends(get_db)):
    return obtener_documento(db, documento_id)

# ---------------------------------------------------------
# CREAR DOCUMENTO
# ---------------------------------------------------------
@router.post("/")
async def crear(
    titulo: str = Form(...),
    concepto: str = Form(...),
    fichero: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    documento = crear_documento(db, titulo, concepto, fichero)

    # 🔥 WebSocket: Intranet (tiempo real)
    await intranet_broadcast({
        "tipo": "nuevo_documento",
        "id": documento.id,
        "titulo": documento.titulo,
        "concepto": documento.concepto
    })

    # 🔥 WebSocket: Notificaciones internas
    await broadcast_notificacion({
        "tipo": "nuevo_documento",
        "titulo": documento.titulo
    })

    return documento

# ---------------------------------------------------------
# ACTUALIZAR DOCUMENTO
# ---------------------------------------------------------
@router.put("/{documento_id}")
async def actualizar(
    documento_id: int,
    titulo: str = Form(...),
    concepto: str = Form(...),
    db: Session = Depends(get_db)
):
    documento = actualizar_documento(db, documento_id, titulo, concepto)

    # 🔥 WebSocket: actualización en tiempo real
    await intranet_broadcast({
        "tipo": "documento_actualizado",
        "id": documento.id,
        "titulo": documento.titulo,
        "concepto": documento.concepto
    })

    return documento

# ---------------------------------------------------------
# ELIMINAR DOCUMENTO
# ---------------------------------------------------------
@router.delete("/{documento_id}")
async def eliminar(documento_id: int, db: Session = Depends(get_db)):
    eliminar_documento(db, documento_id)

    # 🔥 WebSocket: eliminación en tiempo real
    await intranet_broadcast({
        "tipo": "documento_eliminado",
        "id": documento_id
    })

    # 🔥 Notificación interna
    await broadcast_notificacion({
        "tipo": "documento_eliminado",
        "id": documento_id
    })

    return {"status": "ok", "id": documento_id}

# ---------------------------------------------------------
# DESCARGAR DOCUMENTO
# ---------------------------------------------------------
@router.get("/descargar/{documento_id}")
def descargar(documento_id: int, db: Session = Depends(get_db)):
    doc = obtener_documento(db, documento_id)
    ruta = doc.fichero

    if not os.path.exists(ruta):
        return {"error": "archivo no encontrado"}

    return FileResponse(
        ruta,
        media_type="application/octet-stream",
        filename=os.path.basename(ruta)
    )
