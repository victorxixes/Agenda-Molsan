from fastapi import APIRouter, UploadFile, File, Depends, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.ctn.importer import importar_excel_ctn
from app.intranet.noticias.service import crear_noticia
from app.intranet.documentos.service import crear_documento

router = APIRouter(prefix="/utilidades", tags=["Utilidades"])

# ---------------------------------------------------------
# IMPORTAR CTN (Excel)
# ---------------------------------------------------------
@router.post("/importar-ctn")
def importar_ctn(file: UploadFile = File(...), db: Session = Depends(get_db)):
    return importar_excel_ctn(db, file)

# ---------------------------------------------------------
# CREAR NOTICIA (JSON)
# ---------------------------------------------------------
class NoticiaPayload(BaseModel):
    titulo: str
    descripcion: str
    usuario_id: int

@router.post("/crear-noticia")
def crear_noticia_utilidades(payload: NoticiaPayload, db: Session = Depends(get_db)):
    return crear_noticia(db, payload.titulo, payload.descripcion)

# ---------------------------------------------------------
# SUBIR DOCUMENTO (multipart/form-data)
# ---------------------------------------------------------
@router.post("/subir-documento")
def subir_documento_utilidades(
    titulo: str = Form(...),
    concepto: str = Form(...),
    fichero: UploadFile = File(...),
    usuario_id: int = Form(...),
    db: Session = Depends(get_db)
):
    return crear_documento(db, titulo, concepto, fichero)
