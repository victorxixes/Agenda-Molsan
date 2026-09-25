from fastapi import APIRouter, UploadFile, File, Query, Depends
from sqlalchemy.orm import Session
from datetime import date, datetime

from backend.app.database import get_db
from backend.app.Utilidades.importadores.expedientes_importer import importar_excel_expedientes

router = APIRouter(
    prefix="/utilidades/importador-absis",
    tags=["Importador ABSIS"]
)


@router.post("/expedientes")
async def importar_expedientes_absis(
    fichero: UploadFile = File(...),
    fecha: str | None = Query(
        None,
        description="Fecha a importar en formato YYYY-MM-DD. Si no se indica, se usa la fecha actual."
    ),
    db: Session = Depends(get_db)
):
    """
    Importa expedientes del Excel matriz ABSIS.
    - Si no se indica fecha → importa solo las altas del día actual.
    - Si se indica fecha → importa solo las altas de esa fecha.
    """

    # ============================
    # 1) Leer contenido del archivo
    # ============================
    contenido = await fichero.read()

    # ============================
    # 2) Determinar fecha objetivo
    # ============================
    if fecha:
        try:
            fecha_objetivo = datetime.strptime(fecha, "%Y-%m-%d").date()
        except ValueError:
            return {
                "error": "Formato de fecha inválido. Usa YYYY-MM-DD."
            }
    else:
        fecha_objetivo = date.today()

    # ============================
    # 3) Ejecutar importador
    # ============================
    resultado = importar_excel_expedientes(
        db=db,
        contenido_excel=contenido,
        fecha_objetivo=fecha_objetivo
    )

    # ============================
    # 4) Respuesta
    # ============================
    return {
        "mensaje": "Importación ABSIS completada",
        "fecha_importada": resultado["fecha_importada"],
        "expedientes_creados": resultado["creados"],
        "expedientes_actualizados": resultado["actualizados"],
        "total_filtrados": resultado["total_filtrados"]
    }
