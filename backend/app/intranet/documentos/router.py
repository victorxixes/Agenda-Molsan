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
def crear(
    titulo: str = Form(...),
    concepto: str = Form(...),
    fichero: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    return crear_documento(db, titulo, concepto, fichero)

# ---------------------------------------------------------
# ACTUALIZAR DOCUMENTO
# ---------------------------------------------------------
@router.put("/{documento_id}")
def actualizar(
    documento_id: int,
    titulo: str = Form(...),
    concepto: str = Form(...),
    db: Session = Depends(get_db)
):
    return actualizar_documento(db, documento_id, titulo, concepto)

# ---------------------------------------------------------
# ELIMINAR DOCUMENTO
# ---------------------------------------------------------
@router.delete("/{documento_id}")
def eliminar(documento_id: int, db: Session = Depends(get_db)):
    return eliminar_documento(db, documento_id)

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
