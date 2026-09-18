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

# Seguridad
from backend.app.auth.dependencies import get_current_user
from backend.app.auth.permissions import verificar_permiso

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

@router.get("/")
def listar(search: str | None = None, db: Session = Depends(get_db), usuario = Depends(get_current_user)):
    verificar_permiso(usuario, "intranet", "ver")
    return listar_noticias(db, search)

@router.post("/")
async def crear(payload: NoticiaPayload, db: Session = Depends(get_db), usuario = Depends(get_current_user)):
    verificar_permiso(usuario, "intranet", "crear")

    noticia = crear_noticia(db, payload.titulo, payload.descripcion)

    await intranet_broadcast({
        "tipo": "nueva_noticia",
        "id": noticia.id,
        "titulo": noticia.titulo,
        "descripcion": noticia.descripcion
    })

    await broadcast_notificacion({
        "tipo": "nueva_noticia",
        "titulo": noticia.titulo
    })

    return noticia

@router.get("/{noticia_id}")
def obtener(noticia_id: int, db: Session = Depends(get_db), usuario = Depends(get_current_user)):
    verificar_permiso(usuario, "intranet", "ver")
    return obtener_noticia(db, noticia_id)

@router.put("/{noticia_id}")
async def actualizar(noticia_id: int, payload: NoticiaPayload, db: Session = Depends(get_db), usuario = Depends(get_current_user)):
    verificar_permiso(usuario, "intranet", "editar")

    noticia = actualizar_noticia(db, noticia_id, payload.titulo, payload.descripcion)

    await intranet_broadcast({
        "tipo": "noticia_actualizada",
        "id": noticia.id,
        "titulo": noticia.titulo,
        "descripcion": noticia.descripcion
    })

    return noticia

@router.delete("/{noticia_id}")
async def eliminar(noticia_id: int, db: Session = Depends(get_db), usuario = Depends(get_current_user)):
    verificar_permiso(usuario, "intranet", "eliminar")

    eliminar_noticia(db, noticia_id)

    await intranet_broadcast({
        "tipo": "noticia_eliminada",
        "id": noticia_id
    })

    await broadcast_notificacion({
        "tipo": "noticia_eliminada",
        "id": noticia_id
    })

    return {"status": "ok", "id": noticia_id}
