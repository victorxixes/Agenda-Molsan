```python
from fastapi import APIRouter, UploadFile, File, Query, Depends
from sqlalchemy.orm import Session
from datetime import date, datetime

from backend.app.database import get_db
from backend.app.Utilidades.importadores.expedientes_importer import (
    importar_excel_expedientes
)


router = APIRouter(
    prefix="/utilidades/importador-absis",
    tags=["Importador ABSIS"]
)


@router.post("/expedientes")
async def importar_expedientes_absis(
    fichero: UploadFile = File(...),
    fecha: str | None = Query(
        None,
        description=(
            "Fecha a importar en formato YYYY-MM-DD. "
            "Si no se indica, se utiliza la fecha actual."
        )
    ),
    db: Session = Depends(get_db)
):
    """
    Importa expedientes del Excel matriz ABSIS.

    El Excel puede contener un histórico grande, pero el
    importador solamente procesa las filas cuya FECHAALTA
    coincide con la fecha seleccionada.

    Si no se indica fecha:
        se utiliza date.today().

    Si se indica fecha:
        debe tener formato YYYY-MM-DD.
    """

    print("============================================", flush=True)
    print("API IMPORTADOR ABSIS - INICIO", flush=True)
    print("============================================", flush=True)

    # ========================================================
    # 1) VALIDAR FICHERO
    # ========================================================

    if not fichero:
        return {
            "error": "No se ha recibido ningún fichero."
        }

    print(
        f"FICHERO: {fichero.filename}",
        flush=True
    )

    print(
        f"CONTENT TYPE: {fichero.content_type}",
        flush=True
    )

    # ========================================================
    # 2) LEER CONTENIDO DEL ARCHIVO
    # ========================================================

    print(
        "API: leyendo fichero...",
        flush=True
    )

    try:
        contenido = await fichero.read()

    except Exception as e:
        print(
            f"ERROR LEYENDO FICHERO: {e}",
            flush=True
        )

        return {
            "error": "No se pudo leer el fichero.",
            "detalle": str(e)
        }

    print(
        f"FICHERO LEÍDO: {len(contenido)} bytes",
        flush=True
    )

    # ========================================================
    # 3) DETERMINAR FECHA OBJETIVO
    # ========================================================

    if fecha:
        try:
            fecha_objetivo = datetime.strptime(
                fecha,
                "%Y-%m-%d"
            ).date()

        except ValueError:
            return {
                "error": (
                    "Formato de fecha inválido. "
                    "Usa YYYY-MM-DD."
                )
            }

    else:
        fecha_objetivo = date.today()

    print(
        f"FECHA OBJETIVO: {fecha_objetivo}",
        flush=True
    )

    # ========================================================
    # 4) EJECUTAR IMPORTADOR
    # ========================================================

    print(
        "API: iniciando importador...",
        flush=True
    )

    try:
        resultado = importar_excel_expedientes(
            db=db,
            contenido_excel=contenido,
            fecha_objetivo=fecha_objetivo
        )

    except ValueError as e:
        print(
            f"ERROR DE VALIDACIÓN EN IMPORTADOR: {e}",
            flush=True
        )

        db.rollback()

        return {
            "error": str(e)
        }

    except Exception as e:
        print(
            f"ERROR IMPORTANDO ABSIS: {e}",
            flush=True
        )

        db.rollback()

        return {
            "error": "Error durante la importación ABSIS.",
            "detalle": str(e)
        }

    # ========================================================
    # 5) RESPUESTA
    # ========================================================

    print(
        "API: importación finalizada.",
        flush=True
    )

    return {
        "mensaje": "Importación ABSIS completada",
        "fecha_importada": resultado["fecha_importada"],
        "expedientes_creados": resultado["creados"],
        "expedientes_actualizados": resultado["actualizados"],
        "total_filtrados": resultado["total_filtrados"],
        "total_procesados": resultado.get(
            "total_procesados",
            0
        ),
        "errores": resultado.get(
            "errores",
            0
        )
    }
```
