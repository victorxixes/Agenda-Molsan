import os
from datetime import datetime
from sqlalchemy.orm import Session
from app.intranet.documentos.models import Documento

UPLOAD_DIR = "/tmp/documentos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ---------------------------------------------------------
# LISTAR DOCUMENTOS
# ---------------------------------------------------------
def listar_documentos(db: Session):
    return (
        db.query(Documento)
        .order_by(Documento.fecha_publicacion.desc())
        .all()
    )

# ---------------------------------------------------------
# OBTENER DOCUMENTO
# ---------------------------------------------------------
def obtener_documento(db: Session, documento_id: int):
    return (
        db.query(Documento)
        .filter(Documento.id == documento_id)
        .first()
    )

# ---------------------------------------------------------
# CREAR DOCUMENTO
# ---------------------------------------------------------
def crear_documento(db: Session, titulo: str, concepto: str, archivo):
    contenido = archivo.file.read()
    ruta_fichero = os.path.join(UPLOAD_DIR, archivo.filename)

    with open(ruta_fichero, "wb") as f:
        f.write(contenido)

    doc = Documento(
        titulo=titulo,
        concepto=concepto,
        fichero=ruta_fichero,
        fecha_publicacion=datetime.utcnow(),
        usuario_id=None  # Ajusta si usas autenticación
    )

    db.add(doc)
    db.commit()
    db.refresh(doc)

    return doc

# ---------------------------------------------------------
# ACTUALIZAR DOCUMENTO
# ---------------------------------------------------------
def actualizar_documento(db: Session, documento_id: int, titulo: str, concepto: str):
    doc = obtener_documento(db, documento_id)
    if doc:
        doc.titulo = titulo
        doc.concepto = concepto
        db.commit()
        db.refresh(doc)
    return doc

# ---------------------------------------------------------
# ELIMINAR DOCUMENTO
# ---------------------------------------------------------
def eliminar_documento(db: Session, documento_id: int):
    doc = obtener_documento(db, documento_id)
    if doc:
        db.delete(doc)
        db.commit()
    return doc
