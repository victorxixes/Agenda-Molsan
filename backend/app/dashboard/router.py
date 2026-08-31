from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta

from backend.app.database import get_db
from backend.app.agenda.models import Cita
from backend.app.agenda.models import Notario as NotarioAgenda
from backend.app.empleados.models import Empleado

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/full")
def dashboard_full(db: Session = Depends(get_db)):
    hoy = date.today()
    inicio_semana = hoy - timedelta(days=hoy.weekday())
    fin_semana = inicio_semana + timedelta(days=6)

    # -----------------------------
    # 1. Citas del día (con nombres)
    # -----------------------------
    citas_dia = db.query(Cita).filter(Cita.fecha == hoy).all()
    citas_dia_serializadas = []

    for c in citas_dia:

        # NOTARIO (usar el notario del módulo Agenda)
        notario = None
        if c.notario_id:
            n = db.query(NotarioAgenda).filter(NotarioAgenda.id == c.notario_id).first()
            if n:
                notario = {
                    "id": n.id,
                    "nombre": n.nombre,
                    "apellidos": n.apellidos
                }

        # Apoderado
        apoderado = None
        if c.apoderado_id:
            a = db.query(Empleado).filter(Empleado.id == c.apoderado_id).first()
            if a:
                apoderado = {
                    "id": a.id,
                    "nombre": a.nombre,
                    "apellidos": a.apellidos
                }

        citas_dia_serializadas.append({
            "id": c.id,
            "fecha": c.fecha.isoformat(),
            "hora_inicio": c.hora_inicio.strftime("%H:%M") if c.hora_inicio else "—",
            "hora_fin": c.hora_fin.strftime("%H:%M") if c.hora_fin else "—",
            "tipo_cita": c.tipo_cita,
            "vc": c.vc,
            "notario": notario,
            "apoderado": apoderado,
            "observacion": c.observacion,
        })

    # -----------------------------
    # 2. KPIs principales
    # -----------------------------
    total_citas_hoy = len(citas_dia)
    vc_hoy = sum(1 for c in citas_dia if c.vc == "SI")
    presencial_hoy = sum(1 for c in citas_dia if c.vc == "NO")

    firmas_realizadas = {
        "videoconferencia": db.query(Cita).filter(Cita.vc == "SI", Cita.fecha < hoy).count(),
        "presencial": db.query(Cita).filter(Cita.vc == "NO", Cita.fecha < hoy).count(),
    }

    firmas_pendientes = {
        "videoconferencia": db.query(Cita).filter(Cita.vc == "SI", Cita.fecha > hoy).count(),
        "presencial": db.query(Cita).filter(Cita.vc == "NO", Cita.fecha > hoy).count(),
    }

    # -----------------------------
    # 3. Firmas por apoderado
    # -----------------------------
    por_apoderado = []
    apoderados_ids = (
        db.query(Cita.apoderado_id)
        .filter(Cita.apoderado_id.isnot(None))
        .distinct()
        .all()
    )

    for (apo_id,) in apoderados_ids:
        citas_apo = db.query(Cita).filter(Cita.apoderado_id == apo_id).all()

        apo_obj = db.query(Empleado).filter(Empleado.id == apo_id).first()
        nombre_apo = f"{apo_obj.nombre} {apo_obj.apellidos}" if apo_obj else "—"

        por_apoderado.append({
            "apoderado_id": apo_id,
            "nombre": nombre_apo,
            "videoconferencia": {
                "firmadas": sum(1 for c in citas_apo if c.vc == "SI" and c.fecha < hoy),
                "pendientes": sum(1 for c in citas_apo if c.vc == "SI" and c.fecha > hoy),
            },
            "presencial": {
                "firmadas": sum(1 for c in citas_apo if c.vc == "NO" and c.fecha < hoy),
                "pendientes": sum(1 for c in citas_apo if c.vc == "NO" and c.fecha > hoy),
            },
        })

    # -----------------------------
    # 4. Citas por hora
    # -----------------------------
    citas_por_hora = (
        db.query(Cita.hora_inicio, func.count())
        .filter(Cita.fecha == hoy)
        .group_by(Cita.hora_inicio)
        .all()
    )

    citas_por_hora_serializadas = [
        {"hora": h.strftime("%H:%M") if h else "—", "total": t}
        for h, t in citas_por_hora
    ]

    # -----------------------------
    # 5. Actividad semanal
    # -----------------------------
    citas_semana = db.query(Cita).filter(
        Cita.fecha >= inicio_semana,
        Cita.fecha <= fin_semana
    ).count()

    firmas_vc_semana = db.query(Cita).filter(
        Cita.fecha >= inicio_semana,
        Cita.fecha <= fin_semana,
        Cita.vc == "SI"
    ).count()

    firmas_p_semana = db.query(Cita).filter(
        Cita.fecha >= inicio_semana,
        Cita.fecha <= fin_semana,
        Cita.vc == "NO"
    ).count()

    actividad_semanal = {
        "citas": citas_semana,
        "vc": firmas_vc_semana,
        "presencial": firmas_p_semana
    }

    # -----------------------------
    # 6. RESPUESTA FINAL
    # -----------------------------
    return {
        "kpis": {
            "total_citas_hoy": total_citas_hoy,
            "vc_hoy": vc_hoy,
            "presencial_hoy": presencial_hoy,
            "firmas_realizadas": firmas_realizadas,
            "firmas_pendientes": firmas_pendientes
        },
        "citas_dia": citas_dia_serializadas,
        "por_apoderado": por_apoderado,
        "citas_por_hora": citas_por_hora_serializadas,
        "actividad_semanal": actividad_semanal
    }
