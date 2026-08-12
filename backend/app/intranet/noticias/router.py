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
def crear(payload: NoticiaPayload, db: Session = Depends(get_db)):
    return crear_noticia(db, payload.titulo, payload.descripcion)

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
def actualizar(noticia_id: int, payload: NoticiaPayload, db: Session = Depends(get_db)):
    return actualizar_noticia(db, noticia_id, payload.titulo, payload.descripcion)

# ---------------------------------------------------------
# ELIMINAR NOTICIA
# ---------------------------------------------------------
@router.delete("/{noticia_id}")
def eliminar(noticia_id: int, db: Session = Depends(get_db)):
    return eliminar_noticia(db, noticia_id)
