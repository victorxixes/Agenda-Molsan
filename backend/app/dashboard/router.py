from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from backend.app.dashboard.service import obtener_dashboard
from backend.app.dashboard.schemas import DashboardResponse

from backend.app.database import get_db
from backend.app.agenda.service import (
    listar_citas_dia,
    listar_citas_semana,
    listar_citas_mes
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# ---------------------------------------------------------
# DASHBOARD EXTENDIDO (usa los schemas y el service limpio)
# ---------------------------------------------------------
@router.get("/extendido", response_model=DashboardResponse)
def dashboard_extendido(db: Session = Depends(get_db)):
    return obtener_dashboard(db)


# ---------------------------------------------------------
# DASHBOARD SIMPLE (sin rutas, sin km, sin geocode)
# ---------------------------------------------------------
@router.get("/")
def dashboard(db: Session = Depends(get_db)):
    hoy = date.today()
    year = hoy.year
    month = hoy.month

    citas_hoy = listar_citas_dia(db, hoy)
    citas_semana = listar_citas_semana(db, hoy)
    citas_mes = listar_citas_mes(db, year, month)

    total_firmas = len([c for c in citas_mes if c.get("tipo_cita") == "Firma notarial"])
    total_vc = len([c for c in citas_mes if c.get("tipo_firma") == "Videoconferencia"])
    total_presencial = len([c for c in citas_mes if c.get("tipo_firma") == "Presencial"])

    proximas_raw = sorted(citas_hoy, key=lambda c: c.get("hora_inicio"))[:5]

    proximas = []
    for c in proximas_raw:
        apoderado = c.get("apoderado_nombre")  # ya viene formateado desde service

        proximas.append({
            "fecha": c.get("fecha"),
            "notario": c.get("notario_nombre"),
            "apoderado": apoderado,
            "tipo_firma": c.get("tipo_firma"),
            "hora_inicio": c.get("hora_inicio"),
            "hora_fin": c.get("hora_fin")
        })

    return {
        "hoy": len(citas_hoy),
        "semana": len(citas_semana),
        "mes": len(citas_mes),
        "firmas_mes": total_firmas,
        "vc_mes": total_vc,
        "presenciales_mes": total_presencial,
        "proximas": proximas
    }


