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
            "apoderado": c.apoderado,
            "tipo_firma": "Videoconferencia" if c.vc == "SI" else "Presencial",
            "hora_inicio": str(c.hora_inicio),
            "hora_fin": str(c.hora_fin),
        })

    # -----------------------------------------
    # CTN — Resumen
    # -----------------------------------------
    presencial_total = db.query(Cita).filter(Cita.vc == "NO").count()
    vc_total = db.query(Cita).filter(Cita.vc == "SI").count()

   
