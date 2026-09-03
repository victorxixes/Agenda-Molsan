from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from backend.app.database import get_db
from backend.app.ctn.models import Notaria
from backend.app.ctn.service import obtener_notaria
from backend.app.agenda.models import Cita

router = APIRouter(prefix="/ctn", tags=["CTN"])

# ---------------------------------------------------------
# LISTAR CON FILTROS + BÚSQUEDA + PAGINACIÓN
# ---------------------------------------------------------
@router.get("/notarias")
def listar(
    db: Session = Depends(get_db),
    provincia: str | None = None,
    municipio: str | None = None,
    vc: str | None = None,
    apoderado: str | None = None,
    q: str | None = None,
    page: int = 1,
    page_size: int = 50
):
    query = db.query(Notaria)

    if provincia:
        query = query.filter(Notaria.provincia.ilike(f"%{provincia}%"))

    if municipio:
        query = query.filter(Notaria.municipio.ilike(f"%{municipio}%"))

    if vc:
        query = query.filter(Notaria.vc.ilike(f"%{vc}%"))

    if apoderado:
        query = query.filter(Notaria.apoderado.ilike(f"%{apoderado}%"))

    if q:
        query = query.filter(
            or_(
                Notaria.nombre.ilike(f"%{q}%"),
                Notaria.apellidos.ilike(f"%{q}%"),
                Notaria.codigo.ilike(f"%{q}%"),
                Notaria.nif.ilike(f"%{q}%"),
            )
        )

    total = query.count()

    items = (
        query
        .order_by(Notaria.nombre.asc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": items
    }

# ---------------------------------------------------------
# OBTENER NOTARIA POR ID
# ---------------------------------------------------------
@router.get("/notarias/{notaria_id}")
def obtener(notaria_id: int, db: Session = Depends(get_db)):
    return obtener_notaria(db, notaria_id)

# ---------------------------------------------------------
# FIRMAS POR NOTARIA
# ---------------------------------------------------------
@router.get("/notarias/{notaria_id}/firmas")
def contar_firmas(notaria_id: int, db: Session = Depends(get_db)):
    total = db.query(Cita).filter(Cita.notario_id == notaria_id).count()
    vc = db.query(Cita).filter(Cita.notario_id == notaria_id, Cita.tipo_cita == "VC").count()
    presencial = db.query(Cita).filter(Cita.notario_id == notaria_id, Cita.tipo_cita == "P").count()

    return {
        "notaria_id": notaria_id,
        "total_firmas": total,
        "total_vc": vc,
        "total_presencial": presencial
    }
