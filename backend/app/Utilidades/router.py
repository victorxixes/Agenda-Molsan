from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.Utilidades.importadores.ctn_importer import importar_ctn_desde_excel

router = APIRouter(prefix="/utilidades", tags=["Utilidades"])

@router.post("/ctn/importar")
def importar_ctn(fichero: UploadFile = File(...)):
    db = next(get_db())  # obtener la sesión manualmente
    total = importar_ctn_desde_excel(db, fichero)
    return {"importados": total}


