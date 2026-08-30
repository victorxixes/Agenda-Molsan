from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from backend.app.database import get_db
from backend.app.agenda.models import Cita

router = APIRouter()

@router.get("/dashboard/agenda")
def dashboard_agenda(db: Session = Depends(get_db)):
    hoy = date.today()

    # Citas del día
    citas_hoy = db.query(Cita).filter(Cita.fecha == hoy).count()

    # Pendientes según estado
    citas_pendientes = db.query(Cita).filter(Cita.estado == "Pendiente").count()

    # Firmas VC y presenciales según tu modelo (vc = "SI" / "NO")
    firmas_hechas = db.query(Cita).filter(Cita.vc == "SI", Cita.estado == "Hecha").count()
    firmas_pendientes = db.query(Cita).filter(Cita.vc == "SI", Cita.estado == "Pendiente").count()

    presenciales_hechas = db.query(Cita).filter(Cita.vc == "NO", Cita.estado == "Hecha").count()
    presenciales_pendientes = db.query(Cita).filter(Cita.vc == "NO", Cita.estado == "Pendiente").count()

    # Tu modelo NO tiene provincia → se elimina
    citas_por_provincia = []

    # Citas por hora
    citas_por_hora = (
        db.query(Cita.hora_inicio, func.count())
        .group_by(Cita.hora_inicio)
        .all()
    )

    return {
        "citasHoy": citas_hoy,
        "citasPendientes": citas_pendientes,
        "firmasHechas": firmas_hechas,
        "firmasPendientes": firmas_pendientes,
        "presencialesHechas": presenciales_hechas,
        "presencialesPendientes": presenciales_pendientes,
        "vcHechas": firmas_hechas,
        "vcPendientes": firmas_pendientes,
        "citasPorProvincia": [],
        "citasPorHora": [
            {"hora": h.strftime("%H:%M"), "total": t} for h, t in citas_por_hora
        ]
    }
