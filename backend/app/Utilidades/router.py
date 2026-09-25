from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from backend.app.db import get_db
from backend.app.Utilidades.importadores.ctn_importer import importar_ctn_desde_excel
from app.Utilidades.importadores.expedientes_importer import importar_excel_expedientes

router = APIRouter(prefix="/utilidades", tags=["Utilidades"])

@router.post("/ctn/importar")
async def importar_ctn(
    fichero: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    contenido = await fichero.read()
    total = importar_ctn_desde_excel(db, contenido)
    return {"importados": total}




@router.post("/importar/expedientes")
async def importar_expedientes(fichero: UploadFile = File(...), db: Session = Depends(get_db)):
    contenido = await fichero.read()
    resultado = importar_excel_expedientes(db, contenido)
    return resultado
