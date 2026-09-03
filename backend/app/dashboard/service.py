from sqlalchemy.orm import Session
from datetime import date
from backend.app.agenda.models import Cita
from backend.app.empleados.models import Empleado
from backend.app.ctn.models import Notaria
from backend.app.agenda.geocode import distancia_molsan, distancia_km, ruta_molsan


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
    # AGENDA — Próximas citas
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
    # CTN — Resumen (desde Agenda)
    # -----------------------------------------
    presencial_total = db.query(Cita).filter(Cita.vc == "NO").count()
    vc_total = db.query(Cita).filter(Cita.vc == "SI").count()

    # -----------------------------------------
    # APODERADOS — Ranking + KM + Rutas
    # -----------------------------------------
    empleados = db.query(Empleado).filter(Empleado.rol == "apoderado").all()

    ranking = []
    km_total = 0

    for apo in empleados:
        # Solo citas PRESENCIALES
        citas_presenciales = db.query(Cita).filter(
            Cita.apoderado_id == apo.id,
            Cita.vc == "NO"
        ).all()

        firmas_total = len(citas_presenciales)

        # KM por cita
        km_por_cita = []
        notarias_ruta = []

        for cita in citas_presenciales:
            if cita.notario and cita.notario.lat and cita.notario.lng:
                km = distancia_molsan(cita.notario.lat, cita.notario.lng)
                km_por_cita.append(round(km, 2))

                notarias_ruta.append({
                    "nombre": cita.notario.nombre,
                    "lat": cita.notario.lat,
                    "lng": cita.notario.lng
                })

        # KM totales del apoderado
        km_apo = sum(km_por_cita)
        km_total += km_apo

        # Ruta completa Molsan → Notaría(s) → Molsan
        ruta = ruta_molsan(notarias_ruta) if notarias_ruta else None

        ranking.append({
            "apoderado_id": apo.id,
            "nombre": f"{apo.nombre} {apo.apellidos}",
            "firmas_presencial": firmas_total,
            "km_por_cita": km_por_cita,
            "km_total": km_apo,
            "ruta_completa": ruta
        })

    # Ordenar ranking por firmas presenciales
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
            "km_total": km_total
        }
    }
