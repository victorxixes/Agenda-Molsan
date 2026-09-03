from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from backend.app.database import get_db
from backend.app.ctn.models import Notaria
from backend.app.agenda.models import Cita

router = APIRouter(prefix="/ctn", tags=["CTN"])

@router.get("/notarias")
def listar(
    db: Session = Depends(get_db),
    provincia: str | None = None,
    municipio: str | None = None,
    vc: str | None = None,
    apoderado: str | None = None,
    q: str | None = None,        # búsqueda general
    page: int = 1,
    page_size: int = 50
):
    query = db.query(Notaria)

    # Filtros
    if provincia:
        query = query.filter(Notaria.provincia.ilike(f"%{provincia}%"))

    if municipio:
        query = query.filter(Notaria.municipio.ilike(f"%{municipio}%"))

    if vc:
        query = query.filter(Notaria.vc.ilike(f"%{vc}%"))

    if apoderado:
        query = query.filter(Notaria.apoderado.ilike(f"%{apoderado}%"))

    # Búsqueda general
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
