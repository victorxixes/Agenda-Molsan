from fastapi import APIRouter, UploadFile, File
from backend.app.database import get_db
from backend.app.Utilidades.importadores.ctn_importer import importar_ctn_desde_excel

router = APIRouter(prefix="/utilidades", tags=["Utilidades"])

@router.post("/ctn/importar")
async def importar_ctn(fichero: UploadFile = File(...)):
    contenido = await fichero.read()  # lectura segura en async
    db = next(get_db())
    total = importar_ctn_desde_excel(db, contenido)
    return {"importados": total}




