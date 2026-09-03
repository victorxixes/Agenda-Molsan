from fastapi import APIRouter, UploadFile, File, Depends
from backend.app.Utilidades.importadores.ctn_importer import leer_ctn_excel

router = APIRouter(
    prefix="/utilidades",
    tags=["Utilidades"]
)

@router.post("/ctn/importar")
async def importar_ctn_excel(
    fichero: UploadFile = File(...),
):
    """
    Importa el Excel de CTN y devuelve los datos tal cual
    sin guardar en BD, sin transformar nada.
    """
    datos = leer_ctn_excel(fichero)
    return {"filas": datos}
