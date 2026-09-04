from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

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

    # FILTROS NORMALES
    if provincia:
        provincia_clean = provincia.strip()
        query = query.filter(func.unaccent(Notaria.provincia).ilike(func.unaccent(f"%{provincia_clean}%")))

    if municipio:
        municipio_clean = municipio.strip()
        query = query.filter(func.unaccent(Notaria.municipio).ilike(func.unaccent(f"%{municipio_clean}%")))

    if vc:
        vc_clean = vc.strip()
        query = query.filter(func.unaccent(Notaria.vc).ilike(func.unaccent(f"%{vc_clean}%")))

    # FILTRO POR APODERADO (CORREGIDO)
    if apoderado:
        apoderado_clean = apoderado.strip()
        query = query.filter(
            func.unaccent(Notaria.apoderado).ilike(
                func.unaccent(f"%{apoderado_clean}%")
            )
        )

    # BÚSQUEDA GLOBAL q
    if q:
        q_clean = q.strip()
        query = query.filter(
            or_(
                func.unaccent(Notaria.nombre).ilike(func.unaccent(f"%{q_clean}%")),
                func.unaccent(Notaria.apellidos).ilike(func.unaccent(f"%{q_clean}%")),
                func.unaccent(Notaria.codigo).ilike(func.unaccent(f"%{q_clean}%")),
                func.unaccent(Notaria.nif).ilike(func.unaccent(f"%{q_clean}%")),
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
    try:
        notaria_id = int(str(notaria_id).strip())
    except:
        return None

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
