from datetime import date
from sqlalchemy.orm import Session

from backend.app.agenda.models import Cita
from backend.app.ctn.models import Notaria
from backend.app.empleados.models import Empleado
from backend.app.agenda.geocode import distancia_molsan


def km_de_cita(db: Session, cita: Cita):
    # VC → km = 0
    if cita.tipo_firma and cita.tipo_firma.lower().startswith("video"):
        return 0

    if not cita.notario_id:
        return 0

    notario = db.query(Notaria).filter(Notaria.id == cita.notario_id).first()
    if not notario or not notario.lat or not notario.lng:
        return 0

    try:
        return float(distancia_molsan(notario.lat, notario.lng))
    except Exception as e:
        print("ERROR KM:", e)
        return 0



def obtener_tabla(db: Session, mes: int, año: int):
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

    tabla = {}

    for c in citas:

        # Nombre del apoderado
        if c.apoderado_id:
            emp = db.query(Empleado).filter(Empleado.id == c.apoderado_id).first()
            nombre = f"{emp.nombre} {emp.apellidos}" if emp else "Sin nombre"
            ap_id = c.apoderado_id
        else:
            nombre = c.apoderado or "Sin nombre"
            ap_id = nombre

        if ap_id not in tabla:
            tabla[ap_id] = {
                "apoderado_id": ap_id,
                "nombre": nombre,
                "vc": 0,
                "presencial": 0,
                "km": 0,
            }

        # VC / Presencial
        if c.tipo_firma and c.tipo_firma.lower().startswith("video"):
            tabla[ap_id]["vc"] += 1
        else:
            tabla[ap_id]["presencial"] += 1

        # Km
        tabla[ap_id]["km"] += km_de_cita(db, c)

    return list(tabla.values())


def obtener_ranking(db: Session, mes: int, año: int):
    tabla = obtener_tabla(db, mes, año)
    tabla.sort(key=lambda x: x["km"], reverse=True)
    return tabla


def obtener_informe_individual(db: Session, apoderado_id: int, mes: int, año: int):
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
