from sqlalchemy.orm import Session
from datetime import date, timedelta, time
from calendar import monthrange

from backend.app.agenda.models import Cita
from backend.app.ctn.models import Notaria
from backend.app.empleados.models import Empleado

def cita_con_relaciones(db: Session, cita: Cita):
    if not cita:
        return None

    notario = None
    apoderado = None

    # NOTARIO
    if cita.notario_id:
        try:
            notario = db.query(Notaria).filter(Notaria.id == cita.notario_id).first()
        except:
            notario = None

    # APODERADO
    if cita.apoderado_id:
        try:
            apoderado = db.query(Empleado).filter(Empleado.id == cita.apoderado_id).first()
        except:
            apoderado = None

    return {
        "id": cita.id,
        "fecha": cita.fecha,
        "hora_inicio": cita.hora_inicio,
        "hora_fin": cita.hora_fin,
        "tipo_cita": cita.tipo_cita,
        "tipo_firma": cita.tipo_firma,
        "estado": cita.estado,
        "observaciones": cita.observaciones,
        "notario": notario,
        "apoderado": apoderado,
        "apoderado_id": cita.apoderado_id
    }
