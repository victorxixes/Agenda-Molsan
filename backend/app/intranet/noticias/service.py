from datetime import datetime
from sqlalchemy.orm import Session

from backend.app.intranet.noticias.models import Noticia

# ---------------------------------------------------------
# LISTAR NOTICIAS
# ---------------------------------------------------------
def listar_noticias(db: Session):
    return (
        db.query(Noticia)
        .order_by(Noticia.fecha_publicacion.desc())
        .all()
    )

# ---------------------------------------------------------
# OBTENER NOTICIA
# ---------------------------------------------------------
def obtener_noticia(db: Session, noticia_id: int):
    return (
        db.query(Noticia)
        .filter(Noticia.id == noticia_id)
        .first()
    )

# ---------------------------------------------------------
# CREAR NOTICIA
# ---------------------------------------------------------
def crear_noticia(db: Session, titulo: str, descripcion: str):
    noticia = Noticia(
        titulo=titulo,
        descripcion=descripcion,
        fecha_publicacion=datetime.utcnow(),
        usuario_id=None
    )

    db.add(noticia)
    db.commit()
    db.refresh(noticia)

    return noticia

# ---------------------------------------------------------
# ACTUALIZAR NOTICIA
# ---------------------------------------------------------
def actualizar_noticia(db: Session, noticia_id: int, titulo: str, descripcion: str):
    noticia = obtener_noticia(db, noticia_id)
    if noticia:
        noticia.titulo = titulo
        noticia.descripcion = descripcion
        db.commit()
        db.refresh(noticia)
    return noticia

# ---------------------------------------------------------
# ELIMINAR NOTICIA
# ---------------------------------------------------------
def eliminar_noticia(db: Session, noticia_id: int):
    noticia = obtener_noticia(db, noticia_id)
    if noticia:
        db.delete(noticia)
        db.commit()
    return noticia
