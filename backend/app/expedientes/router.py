from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from typing import Optional, List
import json
import io
import openpyxl
from fastapi.responses import StreamingResponse

from backend.app.database import get_db
from backend.app.expedientes.models import Expediente

router = APIRouter(prefix="/expedientes", tags=["Expedientes"])


@router.get("/listado")
def listado_expedientes(
    pagina: int = 1,
    porPagina: int = 20,
    nif: Optional[str] = None,
    actividad: Optional[str] = None,
    fechaInicio: Optional[str] = None,
    fechaFin: Optional[str] = None,
    notario: Optional[str] = None,
    oficina: Optional[str] = None,
    importeMin: Optional[float] = None,
    importeMax: Optional[float] = None,
    ordenMultiple: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Expediente)

    # Filtros
    if nif:
        q = q.filter(Expediente.nif_titular.ilike(f"%{nif}%"))

    if actividad:
        q = q.filter(Expediente.actividad_actual.ilike(f"%{actividad}%"))

    if fechaInicio:
        q = q.filter(Expediente.fecha_alta >= fechaInicio)

    if fechaFin:
        q = q.filter(Expediente.fecha_alta <= fechaFin)

    if notario:
        q = q.filter(Expediente.nif_notario.ilike(f"%{notario}%"))

    if oficina:
        q = q.filter(Expediente.oficina.ilike(f"%{oficina}%"))

    if importeMin is not None:
        q = q.filter(Expediente.importe >= importeMin
