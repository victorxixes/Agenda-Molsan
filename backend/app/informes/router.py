from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from backend.app.database import get_db
from backend.app.agenda.models import Cita
from backend.app.ctn.models import Notaria
from backend.app.empleados.models import Empleado

from backend.app.agenda.geocode import distancia_molsan

router = APIRouter(prefix="/informes/apoderados", tags=["Informes"])


# ---------------------------------------------------------
# FUNCIÓN AUXILIAR: obtener km reales de una cita
# ---------------------------------------------------------
def km_de_cita(db: Session, cita: Cita):
    # Si es VC → km = 0
    if cita.tipo_firma and cita.tipo_firma.lower().startswith("video"):
        return 0

    # Si no hay notario → km = 0
    if not cita.notario_id:
        return 0

    notario = db.query(Notaria).filter(Notaria.id == cita.notario_id).first()
    if not notario or not notario.lat or not notario.lng:
        return 0

    return distancia_molsan(notario.lat, notario.lng)


# ---------------------------------------------------------
# TABLA MENSUAL
# ---------------------------------------------------------
@router.get("/tabla")
def tabla_apoderados(mes: int, año: int, db: Session = Depends(get_db)):

    inicio = date(año, mes, 1)
    fin = date(año, mes, 28)
    while True:
        try:
            fin = date(año, mes, fin.day + 1)
        except:
            break

    citas = (
        db.query(Cita)
        .filter(Cita.fecha >= inicio)
        .filter(Cita.fecha <= fin)
        .all()
    )

    resultado = {}

    for c in citas:
        # Nombre del apoderado
        if c.apoderado_id:
            emp = db.query(Empleado).filter(Empleado.id == c.apoderado_id).first()
            nombre = f"{emp.nombre} {emp.apellidos}" if emp else "Sin nombre"
            ap_id = c.apoderado_id
        else:
            nombre = c.apoderado or "Sin nombre"
            ap_id = nombre  # clave textual

        if ap_id not in resultado:
            resultado[ap_id] = {
                "apoderado_id": ap_id,
                "nombre": nombre,
                "vc": 0,
                "presencial": 0,
                "km": 0,
            }

        # VC / Presencial
        if c.tipo_firma and c.tipo_firma.lower().startswith("video"):
            resultado[ap_id]["vc"] += 1
        else:
            resultado[ap_id]["presencial"] += 1

        # Km
        resultado[ap_id]["km"] += km_de_cita(db, c)

    return list(resultado.values())


# ---------------------------------------------------------
# RANKING
# ---------------------------------------------------------
@router.get("/ranking")
def ranking(mes: int, año: int, db: Session = Depends(get_db)):
    tabla = tabla_apoderados(mes, año, db)
    tabla.sort(key=lambda x: x["km"], reverse=True)
    return tabla


# ---------------------------------------------------------
# INFORME INDIVIDUAL
# ---------------------------------------------------------
@router.get("/{apoderado_id}")
def informe_apoderado(apoderado_id: int, mes: int, año: int, db: Session = Depends(get_db)):

    inicio = date(año, mes, 1)
    fin = date(año, mes, 28)
    while True:
        try:
            fin = date(año, mes, fin.day + 1)
        except:
            break

    citas = (
        db.query(Cita)
        .filter(Cita.fecha >= inicio)
        .filter(Cita.fecha <= fin)
        .filter(Cita.apoderado_id == apoderado_id)
        .all()
    )

    total_vc = 0
    total_pres = 0
    total_km = 0
    dias = []

    for c in citas:
        if c.tipo_firma and c.tipo_firma.lower().startswith("video"):
            total_vc += 1
        else:
            total_pres += 1

        total_km += km_de_cita(db, c)
        dias.append(c.fecha)

    tiempo_medio = 0
    if len(dias) >= 2:
        dias.sort()
        diffs = [(dias[i] - dias[i - 1]).days for i in range(1, len(dias))]
        tiempo_medio = sum(diffs) / len(diffs)

    return {
        "total_vc": total_vc,
        "total_presencial": total_pres,
        "km_totales": round(total_km, 2),
        "tiempo_medio_dias": round(tiempo_medio, 1),
    }
