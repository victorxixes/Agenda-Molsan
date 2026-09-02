from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.Utilidades.importadores.ctn_importer import importar_excel_ctn

router = APIRouter(prefix="/utilidades", tags=["Utilidades"])

@router.post("/importar/ctn")
def importar_ctn(file: UploadFile = File(...), db: Session = Depends(get_db)):
    return importar_excel_ctn(db, file)
