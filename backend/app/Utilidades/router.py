from fastapi import APIRouter, UploadFile, File
from backend.app.database import get_db
from backend.app.Utilidades.importadores.ctn_importer import importar_ctn_desde_excel

router = APIRouter(prefix="/utilidades", tags=["Utilidades"])

@router.post("/ctn/importar")
def importar_ctn(fichero: UploadFile = File(...)):
    # Obtener la sesión manualmente (máxima compatibilidad con Swagger + Render)
    db = next(get_db())

    total = importar_ctn_desde_excel(db, fichero)
    return {"importados": total}



