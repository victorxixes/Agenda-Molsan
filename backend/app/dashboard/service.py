from sqlalchemy.orm import Session
from datetime import date
from backend.app.agenda.models import Cita
from backend.app.empleados.models import Empleado
from backend.app.ctn.models import Notaria
from backend.app.agenda.geocode import calcular_km_cita


def obtener_dashboard(db: Session):
    hoy = date.today()

    # -----------------------------------------
    # AGENDA — Citas del día (Presencial / VC)
    # -----------------------------------------
    presencial_hoy = db.query(Cita).filter(
        Cita.fecha == hoy,
        Cita.vc == "NO"
    ).count()

    vc_hoy = db.query(Cita).filter(
        Cita.fecha == hoy,
        Cita.vc == "SI"
    ).count()

    # -----------------------------------------
    # AGENDA — Próximas citas (lista estilo tablet)
    # -----------------------------------------
    proximas_raw = db.query(Cita).filter(
        Cita.fecha > hoy
    ).order_by(Cita.fecha.asc(), Cita.hora_inicio.asc()).limit(10).all()

    proximas = []
    for c in proximas_raw:
        proximas.append({
            "fecha": str(c.fecha),
            "notario": c.notario.nombre if c.notario else None,
            "apoderado": c.apoderado_s,
            "tipo_firma": "VC" if c.vc == "SI" else "Presencial",
            "hora_inicio": str(c.hora_inicio),
            "hora_fin": str(c.hora_fin)
        })

    # -----------------------------------------
    # CTN — Resumen (pero usando Agenda)
    # -----------------------------------------
    presencial_total = db.query(Cita).filter(Cita.vc == "NO").count()
    vc_total = db.query(Cita).filter(Cita.vc == "SI").count()

    # -----------------------------------------
    # APODERADOS — Ranking desde Agenda
    # -----------------------------------------
    empleados = db.query(Empleado).filter(Empleado.rol == "apoderado").all()

    ranking = []
    km_total = 0

    for apo in empleados:
        firmas_total = db.query(Cita).filter(Cita.apoderado_id == apo.id).count()
        firmas_pr = db.query(Cita).filter(Cita.apoderado_id == apo.id, Cita.vc == "NO").count()
        firmas_vc = db.query(Cita).filter(Cita.apoderado_id == apo.id, Cita.vc == "SI").count()

        citas_apo = db.query(Cita).filter(Cita.apoderado_id == apo.id).all()
        km_apo = sum(calcular_km_cita(c) for c in citas_apo)
        km_total += km_apo

        ranking.append({
            "apoderado_id": apo.id,
            "nombre": f"{apo.nombre} {apo.apellidos}",
            "firmas_total": firmas_total,
            "firmas_presencial": firmas_pr,
            "firmas_vc": firmas_vc,
            "km_recorridos": km_apo
        })

    ranking = sorted(ranking, key=lambda x: x["firmas_total"], reverse=True)

    return {
        "agenda": {
            "presencial_hoy": presencial_hoy,
            "vc_hoy": vc_hoy,
            "proximas": proximas
        },
        "ctn": {
            "presencial_total": presencial_total,
            "vc_total": vc_total
        },
        "apoderados": {
            "ranking": ranking,
            "presencial": presencial_total,
            "vc": vc_total,
            "km_recorridos": km_total
        }
    }
