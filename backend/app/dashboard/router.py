from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from backend.app.database import get_db
from backend.app.agenda.models import Cita

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/agenda/kpis")
def dashboard_agenda_kpis(db: Session = Depends(get_db)):
    hoy = date.today()

    citas_hoy = db.query(Cita).filter(Cita.fecha == hoy).count()
    citas_pendientes = db.query(Cita).filter(Cita.fecha > hoy).count()

    # Firmas VC / Presencial según tu modelo
    firmas_hechas = db.query(Cita).filter(Cita.vc == "SI", Cita.fecha < hoy).count()
    firmas_pendientes = db.query(Cita).filter(Cita.vc == "SI", Cita.fecha > hoy).count()

    presenciales_hechas = db.query(Cita).filter(Cita.vc == "NO", Cita.fecha < hoy).count()
    presenciales_pendientes = db.query(Cita).filter(Cita.vc == "NO", Cita.fecha > hoy).count()

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
        "citasPorHora": []
    }


@router.get("/resumen")
def dashboard_resumen(db: Session = Depends(get_db)):
    hoy = date.today()

    citas_dia = db.query(Cita).filter(Cita.fecha == hoy).all()

    firmas_realizadas = {
        "videoconferencia": db.query(Cita)
            .filter(Cita.vc == "SI", Cita.fecha < hoy)
            .count(),
        "presencial": db.query(Cita)
            .filter(Cita.vc == "NO", Cita.fecha < hoy)
            .count(),
    }

    firmas_pendientes = {
        "videoconferencia": db.query(Cita)
            .filter(Cita.vc == "SI", Cita.fecha > hoy)
            .count(),
        "presencial": db.query(Cita)
            .filter(Cita.vc == "NO", Cita.fecha > hoy)
            .count(),
    }

    por_apoderado = []

    apoderados = (
        db.query(Cita.apoderado_id)
        .filter(Cita.apoderado_id.isnot(None))
        .distinct()
        .all()
    )

    for (apo_id,) in apoderados:
        citas_apo = db.query(Cita).filter(Cita.apoderado_id == apo_id).all()

        por_apoderado.append({
            "apoderado_id": apo_id,
            "videoconferencia": {
                "firmadas": sum(1 for c in citas_apo if c.vc == "SI" and c.fecha < hoy),
                "pendientes": sum(1 for c in citas_apo if c.vc == "SI" and c.fecha > hoy),
            },
            "presencial": {
                "firmadas": sum(1 for c in citas_apo if c.vc == "NO" and c.fecha < hoy),
                "pendientes": sum(1 for c in citas_apo if c.vc == "NO" and c.fecha > hoy),
            },
        })

    citas_dia_serializadas = [
        {
            "id": c.id,
            "fecha": c.fecha.isoformat(),
            "hora_inicio": c.hora_inicio.strftime("%H:%M"),
            "hora_fin": c.hora_fin.strftime("%H:%M"),
            "tipo_cita": c.tipo_cita,
            "vc": c.vc,
            "notario_id": c.notario_id,
            "apoderado_id": c.apoderado_id,
            "observacion": c.observacion,
        }
        for c in citas_dia
    ]

    return {
        "firmas_realizadas": firmas_realizadas,
        "firmas_pendientes": firmas_pendientes,
        "por_apoderado": por_apoderado,
        "citas_dia": citas_dia_serializadas,
    }
