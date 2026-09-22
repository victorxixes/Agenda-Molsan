from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
import time
import requests

from backend.app.database import engine, get_db
from backend.app.ctn.models import Notaria
from backend.app.ctn.service import obtener_notaria
from backend.app.agenda.models import Cita
from backend.app.ctn.schemas import NotariaResponse

router = APIRouter(prefix="/ctn", tags=["CTN"])

# ---------------------------------------------------------
# LISTAR NOTARÍAS
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
        provincia_clean = provincia.strip()
        query = query.filter(func.unaccent(Notaria.provincia).ilike(func.unaccent(f"%{provincia_clean}%")))

    if municipio:
        municipio_clean = municipio.strip()
        query = query.filter(func.unaccent(Notaria.municipio).ilike(func.unaccent(f"%{municipio_clean}%")))

    if vc:
        vc_clean = vc.strip()
        query = query.filter(func.unaccent(Notaria.vc).ilike(func.unaccent(f"%{vc_clean}%")))

    if apoderado:
        apoderado_clean = apoderado.strip()
        query = query.filter(func.unaccent(Notaria.apoderado).ilike(func.unaccent(f"%{apoderado_clean}%")))

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
        "items": [NotariaResponse.from_orm(n) for n in items]
    }


# ---------------------------------------------------------
# MIGRACIÓN: CREAR COLUMNAS lat/lng
# ---------------------------------------------------------
@router.post("/migracion/agregar-coordenadas")
def migracion_agregar_coordenadas():
    """
    Crea columnas lat y lng en ctn_notarios si no existen.
    Ejecutar UNA sola vez desde Swagger.
    """
    with engine.connect() as conn:
        try:
            conn.execute("ALTER TABLE ctn_notarios ADD COLUMN lat TEXT;")
        except Exception:
            pass

        try:
            conn.execute("ALTER TABLE ctn_notarios ADD COLUMN lng TEXT;")
        except Exception:
            pass

    return {"status": "ok", "detalle": "Columnas lat/lng creadas si no existían"}


# ---------------------------------------------------------
# OBTENER NOTARIA POR ID
# ---------------------------------------------------------
@router.get("/notarias/{notaria_id}", response_model=NotariaResponse)
def obtener(notaria_id: int, db: Session = Depends(get_db)):
    try:
        notaria_id = int(str(notaria_id).strip())
    except:
        return None

    notaria = obtener_notaria(db, notaria_id)
    if notaria is None:
        return None

    return NotariaResponse.from_orm(notaria)


# ---------------------------------------------------------
# GEOCODIFICACIÓN AUTOMÁTICA DE NOTARÍAS
# ---------------------------------------------------------
@router.post("/geocode/notarias")
def geocode_notarias(db: Session = Depends(get_db)):
    """
    Geocodifica TODAS las notarías sin lat/lng usando dirección completa.
    Ejecutar desde Swagger cuando quieras rellenar coordenadas.
    """

    notarias = (
        db.query(Notaria)
        .filter((Notaria.lat == None) | (Notaria.lng == None))
        .all()
    )

    actualizadas = 0
    fallos = 0

    for n in notarias:
        partes = []
        if n.direccion:
            partes.append(n.direccion)
        if n.cp:
            partes.append(n.cp)
        if n.municipio:
            partes.append(n.municipio)
        if n.provincia:
            partes.append(n.provincia)
        partes.append("España")

        direccion_completa = ", ".join(partes)

        if not direccion_completa.strip():
            fallos += 1
            continue

        try:
            url = "https://nominatim.openstreetmap.org/search"
            params = {
                "q": direccion_completa,
                "format": "json",
                "limit": 1,
            }
            headers = {
                "User-Agent": "SJ-2026-ERP/1.0 (contacto: soporte@molsan.es)"
            }

            resp = requests.get(url, params=params, headers=headers, timeout=10)
            data = resp.json()

            if not data:
                fallos += 1
                continue

            lat = data[0]["lat"]
            lng = data[0]["lon"]

            n.lat = lat
            n.lng = lng
            actualizadas += 1

            db.add(n)
            db.commit()

            time.sleep(1)

        except Exception as e:
            print("ERROR GEOCODIFICANDO NOTARIA:", n.id, direccion_completa, e)
            fallos += 1
            db.rollback()

    return {
        "status": "ok",
        "notarias_procesadas": len(notarias),
        "notarias_actualizadas": actualizadas,
        "notarias_con_fallo": fallos,
    }


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
