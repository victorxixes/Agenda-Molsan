from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db

from backend.app.informes.service import (
    resumen_agenda,
    resumen_apoderados,
    mapa_calor_zonas
)

router = APIRouter(prefix="/informes", tags=["Informes"])

# ---------------------------------------------------------
# INFORME: RESUMEN DE AGENDA (día, semana, mes)
# ---------------------------------------------------------
@router.get("/agenda/{year}/{month}/{day}")
def informe_agenda(year: int, month: int, day: int, db: Session = Depends(get_db)):
    return resumen_agenda(db, year, month, day)

# ---------------------------------------------------------
# INFORME: RENDIMIENTO DE APODERADOS
# ---------------------------------------------------------
@router.get("/apoderados")
def informe_apoderados(db: Session = Depends(get_db)):
    return resumen_apoderados(db)

# ---------------------------------------------------------
# INFORME: MAPA DE CALOR DE ZONAS
# ---------------------------------------------------------
@router.get("/zonas")
def informe_zonas(db: Session = Depends(get_db)):
    return mapa_calor_zonas(db)
