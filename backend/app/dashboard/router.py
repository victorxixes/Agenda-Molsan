from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from backend.app.database import get_db
from backend.app.agenda.models import Cita

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/resumen")
def dashboard_resumen(db: Session = Depends(get_db)):
    hoy = date.today()

    citas_dia = db.query(Cita).filter(Cita.fecha == hoy).all()

    firmas_realizadas = {
        "videoconferencia": db.query(Cita).filter(Cita.tipo_firma == "VC", Cita.estado == "hecha").count(),
        "presencial": db.query(Cita).filter(Cita.tipo_firma == "P", Cita.estado == "hecha").count()
    }

    firmas_pendientes = {
        "videoconferencia": db.query(Cita).filter(Cita.tipo_firma == "VC", Cita.estado == "pendiente").count(),
        "presencial": db.query(Cita).filter(Cita.tipo_firma == "P", Cita.estado == "pendiente").count()
    }

    por_apoderado = []
    apoderados = db.query(Cita.apoderado_id).distinct().all()

    for (apo_id,) in apoderados:
        citas_apo = db.query(Cita).filter(Cita.apoderado_id == apo_id).all()

        por_apoderado.append({
            "apoderado_id": apo_id,
            "nombre": citas_apo[0].apoderado.nombre if citas_apo and citas_apo[0].apoderado else "Sin nombre",
            "videoconferencia": {
                "firmadas": sum(1 for c in citas_apo if c.tipo_firma == "VC" and c.estado == "hecha"),
                "pendientes": sum(1 for c in citas_apo if c.tipo_firma == "VC" and c.estado == "pendiente")
            },
            "presencial": {
                "firmadas": sum(1 for c in citas_apo if c.tipo_firma == "P" and c.estado == "hecha"),
                "pendientes": sum(1 for c in citas_apo if c.tipo_firma == "P" and c.estado == "pendiente")
            }
        })

    return {
        "firmas_realizadas": firmas_realizadas,
        "firmas_pendientes": firmas_pendientes,
        "por_apoderado": por_apoderado,
        "citas_dia": [c.to_dict() for c in citas_dia]
    }
