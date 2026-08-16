from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from backend.app.database import get_db
from backend.app.agenda.models import Cita

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/resumen")
def dashboard_resumen(db: Session = Depends(get_db)):
    hoy = date.today()

    # Citas del día (blindado, sin to_dict)
    citas_dia = db.query(Cita).filter(Cita.fecha == hoy).all()

    firmas_realizadas = {
        "videoconferencia": db.query(Cita)
            .filter(Cita.tipo_firma == "VC", Cita.estado == "hecha")
            .count(),
        "presencial": db.query(Cita)
            .filter(Cita.tipo_firma == "P", Cita.estado == "hecha")
            .count(),
    }

    firmas_pendientes = {
        "videoconferencia": db.query(Cita)
            .filter(Cita.tipo_firma == "VC", Cita.estado == "pendiente")
            .count(),
        "presencial": db.query(Cita)
            .filter(Cita.tipo_firma == "P", Cita.estado == "pendiente")
            .count(),
    }

    por_apoderado = []

    # Solo apoderados con ID no nulo
    apoderados = (
        db.query(Cita.apoderado_id)
        .filter(Cita.apoderado_id.isnot(None))
        .distinct()
        .all()
    )

    for (apo_id,) in apoderados:
        citas_apo = db.query(Cita).filter(Cita.apoderado_id == apo_id).all()

        # Nombre blindado: si no hay citas o no hay apoderado, "Sin nombre"
        if citas_apo:
            nombre_apo = getattr(citas_apo[0], "apoderado", None) or "Sin nombre"
        else:
            nombre_apo = "Sin nombre"

        por_apoderado.append({
            "apoderado_id": apo_id,
            "nombre": nombre_apo,
            "videoconferencia": {
                "firmadas": sum(
                    1 for c in citas_apo
                    if c.tipo_firma == "VC" and c.estado == "hecha"
                ),
                "pendientes": sum(
                    1 for c in citas_apo
                    if c.tipo_firma == "VC" and c.estado == "pendiente"
                ),
            },
            "presencial": {
                "firmadas": sum(
                    1 for c in citas_apo
                    if c.tipo_firma == "P" and c.estado == "hecha"
                ),
                "pendientes": sum(
                    1 for c in citas_apo
                    if c.tipo_firma == "P" and c.estado == "pendiente"
                ),
            },
        })

    # Serialización manual de citas_dia para evitar depender de to_dict()
    citas_dia_serializadas = [
        {
            "id": c.id,
            "fecha": c.fecha.isoformat() if c.fecha else None,
            "hora": getattr(c, "hora", None),
            "tipo_firma": c.tipo_firma,
            "estado": c.estado,
            "apoderado_id": getattr(c, "apoderado_id", None),
            "apoderado": getattr(c, "apoderado", None),
        }
        for c in citas_dia
    ]

    return {
        "firmas_realizadas": firmas_realizadas,
        "firmas_pendientes": firmas_pendientes,
        "por_apoderado": por_apoderado,
        "citas_dia": citas_dia_serializadas,
    }
