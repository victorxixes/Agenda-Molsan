from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from backend.app.database import get_db
from backend.app.intranet.noticias.service import (
    listar_noticias,
    obtener_noticia,
    crear_noticia,
    actualizar_noticia,
    eliminar_noticia
)

# WebSockets
from backend.app.websockets.intranet_ws import intranet_broadcast
from backend.app.websockets.notificaciones_ws import broadcast_notificacion


router = APIRouter(
    prefix="/intranet/noticias",
    tags=["Noticias"]
)

class NoticiaPayload(BaseModel):
    titulo: str
    descripcion: str

# ---------------------------------------------------------
# LISTAR NOTICIAS
# ---------------------------------------------------------
@router.get("/")
def listar(db: Session = Depends(get_db)):
    return listar_noticias(db)

# ---------------------------------------------------------
# CREAR NOTICIA
# ---------------------------------------------------------
@router.post("/")
async def crear(payload: NoticiaPayload, db: Session = Depends(get_db)):
    noticia = crear_noticia(db, payload.titulo, payload.descripcion)

    # 🔥 WebSocket: Intranet (tiempo real)
    await intranet_broadcast({
        "tipo": "nueva_noticia",
        "id": noticia.id,
        "titulo": noticia.titulo,
        "descripcion": noticia.descripcion
    })

    # 🔥 WebSocket: Notificaciones internas
    await broadcast_notificacion({
        "tipo": "nueva_noticia",
        "titulo": noticia.titulo
    })

    return noticia

# ---------------------------------------------------------
# OBTENER NOTICIA
# ---------------------------------------------------------
@router.get("/{noticia_id}")
def obtener(noticia_id: int, db: Session = Depends(get_db)):
    return obtener_noticia(db, noticia_id)

# ---------------------------------------------------------
# ACTUALIZAR NOTICIA
# ---------------------------------------------------------
@router.put("/{noticia_id}")
async def actualizar(noticia_id: int, payload: NoticiaPayload, db: Session = Depends(get_db)):
    noticia = actualizar_noticia(db, noticia_id, payload.titulo, payload.descripcion)

    # 🔥 WebSocket: actualización en tiempo real
    await intranet_broadcast({
        "tipo": "noticia_actualizada",
        "id": noticia.id,
        "titulo": noticia.titulo,
        "descripcion": noticia.descripcion
    })

    return noticia

# ---------------------------------------------------------
# ELIMINAR NOTICIA
# ---------------------------------------------------------
@router.delete("/{noticia_id}")
async def eliminar(noticia_id: int, db: Session = Depends(get_db)):
    eliminar_noticia(db, noticia_id)

    # 🔥 WebSocket: eliminación en tiempo real
    await intranet_broadcast({
        "tipo": "noticia_eliminada",
        "id": noticia_id
    })

    # 🔥 Notificación interna
    await broadcast_notificacion({
        "tipo": "noticia_eliminada",
        "id": noticia_id
    })

    return {"status": "ok", "id": noticia_id}
