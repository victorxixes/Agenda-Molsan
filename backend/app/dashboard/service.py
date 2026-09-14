from sqlalchemy.orm import Session
from datetime import date
from backend.app.agenda.models import Cita
from backend.app.empleados.models import Empleado

def obtener_dashboard(db: Session):
    hoy = date.today()

    # -----------------------------------------
    # AGENDA — Citas del día
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
    # AGENDA — Próximas citas
    # -----------------------------------------
    proximas_raw = db.query(Cita).filter(
        Cita.fecha > hoy
    ).order_by(Cita.fecha.asc(), Cita.hora_inicio.asc()).limit(10).all()

    proximas = []
    for c in proximas_raw:

        notario_nombre = None
        if c.notario and hasattr(c.notario, "nombre"):
            notario_nombre = c.notario.nombre

        proximas.append({
            "fecha": str(c.fecha),
            "notario": notario_nombre,
            "apoderado": c.apoderado_s,
            "tipo_firma": "VC" if c.vc == "SI" else "Presencial",
            "hora_inicio": str(c.hora_inicio),
            "hora_fin": str(c.hora_fin)
        })

    # -----------------------------------------
    # CTN — Resumen
    # -----------------------------------------
    presencial_total = db.query(Cita).filter(Cita.vc == "NO").count()
    vc_total = db.query(Cita).filter(Cita.vc == "SI").count()

    # -----------------------------------------
    # APODERADOS — Ranking (SIN KM, SIN RUTAS)
    # -----------------------------------------
    empleados = db.query(Empleado).filter(Empleado.rol == "apoderado").all()

    ranking = []

    for apo in empleados:
        citas_presenciales = db.query(Cita).filter(
            Cita.apoderado_id == apo.id,
            Cita.vc == "NO"
        ).all()

        firmas_total = len(citas_presenciales)

        ranking.append({
            "apoderado_id": apo.id,
            "nombre": f"{apo.nombre} {apo.apellidos}",
            "firmas_presencial": firmas_total,
            "km_por_cita": [],          # vacío
            "km_total": 0,              # sin cálculo
            "ruta_completa": None       # sin rutas
        })

    ranking = sorted(ranking, key=lambda x: x["firmas_presencial"], reverse=True)

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
            "km_total": 0
        }
    }
