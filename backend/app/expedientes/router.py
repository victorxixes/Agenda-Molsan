from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.expedientes.models import Expediente

router = APIRouter(prefix="/expedientes", tags=["Expedientes"])

@router.get("/listado")
def listado_expedientes(
    pagina: int = 1,
    porPagina: int = 20,
    nif: str | None = None,
    actividad: str | None = None,
    fecha: str | None = None,
    notario: str | None = None,
    finca: str | None = None,
    importeMin: float | None = None,
    importeMax: float | None = None,
    ordenColumna: str = "fecha_alta",
    ordenDireccion: str = "desc",
    db: Session = Depends(get_db)
):

    q = db.query(Expediente)

    # Filtros
    if nif:
        q = q.filter(Expediente.nifcliente.ilike(f"%{nif}%"))

    if actividad:
        q = q.filter(Expediente.actividad_actual.ilike(f"%{actividad}%"))

    if fecha:
        q = q.filter(Expediente.fecha_alta == fecha)

    if notario:
        q = q.filter(Expediente.nifnotario.ilike(f"%{notario}%"))

    if finca:
        q = q.filter(Expediente.finca.ilike(f"%{finca}%"))

    if importeMin is not None:
        q = q.filter(Expediente.importe >= importeMin)

    if importeMax is not None:
        q = q.filter(Expediente.importe <= importeMax)

    # Ordenación
    columna = getattr(Expediente, ordenColumna, Expediente.fecha_alta)
    if ordenDireccion == "asc":
        q = q.order_by(columna.asc())
    else:
        q = q.order_by(columna.desc())

    # Paginación
    total = q.count()
    total_paginas = (total + porPagina - 1) // porPagina

    items = q.offset((pagina - 1) * porPagina).limit(porPagina).all()

    return {
        "items": items,
        "total_paginas": total_paginas
    }
